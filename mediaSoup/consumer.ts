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

        connectRecvTransport(
          socket,
          consumerTransport,
          remoteProducerId,
          params.id
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

        try {
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });

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

          if (params.kind === "audio") {
            updateAudioParticipant({ remoteProducerId, track });
          } else {
            roomVideoOwner_producerId = remoteProducerId;
            updateRoomVideo({ track });
          }

          socket.emit("consumer-resume", {
            serverConsumerId: params.serverConsumerId,
          });
          resolve({ consumer, consumerTransport });
        } catch (error) {
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
