import { io } from "socket.io-client";

let mediaSoupSocket: any = null;
let chatSocket: any = null;

const serverUrl = "http://160.30.113.117:3000";

export const getMediaSoupSocket = () => {
  if (!mediaSoupSocket) {
    mediaSoupSocket = io(serverUrl + "/mediasoup");
  }
  return mediaSoupSocket;
};

export const getChatSocket = () => {
  if (!chatSocket) {
    chatSocket = io(serverUrl);
  }
  return chatSocket;
};
// import { io } from "socket.io-client";

// let mediaSoupSocket: any = null;
// let chatSocket: any = null;

// const serverUrl = "http://160.30.113.117:3000";

// export const initializeSockets = async () => {
//   mediaSoupSocket = io(serverUrl + "/mediasoup");
//   chatSocket = io(serverUrl);

//   return {
//     mediaSoupSocket,
//     chatSocket,
//   };
// };

// export { mediaSoupSocket, chatSocket };
