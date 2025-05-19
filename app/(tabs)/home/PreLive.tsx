import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Audio } from "expo-av";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "../../../components/Image/Avatar";
import { BlurView } from "expo-blur";
import ImageCustom from "../../../components/Image/Image";
import { router } from "expo-router";
import * as mediaSoupModule from "../../../mediaSoup/index";
import { mediaSoupSocket } from "./SOSMap";
import { MediaStream, mediaDevices } from "react-native-webrtc";
const PreLive = () => {
  const { profile } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [tryToTurnOffAudio, setTryToTurnOffAudio] = useState(true);
  const [tryToTurnOffCamera, setTryToTurnOffCamera] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [showAudioParticipants, setShowAudioParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  // const [chatMessages, setChatMessages] = useState<
  //   { name?: string; content: string }[]
  // >([]);
  // const [chatInput, setChatInput] = useState("");

  // const handleSendLiveChat = () => {
  //   if (chatInput.trim()) {
  //     setChatMessages((prev) => [
  //       ...prev,
  //       { name: profile?.name, content: chatInput.trim() },
  //     ]);
  //     setChatInput("");
  //   }
  // };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
  };
  const toggleMute = () => {
    console.log("toggleMute");
    setTryToTurnOffAudio((prev) => {
      const newState = !prev;
      try {
        const { audioProducer } =
          mediaSoupModule.producerModule.getProducerInfo?.() || {};
        const audioTrack = videoStream.current?.getAudioTracks?.()[0];
        if (audioProducer && audioTrack) {
          audioTrack.enabled = !newState;
          mediaSoupSocket.emit("audio-status", {
            isAudioOn: !newState,
            producerId: audioProducer.id,
          });
        }
      } catch (err) {
        console.log("Error toggling audio:", err);
      }
      return newState;
    });
  };
  const toggleCamera = () => {
    console.log("toggleCamera");
    setTryToTurnOffCamera((prev) => {
      const newState = !prev;
      try {
        const { videoProducer } =
          mediaSoupModule.producerModule.getProducerInfo?.() || {};
        const videoTrack = videoStream.current?.getVideoTracks?.()[0];
        if (videoProducer && videoTrack) {
          videoTrack.enabled = !newState;
          mediaSoupSocket.emit("camera-status", {
            isCameraOn: !newState,
            producerId: videoProducer.id,
          });
        }
      } catch (err) {
        console.log("Error toggling camera:", err);
      }
      return newState;
    });
  };
  const getLocalStream = async (): Promise<void> => {
    try {
      //Only take streams if you have permission
      if (!hasPermission) {
        console.log("No camera or microphone access");
        return;
      }

      //Get stream from camera and mic
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Save to videoStream ref for use by other functions
      videoStream.current = stream;

      // Get audio/video track
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      // Set parameters for producer
      if (audioTrack && videoTrack) {
        const audioParams = { track: audioTrack };
        const videoParams = { track: videoTrack };
        mediaSoupModule.producerModule.setMediaParams(videoParams, audioParams);
      } else {
        console.log("Unable to get audio/video track from stream.");
      }
    } catch (error) {
      console.log("Error in getLocalStream:", (error as Error).message);
    }
  };
  const startStreaming = async () => {
    try {
      console.log("Starting streaming...");
      await getLocalStream();
      mediaSoupModule.joinRoom({ isConsumeOnly: false, userId: profile?.id });
    } catch (error) {
      console.log("Error starting streaming:", error);
    }
  };
  const stopStreaming = async () => {
    try {
      console.log("Stopping streaming...");
      if (videoStream.current) {
        videoStream.current.getTracks().forEach((track) => track.stop());
        videoStream.current = null;
      }
      setIsLiveStreaming(false);
      // mediaSoupModule.leaveRoom();
    } catch (error) {
      console.log("Error stopping streaming:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();

      if (cameraStatus !== "granted" || audioStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "App needs access to your camera and microphone to start live streaming. Please enable them in settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-center">
          Camera and microphone permissions are required to use this feature.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-gray-600 px-4 py-2 rounded"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Nếu có quyền thì dùng camera làm nền, không thì dùng màu 404040 */}
      {hasPermission && tryToTurnOffCamera ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mute={tryToTurnOffAudio}
          active={tryToTurnOffCamera}
        />
      ) : (
        <ImageBackground
          source={
            profile?.User.avatar_url
              ? { uri: profile.User.avatar_url }
              : require("../../../assets/images/ava1.png")
          }
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: "center", alignItems: "center" },
          ]}
          resizeMode="cover"
        >
          <BlurView
            intensity={50}
            tint="dark"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <Avatar source={profile?.User.avatar_url} width={120} height={120} />
          <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
          <TouchableOpacity
            onPress={toggleCamera}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: "#ffffff30",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Turn On Camera</Text>
          </TouchableOpacity>
        </ImageBackground>
      )}

      {/* Overlay content */}
      <View className="flex-1 w-full items-center px-4 relative">
        {/* User Info */}
        <View className="items-center absolute top-14 flex flex-row gap-2 w-full justify-between">
          <BlurView
            intensity={40}
            style={{ borderRadius: 30, overflow: "hidden" }}
            className="flex flex-row items-center gap-2 rounded-[30px] pl-3 pr-10 py-1"
          >
            <View className="w-[45px] h-[45px] bg-white rounded-full overflow-hidden justify-center items-center flex">
              <Avatar
                source={profile?.User.avatar_url}
                width={40}
                height={40}
                className="rounded-full z-10"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-white font-medium z-10">
                {profile?.name}
              </Text>
              <View className="flex flex-row items-center gap-1">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=oKCuVJn91KSH&format=png&color=000000"
                  width={12}
                  height={12}
                  color="white"
                />
                <Text className="text-[12px] text-white">0</Text>
              </View>
            </View>
          </BlurView>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
            <BlurView
              intensity={50}
              className="p-4 overflow-hidden rounded-full"
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
                width={20}
                height={20}
                color="white"
              />
            </BlurView>
          </TouchableOpacity>
        </View>
        <View className="absolute right-2 top-1/4 flex flex-col gap-5">
          <TouchableOpacity
            onPress={toggleCamera}
            activeOpacity={0.8}
            className="flex flex-col gap-1 justify-center items-center"
          >
            <ImageCustom
              source={
                tryToTurnOffCamera
                  ? "https://img.icons8.com/?size=100&id=59749&format=png&color=000000" // Thay thế bằng URL biểu tượng camera đang bật
                  : "https://img.icons8.com/?size=100&id=82601&format=png&color=000000" // Thay thế bằng URL biểu tượng camera đang tắt
              }
              width={25}
              height={25}
              color="white"
            />
            <Text className="text-white text-[12px]">Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleFacing}
            activeOpacity={0.8}
            className="flex flex-col gap-1 justify-center items-center"
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=IxtZfghGBNPZ&format=png&color=000000"
              width={25}
              height={25}
              color="white"
            />
            <Text className="text-white text-[12px]">Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleMute}
            activeOpacity={0.8}
            className="flex flex-col gap-1 justify-center items-center"
          >
            <ImageCustom
              source={
                tryToTurnOffAudio
                  ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
                  : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
              }
              width={25}
              height={25}
              color="white"
            />
            <Text className="text-white text-[12px]">Mic</Text>
          </TouchableOpacity>
        </View>

        <View className="bottom-10 left-0 right-0 absolute px-5">
          {!isLiveStreaming ? (
            <TouchableOpacity
              onPress={() => {
                startStreaming();
                setIsLiveStreaming(true);
              }}
              activeOpacity={0.9}
              className="bg-[#FF4D00] px-4 py-4 rounded-[30px] flex justify-center items-center w-full shadow-md"
            >
              <Text className="text-white font-semibold">Start Live</Text>
            </TouchableOpacity>
          ) : (
            <View className="w-full items-center justify-center py-4">
              <Text className="text-white text-lg font-semibold">
                You are live!
              </Text>
            </View>
          )}
        </View>

        {/* Live Chat UI when streaming */}
        {/* {isLiveStreaming && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: 10,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <View style={{ maxHeight: 120, marginBottom: 8 }}>
              <ScrollView
                style={{ maxHeight: 120 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                }}
                ref={(ref) => {
                  if (ref) ref.scrollToEnd({ animated: true });
                }}
              >
                {chatMessages?.map((msg, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: 4,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        marginRight: 6,
                      }}
                    >
                      {msg.name || "You"}:
                    </Text>
                    <Text style={{ color: "#fff" }}>{msg.content}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 20,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                style={{ flex: 1, height: 36, color: "#222" }}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type a message..."
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                onPress={handleSendLiveChat}
                style={{
                  marginLeft: 8,
                  padding: 6,
                  backgroundColor: "#FF4D00",
                  borderRadius: 16,
                }}
                disabled={!chatInput.trim()}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
      </View>
    </View>
  );
};

export default PreLive;
