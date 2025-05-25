import "react-native-webrtc";

declare module "react-native-webrtc" {
  interface RTCPeerConnection {
    addStream?(stream: MediaStream): void;
  }
}
