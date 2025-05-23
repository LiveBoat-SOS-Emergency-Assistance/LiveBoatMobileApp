import {
  signalNewConsumerTransport,
  handleProducerClosed,
  setConsumerDevice,
} from "./consumer";
import {
  createSendTransport,
  connectSendTransport,
  getProducersThenConsume,
  setProducerDevice,
  setMediaParams,
  getProducerInfo,
} from "./producer";
export const producerModule = {
  createSendTransport,
  connectSendTransport,
  getProducersThenConsume,
  setProducerDevice,
  setMediaParams,
  getProducerInfo,
};

import { Device } from "mediasoup-client";
import { getRoomName, mediaSoupSocket } from "../app/(tabs)/home/SOSMap";
import {
  updateViewCount,
  // updateCameraStatus,
  updateAudioStatus,
} from "../utils/liveStream";
import { updateCameraStatus } from "../app/(tabs)/home/PreLive";

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
