import {
  signalNewConsumerTransport,
  handleProducerClosed,
  setConsumerDevice,
  clearConsumingTransports,
  closeAllConsumers,
  resetConsumerModule,
  getConsumerInfo,
} from "./consumer";
import {
  createSendTransport,
  connectSendTransport,
  getProducersThenConsume,
  setProducerDevice,
  setMediaParams,
  getProducerInfo,
  closeAllProducers,
  resetProducerModule,
  clearProducer,
} from "./producer";
export const producerModule = {
  createSendTransport,
  connectSendTransport,
  getProducersThenConsume,
  setProducerDevice,
  setMediaParams,
  getProducerInfo,
  closeAllProducers,
  resetProducerModule,
  clearProducer,
};

export const consumerModule = {
  signalNewConsumerTransport,
  handleProducerClosed,
  setConsumerDevice,
  clearConsumingTransports,
  closeAllConsumers,
  resetConsumerModule,
  getConsumerInfo,
};

import { Device } from "mediasoup-client";
import { getRoomName, mediaSoupSocket } from "../app/(tabs)/home/SOSMap";

import {
  updateAudioStatus,
  updateCameraStatus,
  updateViewCount,
} from "../app/(tabs)/home/PreLive";

let device: any = null;
let rtpCapabilities: any = null;
let roomName: string = "";

(async () => {
  try {
    const result = await getRoomName();
    roomName = result || "";
  } catch (err) {
    console.error("Failed to get roomName:", err);
    roomName = "";
  }
})();

export const initializeMediaSoupModule = (): void => {
  console.log("Initializing MediaSoup module...");
  mediaSoupSocket.on("connection-success", (data: any) => {
    console.log("Connected to mediasoup socket:", data.socketId);
  });

  mediaSoupSocket.on("new-producer", (data: any) => {
    console.log("New producer:", data.producerId);
    signalNewConsumerTransport(mediaSoupSocket, data.producerId);
  });

  mediaSoupSocket.on("update-room-peers", () => {
    updateViewCount();
  });

  mediaSoupSocket.on("update-camera-status", async (data: any) => {
    console.log("Camera status update:", data);
    updateCameraStatus(data.isCameraOn, data.producerId);
  });

  mediaSoupSocket.on("update-audio-status", async (data: any) => {
    console.log("Audio status update:", data);
    updateAudioStatus(data.isAudioOn, data.producerId);
  });
};

const createDevice = async (isConsumeOnly: boolean = false): Promise<void> => {
  try {
    const device = new Device();
    // device = new Device({ handlerFactory: ReactNative });
    console.log("Creating device...");
    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    setProducerDevice(device, rtpCapabilities);
    setConsumerDevice(device);

    if (isConsumeOnly) {
      console.log("Creating consumer transport...");
      getProducersThenConsume(mediaSoupSocket);
    } else {
      console.log("Creating send transport...");
      const { transport } = await createSendTransport(mediaSoupSocket);
      console.log("transport calll", transport);
      try {
        console.log("connect send transport in createDevice");
        await connectSendTransport(mediaSoupSocket);
      } catch (error) {
        console.log("Error in createDevice", error);
      }
      console.log("helo...");
    }

    handleProducerClosed(mediaSoupSocket);
  } catch (error) {
    console.log("MediaSoup", error);
    if (error instanceof Error && error.name === "UnsupportedError") {
      console.warn("browser not supported");
    }
  }
};
export const getRoomPeersAmount = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!mediaSoupSocket) {
      reject(new Error("mediaSoupSocket not initialized"));
      return;
    }
    mediaSoupSocket.emit(
      "get-room-peers-amount",
      { roomName },
      (response: any) => {
        if (response && typeof response.count === "number") {
          resolve(response.count);
        } else {
          reject(new Error("Invalid response from server"));
        }
      }
    );
  });
};
export const joinRoom = async ({
  isConsumeOnly = false,
  userId = null,
  sosId = null,
}: any): Promise<void> => {
  console.log("Joining room:", sosId ?? roomName, userId);
  mediaSoupSocket.emit(
    "joinRoom",
    { roomName: sosId ? Number(sosId) : Number(roomName), userId },
    (data: any) => {
      rtpCapabilities = data.rtpCapabilities;
      createDevice(isConsumeOnly);
    }
  );

  updateViewCount();
};

// ✅ RESET FUNCTION - Clear hết mọi thứ về MediaSoup
export const reset = (): void => {
  console.log("🔄 Starting MediaSoup complete reset...");

  try {
    // 1. Remove all socket event listeners
    console.log("📡 Removing socket event listeners...");
    if (mediaSoupSocket) {
      mediaSoupSocket.off("connection-success");
      mediaSoupSocket.off("new-producer");
      mediaSoupSocket.off("update-room-peers");
      mediaSoupSocket.off("update-camera-status");
      mediaSoupSocket.off("update-audio-status");
      mediaSoupSocket.off("producer-closed");
      console.log("Socket event listeners removed");
    }

    // 2. Reset producer module (close producers, transports, clear vars)
    console.log("🎬 Resetting producer module...");
    resetProducerModule();

    // 3. Reset consumer module (close consumers, transports, clear arrays)
    console.log("📺 Resetting consumer module...");
    resetConsumerModule();

    // 4. Reset main module variables
    console.log("🧹 Clearing main module variables...");
    device = null;
    rtpCapabilities = null;

    // 5. Leave MediaSoup room if connected
    if (mediaSoupSocket && mediaSoupSocket.connected) {
      try {
        mediaSoupSocket.emit("leave-room");
        console.log("📤 Sent leave-room signal");
      } catch (error) {
        console.log("Error sending leave-room:", error);
      }
    }

    console.log("✅ MediaSoup complete reset finished!");
  } catch (error) {
    console.error("❌ Error during MediaSoup reset:", error);
  }
};
