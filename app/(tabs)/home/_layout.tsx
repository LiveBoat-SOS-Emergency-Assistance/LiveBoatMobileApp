import { Stack } from "expo-router";
import React from "react";
import { registerGlobals } from "react-native-webrtc";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from "react-native-webrtc";

registerGlobals();
if (typeof global !== "undefined") {
  global.RTCPeerConnection = RTCPeerConnection as any;
  global.RTCSessionDescription = RTCSessionDescription as any;
  global.RTCIceCandidate = RTCIceCandidate as any;
  global.MediaStream = MediaStream as any;
  global.navigator = global.navigator || {};
  Object.defineProperty(global.navigator, "mediaDevices", {
    value: mediaDevices,
    configurable: true,
    writable: true,
  });
}
// @ts-ignore
if (
  typeof RTCPeerConnection !== "undefined" &&
  // @ts-ignore
  !RTCPeerConnection.prototype.addStream
) {
  // @ts-ignore
  RTCPeerConnection.prototype.addStream = function (stream: any) {
    const existingTracks = this.getSenders().map((sender) => sender.track);
    stream.getTracks().forEach((track: any) => {
      if (!existingTracks.includes(track)) {
        this.addTrack(track, stream);
      }
    });
  };
}
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SOSAlert" options={{ headerShown: false }} />
      <Stack.Screen name="SOSMap" options={{ headerShown: false }} />
      <Stack.Screen
        name="SOSDisable"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="PreLive" options={{ headerShown: false }} />
      <Stack.Screen
        name="GroupChat"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          // headerTitle: () => (
          //   <ImageCustom
          //     source="https://img.icons8.com/?size=100&id=fJXFbcW0WrW9&format=png&color=000000"
          //     width={50}
          //     height={50}
          //     color="#fff"
          //   />
          // ),
          headerStyle: { backgroundColor: "#f87171" },
        }}
      />
    </Stack>
  );
}
