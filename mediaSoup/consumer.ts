import { updateRoomVideo } from "../app/(tabs)/home/PreLive";
import {
  updateAudioParticipant,
  removeAudioParticipant,
} from "../utils/liveStream";
// import updateAudioParticipant from "../app/(tabs)/home/SOSMap";
let device: any = null;
let consumerTransports: any[] = [];
let consumingTransports: string[] = [];

let roomVideoOwner_producerId: string | null = null;

export const setConsumerDevice = (newDevice: any): void => {
  device = newDevice;
};

export const signalNewConsumerTransport = async (
  socket: any,
  remoteProducerId: string,
  userInfo: any
): Promise<
  { consumer: any; consumerTransport: any; userInfo: any } | undefined
> => {
  if (!device) throw new Error("Device not initialized");
  console.log("signalNewConsumerTransport");
  if (consumingTransports.includes(remoteProducerId)) return;
  consumingTransports.push(remoteProducerId);
  console.log("consumingTransports calll");
  return new Promise((resolve, reject) => {
    socket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          reject(params.error);
          return;
        }

        let consumerTransport: any;
        try {
          consumerTransport = device!.createRecvTransport({
            ...params,
            iceServers: [
              {
                urls: ["stun:stun.l.google.com:19302"],
              },
            ],
          });
        } catch (error) {
          console.log(error);
          reject(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              await socket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );
        console.log("check before connectRecvTransport");
        connectRecvTransport(
          socket,
          consumerTransport,
          remoteProducerId,
          params.id,
          userInfo
        )
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

const connectRecvTransport = async (
  socket: any,
  consumerTransport: any,
  remoteProducerId: string,
  serverConsumerTransportId: string,
  userInfo: any
): Promise<{ consumer: any; consumerTransport: any; userInfo: any }> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "consume",
      {
        rtpCapabilities: device!.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: any) => {
        if (params.error) {
          console.log("Cannot Consume");
          reject(params.error);
          return;
        }
        console.log("CAlll connectRecvTransport 1");

        try {
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });
          console.log("CAlll connectRecvTransport 2");
          consumerTransports = [
            ...consumerTransports,
            {
              consumerTransport,
              serverConsumerTransportId: params.id,
              producerId: remoteProducerId,
              consumer,
            },
          ];

          const { track } = consumer;
          console.log("CAlll connectRecvTransport 3", track);

          if (params.kind === "audio") {
            updateAudioParticipant({ remoteProducerId, track, userInfo });
          } else {
            console.log("else called ");
            roomVideoOwner_producerId = remoteProducerId;
            updateRoomVideo({ track });
          }

          socket.emit("consumer-resume", {
            serverConsumerId: params.serverConsumerId,
          });
          resolve({ consumer, consumerTransport, userInfo });
        } catch (error) {
          console.log("Error in connectRecvTransport", error);
          reject(error);
        }
      }
    );
  });
};

export const handleProducerClosed = (socket: any): void => {
  socket.on("producer-closed", ({ remoteProducerId }: any) => {
    console.log("producer-closed: ", remoteProducerId);

    const producerToClose = consumerTransports.find(
      (transportData) => transportData.producerId === remoteProducerId
    );

    if (producerToClose) {
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();
      consumerTransports = consumerTransports.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      );

      removeAudioParticipant(remoteProducerId);

      if (remoteProducerId === roomVideoOwner_producerId) {
        roomVideoOwner_producerId = null;
        updateRoomVideo({ track: null });
      }
    }
  });
};

export const getConsumerInfo = () => {
  return {
    consumerTransports,
    consumingTransports,
  };
};

// Cleanup functions for proper consumer management
export const clearConsumingTransports = (): void => {
  console.log("Clearing consuming transports...");
  consumingTransports = [];
};

export const closeAllConsumers = (): void => {
  console.log("Closing all consumers...");

  // Close all consumer transports and consumers
  consumerTransports.forEach(({ consumerTransport, consumer, producerId }) => {
    try {
      if (consumer && !consumer.closed) {
        consumer.close();
        console.log(`Consumer closed for producer: ${producerId}`);
      }
      if (consumerTransport && consumerTransport.connectionState !== "closed") {
        consumerTransport.close();
        console.log(`Consumer transport closed for producer: ${producerId}`);
      }

      // Remove audio participant if it's an audio producer
      removeAudioParticipant(producerId);

      // Clear video if it's the room video owner
      if (producerId === roomVideoOwner_producerId) {
        roomVideoOwner_producerId = null;
        updateRoomVideo({ track: null });
      }
    } catch (error) {
      console.error(
        `Error closing consumer for producer ${producerId}:`,
        error
      );
    }
  });

  // Clear the arrays
  consumerTransports = [];
  consumingTransports = [];
  console.log("All consumers and transports cleared");
};

export const resetConsumerModule = (): void => {
  console.log("Resetting consumer module...");

  // Close all consumers first
  closeAllConsumers();

  // Reset device
  device = null;

  // Reset room video owner
  roomVideoOwner_producerId = null;

  console.log("Consumer module reset complete");
};
