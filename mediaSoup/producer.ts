import { signalNewConsumerTransport } from "./consumer";

let device: any = null;
let rtpCapabilities: any = null;
let producerTransport: any = null;
let audioProducer: any = null;
let videoProducer: any = null;
let videoParams: any = null;
let audioParams: any = null;

const defaultParams = {
  params: {
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  },
};

videoParams = defaultParams;
audioParams = {};

export const setProducerDevice = (
  newDevice: any,
  newRtpCapabilities: any
): void => {
  device = newDevice;
  rtpCapabilities = newRtpCapabilities;
};

export const setMediaParams = (
  newVideoParams: any,
  newAudioParams: any
): void => {
  videoParams = newVideoParams;
  audioParams = newAudioParams;
};

export const createSendTransport = (socket: any): Promise<any> => {
  if (!device) throw new Error("Device not initialized");

  return new Promise((resolve, reject) => {
    socket.emit(
      "createWebRtcTransport",
      { consumer: false },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          reject(params.error);
          return;
        }

        producerTransport = device.createSendTransport({
          ...params,
          // iceServers: [
          //   { urls: "stun:stun.l.google.com:19302" }
          // ]
        });

        producerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              await socket.emit("transport-connect", {
                dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        producerTransport.on(
          "produce",
          async (parameters: any, callback: any, errback: any) => {
            console.log("producerTransport produce", parameters);
            try {
              await socket.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist, error }: any) => {
                  if (error) {
                    console.error("Error producing:", error);
                    return;
                  }

                  callback({ id });

                  if (producersExist) {
                    getProducersThenConsume(socket);
                    resolve({
                      transport: producerTransport,
                      producersExist: true,
                    });
                  } else {
                    resolve({
                      transport: producerTransport,
                      producersExist: false,
                    });
                  }
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );
      }
    );
  });
};

export const connectSendTransport = async (socket: any): Promise<any> => {
  if (!producerTransport) throw new Error("Producer transport not initialized");

  if (videoParams?.track) {
    videoProducer = await producerTransport.produce(videoParams);

    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");
    });
  }

  if (audioParams?.track) {
    audioProducer = await producerTransport.produce(audioParams);
    audioProducer.on("trackended", () => {
      console.log("audio track ended");
    });

    audioProducer.on("transportclose", () => {
      console.log("audio transport ended");
    });
  }

  return { videoProducer, audioProducer };
};

export const getProducerInfo = () => {
  return {
    videoProducer,
    audioProducer,
    producerTransport,
  };
};

export const getProducersThenConsume = (socket: any): void => {
  socket.emit("getProducers", (producerIds: string[]) => {
    console.log("getProducersThenConsume producerIds", producerIds);
    producerIds.forEach((id) => signalNewConsumerTransport(socket, id));
  });
};
