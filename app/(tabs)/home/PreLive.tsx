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
import { router, useLocalSearchParams } from "expo-router";
import * as mediaSoupModule from "../../../mediaSoup/index";
import { mediaSoupSocket } from "./SOSMap";
import { MediaStream, RTCView, mediaDevices } from "react-native-webrtc";
import { getChatSocket } from "../../../utils/socket";
import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
import { updateViewCount } from "../../../utils/liveStream";
import { liveStreamService } from "../../../services/liveStream";
import { userServices } from "../../../services/user";
// Extend the Window interface to include setRemoteVideoTrack
declare global {
  interface Window {
    setRemoteVideoTrack?: (track: any) => void;
  }
}

export function updateRoomVideo(props: any): void {
  const { track } = props;

  if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
    window.setRemoteVideoTrack(track);
  }
  return track;
}

const PreLive = () => {
  const { isHost } = useLocalSearchParams<{ isHost: string }>();
  const isHostBool = isHost === "true";
  const { profile } = useAuth();
  const { sosId } = useLocalSearchParams<{ sosId: string }>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [tryToTurnOffAudio, setTryToTurnOffAudio] = useState(true);
  const [tryToTurnOffCamera, setTryToTurnOffCamera] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const chatSocket = getChatSocket();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollViewRef = useRef<ScrollView>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<any>(null);
  console.log("isHostBool, sosId", isHostBool, sosId);
  const [host, setHost] = useState<any>();
  const { userProfile } = useLocalSearchParams<{ userProfile: string }>();
  // console.log("userProfile", userProfile);
  useEffect(() => {
    if (isHostBool) return;
    const fetchHost = async () => {
      try {
        if (userProfile) {
          const parsedProfile = JSON.parse(userProfile);
          setHost(parsedProfile);
        } else {
          setHost(undefined);
        }
      } catch (error) {
        console.error("Error parsing userProfile:", error);
        setHost(undefined);
      }
    };
    fetchHost();
  }, [isHostBool, userProfile]);
  useEffect(() => {
    window.setRemoteVideoTrack = (track: any) => {
      setRemoteVideoTrack(track);
    };
    return () => {
      window.setRemoteVideoTrack = undefined;
    };
  }, []);

  useEffect(() => {
    const update = async () => {
      const count = await updateViewCount();
      setViewerCount(count);
    };

    update();
    mediaSoupSocket.on("update-room-peers", update);
    return () => {
      mediaSoupSocket.off("update-room-peers", update);
    };
  }, []);
  useEffect(() => {
    window.setRemoteVideoTrack = setRemoteVideoTrack;
    return () => {
      window.setRemoteVideoTrack = undefined;
    };
  }, []);
  useEffect(() => {
    if (!chatSocket || !groupId) return;
    initializeChatModule({
      chatSocket,
      groupId,
      onNewMessage: (msg) => setChatMessages((prev) => [...prev, msg]),
      onChatHistory: (msgs) => setChatMessages(msgs),
    });
    return () => {
      chatSocket.off("receive_message");
      chatSocket.off("chat_history");
    };
  }, [chatSocket, groupId]);

  useEffect(() => {
    if (isLiveStreaming && chatScrollViewRef.current) {
      chatScrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages, isLiveStreaming]);

  const handleSendLiveChat = () => {
    if (chatInput.trim()) {
      sendMessage(chatSocket, chatInput, groupId, profile?.id!);
      setChatInput("");
    }
  };
  const toggleFacing = () => {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
  };
  const toggleMute = () => {
    const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
    // console.log("Producer Info:", producerInfo);
    const { audioProducer } = producerInfo || {};
    const audioTrack = videoStream.current?.getAudioTracks()[0];

    if (!audioProducer) {
      console.log("No audio producer available");
      return;
    }
    if (!audioTrack) {
      console.log("No audio track available");
      return;
    }

    const newAudioState = !tryToTurnOffAudio;
    audioTrack.enabled = newAudioState;
    mediaSoupSocket.emit("audio-status", {
      isAudioOn: newAudioState,
      producerId: audioProducer.id,
    });
    setTryToTurnOffAudio(newAudioState);
  };
  const toggleCamera = () => {
    const { videoProducer } = mediaSoupModule.producerModule.getProducerInfo();
    const videoTrack = videoStream?.current?.getVideoTracks()[0];
    console.log("Video Track:", videoTrack);

    if (!videoProducer) {
      console.log("No video producer available");
      return;
    }

    if (tryToTurnOffCamera) {
      if (
        videoStream.current &&
        videoStream.current.getVideoTracks().length > 0
      ) {
        videoTrack!.enabled = false;
        mediaSoupSocket.emit("camera-status", {
          isCameraOn: false,
          producerId: videoProducer.id,
        });
      } else {
        console.log("No video track to stop");
      }
    } else {
      videoTrack!.enabled = true;
      mediaSoupSocket.emit("camera-status", {
        isCameraOn: true,
        producerId: videoProducer.id,
      });
    }
    setTryToTurnOffCamera((prev) => !prev);
  };
  const handleUpdateStatus = async () => {
    try {
      const result = await liveStreamService.update_livestream_status({
        sosId: Number(sosId),
        hasLivestream: true,
      });
      console.log("update live status");
    } catch (error) {
      console.log("Error in handleUpdateStatus:", error);
    }
  };

  const getLocalStream = async (): Promise<void> => {
    try {
      //Only take streams if you have permission
      if (!hasPermission) {
        console.log("No camera or microphone access");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

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
      console.log("profileid", profile?.id);
      mediaSoupModule.joinRoom({ isConsumeOnly: false, userId: profile?.id });
    } catch (error) {
      console.log("Error starting streaming:", error);
    }
  };

  useEffect(() => {
    if (!isHostBool) return;
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
  }, [isHostBool]);

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
      {hasPermission && tryToTurnOffCamera ? (
        remoteVideoTrack ? (
          <RTCView
            streamURL={new MediaStream([remoteVideoTrack]).toURL()}
            style={StyleSheet.absoluteFill}
            objectFit="cover"
          />
        ) : (
          <RTCView
            streamURL={new MediaStream([remoteVideoTrack]).toURL()}
            style={StyleSheet.absoluteFill}
            objectFit="cover"
          />
        )
      ) : isHostBool ? (
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
      ) : (
        <ImageBackground
          source={
            host && host.User && host.User.avatar_url
              ? { uri: host.User.avatar_url }
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
          <Avatar
            source={host && host.User ? host.User.avatar_url : undefined}
            width={120}
            height={120}
          />
          {/* <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text> */}
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
                source={
                  isHostBool
                    ? profile?.User.avatar_url
                    : host && host.User
                    ? host.User.avatar_url
                    : undefined
                }
                width={40}
                height={40}
                className="rounded-full z-10"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-white font-medium z-10">
                {isHostBool ? profile?.name : host ? host.name : ""}
              </Text>
              <View className="flex flex-row items-center gap-1">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=oKCuVJn91KSH&format=png&color=000000"
                  width={12}
                  height={12}
                  color="white"
                />
                <Text className="text-[12px] text-white">{viewerCount}</Text>
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
        {isHostBool && (
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
        )}

        <View className="bottom-5 left-0 right-0 absolute px-5">
          {isHostBool && !isLiveStreaming ? (
            <TouchableOpacity
              onPress={() => {
                startStreaming();
                setIsLiveStreaming(true);
                handleUpdateStatus();
              }}
              activeOpacity={0.9}
              className="bg-[#FF4D00] px-4 py-4 rounded-[30px] flex justify-center items-center w-full shadow-md"
            >
              <Text className="text-white font-semibold">Start Live</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: 10,
                backgroundColor: "transparent",
              }}
            >
              <View style={{ maxHeight: 210, marginBottom: 8 }}>
                <ScrollView style={{ maxHeight: 210 }} ref={chatScrollViewRef}>
                  {chatMessages.map((msg, idx) => (
                    <View
                      key={idx}
                      style={{
                        marginBottom: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 4,
                        gap: 5,
                      }}
                    >
                      <Avatar
                        source={msg?.avatar_url}
                        width={40}
                        height={40}
                      ></Avatar>
                      <View className="flex flex-col gap-0">
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
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View className="flex flex-row w-full px-5 gap-2">
                <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
                  <ImageCustom
                    width={20}
                    height={20}
                    color="gray"
                    className="abosolute left-1"
                    source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
                  ></ImageCustom>
                  <TextInput
                    value={chatInput}
                    onChangeText={setChatInput}
                    placeholder="Enter message..."
                    className="w-full h-full pl-2 pr-3 "
                  ></TextInput>
                </View>
                <TouchableOpacity
                  onPress={handleSendLiveChat}
                  className="bg-[#fbdada]  p-3 rounded-full"
                >
                  <ImageCustom
                    width={20}
                    height={20}
                    color="#EB4747"
                    source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
                  ></ImageCustom>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default PreLive;
