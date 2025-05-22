// // Polyfill for deprecated getRemoteStreams for legacy code compatibility
// const globalObjects = [
//   typeof global !== "undefined" ? global : undefined,
//   typeof globalThis !== "undefined" ? globalThis : undefined,
//   typeof window !== "undefined" ? window : undefined,
// ];

// for (const g of globalObjects) {
//   if (
//     g &&
//     g.RTCPeerConnection &&
//     !(g.RTCPeerConnection.prototype as any).getRemoteStreams
//   ) {
//     (g.RTCPeerConnection.prototype as any).getRemoteStreams = function () {
//       let tracks: any[] = [];
//       if (this.getReceivers) {
//         tracks = this.getReceivers()
//           .map((r: any) => r.track)
//           .filter(Boolean);
//       }
//       if (tracks.length && typeof g.MediaStream === "function") {
//         return [new g.MediaStream(tracks)];
//       }
//       // Fallback: return an empty array to avoid undefined issues
//       return [];
//     };
//   }
// }

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
  remoteProducerId: string
): Promise<{ consumer: any; consumerTransport: any } | undefined> => {
  if (!device) throw new Error("Device not initialized");

  if (consumingTransports.includes(remoteProducerId)) return;
  consumingTransports.push(remoteProducerId);

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
          // Polyfill getRemoteStreams for legacy compatibility
          if (
            consumerTransport.connection &&
            typeof consumerTransport.connection.getRemoteStreams !== "function"
          ) {
            consumerTransport.connection.getRemoteStreams = function () {
              // Always return an array with a MediaStream (even if empty)
              let tracks: any[] = [];
              if (this.getReceivers) {
                tracks = this.getReceivers()
                  .map((r: any) => r.track)
                  .filter(Boolean);
              }
              if (typeof MediaStream === "function") {
                return [new MediaStream(tracks)];
              }
              // Fallback: return a fake MediaStream with a no-op getTrackById
              return [
                {
                  getTrackById: () => undefined,
                  getTracks: () => [],
                  toURL: () => "",
                },
              ];
            };
          }
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
        console.log("signalNewConsumerTransport call", remoteProducerId);

        try {
          connectRecvTransport(
            socket,
            consumerTransport,
            remoteProducerId,
            params.id
          )
            .then(resolve)
            .catch(reject);
        } catch (error) {
          console.log("error in signalNewConsumerTransport", error);
          reject(error);
        }
      }
    );
  });
};

const connectRecvTransport = async (
  socket: any,
  consumerTransport: any,
  remoteProducerId: string,
  serverConsumerTransportId: string
): Promise<{ consumer: any; consumerTransport: any }> => {
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
        console.log("123");
        try {
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });
          console.log("456");
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
          console.log("connectrRecvTransports call", consumer);

          if (params.kind === "audio") {
            updateAudioParticipant({ remoteProducerId, track });
          } else {
            roomVideoOwner_producerId = remoteProducerId;
            updateRoomVideo({ track });
          }

          // Sau khi tạo consumer, gán ontrack cho peer connection nếu c
          socket.emit("consumer-resume", {
            serverConsumerId: params.serverConsumerId,
          });
          resolve({ consumer, consumerTransport });
        } catch (error) {
          console.log("Error in consumer transport:", error);
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
