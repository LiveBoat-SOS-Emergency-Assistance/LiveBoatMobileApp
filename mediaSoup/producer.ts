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
  console.log("device", device);
  if (!device) throw new Error("Device not initialized");
  console.log("createSendTransport");
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
        console.log("1");
        producerTransport = device.createSendTransport({
          ...params,
          iceServers: [
            {
              urls: ["stun:stun.l.google.com:19302"],
            },
          ],
        });
        console.log("2");

        producerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              console.log("31");
              await socket.emit("transport-connect", {
                dtlsParameters,
              });
              callback();
              console.log("3");
            } catch (error) {
              console.error("Error in transport connect callback:", error);
              errback(error);
            }
          }
        );

        producerTransport.on(
          "produce",
          async (parameters: any, callback: any, errback: any) => {
            console.log("producerTransport produce", parameters);
            try {
              console.log("transport-produce 1");
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
                  console.log("transport-produce 2");
                  callback({ id });
                  console.log("transport-produce 3");
                  if (producersExist) {
                    console.log("before transport-produce 4");
                    getProducersThenConsume(socket);
                    console.log("transport-produce 4");
                    resolve({
                      transport: producerTransport,
                      producersExist: true,
                    });
                    console.log("transport-produce 4.5");
                  } else {
                    console.log("transport-produce 5");
                    resolve({
                      transport: producerTransport,
                      producersExist: false,
                    });
                  }
                }
              );
              console.log("4");
            } catch (error) {
              console.error("Error in produce callback:", error);
              errback(error);
            }
          }
        );
        console.log("5");
        resolve({ transport: producerTransport });
      }
    );
  });
};

export const connectSendTransport = async (socket: any): Promise<any> => {
  // console.log("pls");
  if (!producerTransport) throw new Error("Producer transport not initialized");
  // console.log("videoParams", videoParams);
  if (videoParams?.track) {
    console.log("videoParams.track", videoParams.track);
    try {
      videoProducer = await producerTransport.produce(videoParams);
    } catch (error) {
      console.log("error producing video", error);
      // return;
    }
    console.log("videoProducer123");
    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");
    });
  }
  console.log("audioParams", audioParams);
  if (audioParams?.track) {
    console.log("audioParams.track", audioParams.track);
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
  console.log("videoProducer", videoProducer);
  console.log("audioProducer", audioProducer);
  // console.log("producerTransport", producerTransport);
  if (!producerTransport) throw new Error("Producer transport not initialized");
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
