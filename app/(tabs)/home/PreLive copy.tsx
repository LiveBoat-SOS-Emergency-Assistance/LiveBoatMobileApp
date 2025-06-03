// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   Alert,
// // //   Platform,
// // //   Linking,
// // //   StyleSheet,
// // //   Image,
// // //   ImageBackground,
// // //   ScrollView,
// // //   TextInput,
// // // } from "react-native";
// // // import { CameraView, Camera } from "expo-camera";
// // // import { Audio } from "expo-av";
// // // import { useAuth } from "../../../context/AuthContext";
// // // import Avatar from "../../../components/Image/Avatar";
// // // import { BlurView } from "expo-blur";
// // // import ImageCustom from "../../../components/Image/Image";
// // // import { router, useLocalSearchParams } from "expo-router";
// // // import * as mediaSoupModule from "../../../mediaSoup/index";
// // // import { mediaSoupSocket } from "./SOSMap";
// // // import { MediaStream, RTCView, mediaDevices } from "react-native-webrtc";
// // // import { getChatSocket } from "../../../utils/socket";
// // // import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
// // // import { updateViewCount } from "../../../utils/liveStream";
// // // import { liveStreamService } from "../../../services/liveStream";
// // // import { InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

// // // import { userServices } from "../../../services/user";
// // // // Extend the Window interface to include setRemoteVideoTrack
// // // let videotrack: any;
// // // declare global {
// // //   interface Window {
// // //     setRemoteVideoTrack?: (track: any) => void;
// // //   }
// // // }

// // // export function updateRoomVideo(props: any): void {
// // //   const { track } = props;

// // //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// // //     window.setRemoteVideoTrack(track);
// // //     console.log("Video track updated:", track);
// // //     videotrack = track;
// // //   }
// // //   return track;
// // // }

// // // export function updateCameraStatus(
// // //   isCameraOn: boolean,
// // //   producerId: string
// // // ): void {
// // //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// // //     console.log("Camera status updated:", isCameraOn, producerId);
// // //     // window.setRemoteVideoTrack(isCameraOn ? undefined : null);
// // //     if (isCameraOn) {
// // //       console.log("Camera is on", videotrack);
// // //       window.setRemoteVideoTrack(videotrack);
// // //     } else {
// // //       window.setRemoteVideoTrack(null);
// // //     }
// // //   }
// // //   // return isCameraOn;
// // // }

// // // const PreLive = () => {
// // //   const { isHost } = useLocalSearchParams<{ isHost: string }>();
// // //   const isHostBool = isHost === "true";
// // //   const { profile } = useAuth();
// // //   const { sosId } = useLocalSearchParams<{ sosId: string }>();
// // //   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
// // //   const cameraRef = useRef<CameraView | null>(null);
// // //   const videoStream = useRef<MediaStream | null>(null);
// // //   const [facing, setFacing] = useState<"front" | "back">("front");
// // //   const [tryToTurnOffAudio, setTryToTurnOffAudio] = useState(true);
// // //   const [tryToTurnOffCamera, setTryToTurnOffCamera] = useState(true);
// // //   const [isLiveStreaming, setIsLiveStreaming] = useState(false);
// // //   const { groupId } = useLocalSearchParams<{ groupId: string }>();
// // //   const chatSocket = getChatSocket();
// // //   const [chatMessages, setChatMessages] = useState<any[]>([]);
// // //   const [chatInput, setChatInput] = useState("");
// // //   const chatScrollViewRef = useRef<ScrollView>(null);
// // //   const [viewerCount, setViewerCount] = useState(0);
// // //   const [remoteVideoTrack, setRemoteVideoTrack] = useState<any>(null);
// // //   console.log("isHostBool, sosId", isHostBool, sosId);
// // //   const [host, setHost] = useState<any>();
// // //   const { userProfile } = useLocalSearchParams<{ userProfile: string }>();
// // //   const [isJoining, setIsJoining] = useState(false);
// // //   // GET HOST LIVE STREAM
// // //   useEffect(() => {
// // //     if (isHostBool) return;
// // //     const fetchHost = async () => {
// // //       try {
// // //         if (userProfile) {
// // //           const parsedProfile = JSON.parse(userProfile);
// // //           setHost(parsedProfile);
// // //         } else {
// // //           setHost(undefined);
// // //         }
// // //       } catch (error) {
// // //         console.error("Error parsing userProfile:", error);
// // //         setHost(undefined);
// // //       }
// // //     };
// // //     fetchHost();
// // //   }, [isHostBool, userProfile]);

// // //   useEffect(() => {
// // //     if (isHostBool) return;

// // //     const handleCameraStatus = ({
// // //       isCameraOn,
// // //       producerId,
// // //     }: {
// // //       isCameraOn: boolean;
// // //       producerId: string;
// // //     }) => {
// // //       console.log("Camera status received:", isCameraOn, producerId);
// // //       updateCameraStatus(isCameraOn, producerId);
// // //     };

// // //     mediaSoupSocket.on("camera-status", handleCameraStatus);
// // //     return () => {
// // //       mediaSoupSocket.off("camera-status", handleCameraStatus);
// // //     };
// // //   }, [isHostBool]);
// // //   // SET SOCKET
// // //   useEffect(() => {
// // //     window.setRemoteVideoTrack = (track: any) => {
// // //       setRemoteVideoTrack(track);
// // //     };
// // //     return () => {
// // //       window.setRemoteVideoTrack = undefined;
// // //     };
// // //   }, []);
// // //   // UPDATE VIEW COUNT
// // //   useEffect(() => {
// // //     const update = async () => {
// // //       const count = await updateViewCount();
// // //       setViewerCount(count);
// // //     };

// // //     update();
// // //     mediaSoupSocket.on("update-room-peers", update);
// // //     return () => {
// // //       mediaSoupSocket.off("update-room-peers", update);
// // //     };
// // //   }, []);

// // //   // useEffect(() => {
// // //   //   window.setRemoteVideoTrack = setRemoteVideoTrack;
// // //   //   return () => {
// // //   //     window.setRemoteVideoTrack = undefined;
// // //   //   };
// // //   // }, []);

// // //   // INITIALIZE CHAT SOCKET
// // //   useEffect(() => {
// // //     if (!chatSocket || !groupId) return;
// // //     initializeChatModule({
// // //       chatSocket,
// // //       groupId,
// // //       onNewMessage: (msg) => setChatMessages((prev) => [...prev, msg]),
// // //       onChatHistory: (msgs) => setChatMessages(msgs),
// // //     });
// // //     return () => {
// // //       chatSocket.off("receive_message");
// // //       chatSocket.off("chat_history");
// // //     };
// // //   }, [chatSocket, groupId]);

// // //   // SROLL CHAT VIEW

// // //   useEffect(() => {
// // //     if (isLiveStreaming && chatScrollViewRef.current) {
// // //       chatScrollViewRef.current.scrollToEnd({ animated: true });
// // //     }
// // //   }, [chatMessages, isLiveStreaming]);

// // //   // SEND MESSAGE
// // //   const handleSendLiveChat = () => {
// // //     if (chatInput.trim()) {
// // //       sendMessage(chatSocket, chatInput, groupId, profile?.id!);
// // //       setChatInput("");
// // //     }
// // //   };

// // //   // TOGGLE CAMERA FACING
// // //   const toggleFacing = () => {
// // //     setFacing((prev) => (prev === "front" ? "back" : "front"));
// // //   };

// // //   // TOGGLE MIC
// // //   const toggleMute = () => {
// // //     const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
// // //     // console.log("Producer Info:", producerInfo);
// // //     const { audioProducer } = producerInfo || {};
// // //     const audioTrack = videoStream.current?.getAudioTracks()[0];

// // //     if (!audioProducer) {
// // //       console.log("No audio producer available");
// // //       return;
// // //     }
// // //     if (!audioTrack) {
// // //       console.log("No audio track available");
// // //       return;
// // //     }

// // //     const newAudioState = !tryToTurnOffAudio;
// // //     audioTrack.enabled = newAudioState;
// // //     mediaSoupSocket.emit("audio-status", {
// // //       isAudioOn: newAudioState,
// // //       producerId: audioProducer.id,
// // //     });
// // //     setTryToTurnOffAudio(newAudioState);
// // //   };
// // //   // TOGGLE CAMERA
// // //   const toggleCamera = () => {
// // //     const { videoProducer } = mediaSoupModule.producerModule.getProducerInfo();
// // //     const videoTrack = videoStream?.current?.getVideoTracks()[0];
// // //     console.log("Video Track:", videoTrack);

// // //     if (!videoProducer) {
// // //       console.log("No video producer available");
// // //       return;
// // //     }

// // //     if (tryToTurnOffCamera) {
// // //       if (
// // //         videoStream.current &&
// // //         videoStream.current.getVideoTracks().length > 0
// // //       ) {
// // //         videoTrack!.enabled = false;
// // //         mediaSoupSocket.emit("camera-status", {
// // //           isCameraOn: false,
// // //           producerId: videoProducer.id,
// // //         });
// // //       } else {
// // //         console.log("No video track to stop");
// // //       }
// // //     } else {
// // //       videoTrack!.enabled = true;
// // //       mediaSoupSocket.emit("camera-status", {
// // //         isCameraOn: true,
// // //         producerId: videoProducer.id,
// // //       });
// // //     }
// // //     setTryToTurnOffCamera((prev) => !prev);
// // //   };

// // //   // useEffect(() => {
// // //   //   if (isHostBool) return;
// // //   //   const handleCameraStatus = ({
// // //   //     isCameraOn,
// // //   //     producerId,
// // //   //   }: {
// // //   //     isCameraOn: boolean;
// // //   //     producerId: string;
// // //   //   }) => {
// // //   //     console.log("Camera status received:", isCameraOn, producerId);
// // //   //     updateCameraStatus(isCameraOn, producerId);
// // //   //   };

// // //   //   mediaSoupSocket.on("camera-status", handleCameraStatus);
// // //   //   return () => {
// // //   //     mediaSoupSocket.off("camera-status", handleCameraStatus);
// // //   //   };
// // //   // }, [isHostBool]);

// // //   // UPDATE LIVE STATUS
// // //   const handleUpdateStatus = async () => {
// // //     try {
// // //       const result = await liveStreamService.update_livestream_status({
// // //         sosId: Number(sosId),
// // //         hasLivestream: true,
// // //       });
// // //       console.log("update live status");
// // //     } catch (error) {
// // //       console.log("Error in handleUpdateStatus:", error);
// // //     }
// // //   };

// // //   // GET LOCAL STREAM
// // //   const getLocalStream = async (): Promise<void> => {
// // //     try {
// // //       //Only take streams if you have permission
// // //       if (!hasPermission) {
// // //         console.log("No camera or microphone access");
// // //         return;
// // //       }
// // //       const stream = await navigator.mediaDevices.getUserMedia({
// // //         video: true,
// // //         audio: true,
// // //       });

// // //       // Get audio/video track
// // //       const audioTrack = stream.getAudioTracks()[0];
// // //       const videoTrack = stream.getVideoTracks()[0];
// // //       // Set parameters for producer
// // //       if (audioTrack && videoTrack) {
// // //         const audioParams = { track: audioTrack };
// // //         const videoParams = { track: videoTrack };
// // //         mediaSoupModule.producerModule.setMediaParams(videoParams, audioParams);
// // //       } else {
// // //         console.log("Unable to get audio/video track from stream.");
// // //       }
// // //     } catch (error) {
// // //       console.log("Error in getLocalStream:", (error as Error).message);
// // //     }
// // //   };

// // //   // HANDLE START STREAMING
// // //   const startStreaming = async () => {
// // //     try {
// // //       console.log("Starting streaming...");
// // //       await getLocalStream();
// // //       console.log("profileid", profile?.id);
// // //       mediaSoupModule.joinRoom({ isConsumeOnly: false, userId: profile?.id });
// // //     } catch (error) {
// // //       console.log("Error starting streaming:", error);
// // //     }
// // //   };

// // //   // REQUEST CAMERA AND AUDIO PERMISSIONS

// // //   useEffect(() => {
// // //     if (!isHostBool) return;
// // //     (async () => {
// // //       const { status: cameraStatus } =
// // //         await Camera.requestCameraPermissionsAsync();
// // //       const { status: audioStatus } = await Audio.requestPermissionsAsync();

// // //       if (cameraStatus !== "granted" || audioStatus !== "granted") {
// // //         Alert.alert(
// // //           "Permission Required",
// // //           "App needs access to your camera and microphone to start live streaming. Please enable them in settings.",
// // //           [
// // //             { text: "Cancel", style: "cancel" },
// // //             {
// // //               text: "Open Settings",
// // //               onPress: () => {
// // //                 if (Platform.OS === "ios") {
// // //                   Linking.openURL("app-settings:");
// // //                 } else {
// // //                   Linking.openSettings();
// // //                 }
// // //               },
// // //             },
// // //           ]
// // //         );
// // //         setHasPermission(false);
// // //       } else {
// // //         setHasPermission(true);
// // //       }
// // //     })();
// // //   }, [isHostBool]);

// // //   if (hasPermission === false) {
// // //     return (
// // //       <View className="flex-1 justify-center items-center bg-black">
// // //         <Text className="text-white text-center">
// // //           Camera and microphone permissions are required to use this feature.
// // //         </Text>
// // //         <TouchableOpacity
// // //           onPress={() => router.back()}
// // //           className="mt-4 bg-gray-600 px-4 py-2 rounded"
// // //         >
// // //           <Text className="text-white">Go Back</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   }
// // //   // const handleJoinLive = async () => {
// // //   //   try {
// // //   //     const { status: audioStatus } = await Audio.requestPermissionsAsync();
// // //   //     if (audioStatus !== "granted") {
// // //   //       Alert.alert(
// // //   //         "Permission Required",
// // //   //         "App needs access to your microphone to join the live stream. Please enable it in settings.",
// // //   //         [
// // //   //           { text: "Cancel", style: "cancel" },
// // //   //           {
// // //   //             text: "Open Settings",
// // //   //             onPress: () => {
// // //   //               if (Platform.OS === "ios") {
// // //   //                 Linking.openURL("app-settings:");
// // //   //               } else {
// // //   //                 Linking.openSettings();
// // //   //               }
// // //   //             },
// // //   //           },
// // //   //         ]
// // //   //       );
// // //   //       return;
// // //   //     }
// // //   //     // Thiết lập audio mode
// // //   //     await Audio.setAudioModeAsync({
// // //   //       allowsRecordingIOS: true,
// // //   //       playsInSilentModeIOS: true,
// // //   //       staysActiveInBackground: true,
// // //   //       interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
// // //   //       interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
// // //   //       shouldDuckAndroid: true,
// // //   //     });

// // //   //     // Tạo audio recording
// // //   //     const recording = new Audio.Recording();
// // //   //     await recording.prepareToRecordAsync(
// // //   //       Audio.RecordingOptionsPresets.HIGH_QUALITY
// // //   //     );
// // //   //     await recording.startAsync();

// // //   //     // Tạo MediaStream từ recording
// // //   //     const mediaStream = new MediaStream();
// // //   //     const audioTrack = mediaStream.addTrack(recording.getAudioTrack());
// // //   //     videoStream = mediaStream;

// // //   //     if (videoStream) {
// // //   //       let audioParams = { track: audioTrack };

// // //   //       // Thiết lập tham số audio cho producer
// // //   //       mediaSoupModule.producerModule.setMediaParams({}, audioParams);

// // //   //       // Tham gia phòng để bắt đầu streaming
// // //   //       mediaSoupModule.joinRoom({ userId: profile?.id });
// // //   //     } else {
// // //   //       console.log("Không thể lấy được audio stream.");
// // //   //     }
// // //   //   } catch (error) {
// // //   //     console.log("Error in handleJoinLive:", error);
// // //   //   }
// // //   // };

// // //   // ...

// // //   const handleJoinLive = async () => {
// // //     try {
// // //       // Request microphone permission
// // //       const { status: audioStatus } = await Audio.requestPermissionsAsync();
// // //       if (audioStatus !== "granted") {
// // //         Alert.alert(
// // //           "Permission Required",
// // //           "App needs access to your microphone to join the live stream. Please enable it in settings.",
// // //           [
// // //             { text: "Cancel", style: "cancel" },
// // //             {
// // //               text: "Open Settings",
// // //               onPress: () => {
// // //                 if (Platform.OS === "ios") {
// // //                   Linking.openURL("app-settings:");
// // //                 } else {
// // //                   Linking.openSettings();
// // //                 }
// // //               },
// // //             },
// // //           ]
// // //         );
// // //         return;
// // //       }

// // //       // Set audio mode
// // //       await Audio.setAudioModeAsync({
// // //         allowsRecordingIOS: true,
// // //         playsInSilentModeIOS: true,
// // //         staysActiveInBackground: true,
// // //         interruptionModeIOS: InterruptionModeIOS?.DoNotMix || 1,
// // //         interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix || 1,
// // //         shouldDuckAndroid: true,
// // //       });

// // //       // Get audio-only stream using react-native-webrtc
// // //       const stream = await mediaDevices.getUserMedia({
// // //         audio: true,
// // //         video: false,
// // //       });

// // //       // Store stream in ref
// // //       videoStream.current = stream;

// // //       // Get audio track
// // //       const audioTrack = stream.getAudioTracks()[0];
// // //       if (!audioTrack) {
// // //         console.log("No audio track available");
// // //         return;
// // //       }

// // //       // Set audio parameters for MediaSoup
// // //       const audioParams = { track: audioTrack };
// // //       mediaSoupModule.producerModule.setMediaParams({}, audioParams);

// // //       // Join room as audio-only participant
// // //       mediaSoupModule.joinRoom({
// // //         isConsumeOnly: false,
// // //         userId: profile?.id,
// // //         isAudioOnly: true,
// // //       });

// // //       // Update audio state
// // //       setTryToTurnOffAudio(true);
// // //       setIsJoining(true);
// // //     } catch (error) {
// // //       console.error("Error in handleJoinLive:", error);
// // //       Alert.alert("Error", "Failed to join live stream. Please try again.");
// // //     }
// // //   };
// // //   const handleLeaveLive = async () => {
// // //     if (videoStream.current) {
// // //       const audioTrack = videoStream.current.getAudioTracks()[0];
// // //       if (audioTrack) {
// // //         audioTrack.stop();
// // //         videoStream.current.removeTrack(audioTrack);
// // //       }
// // //     }
// // //     // updateCameraStatus(false, profile?.id);
// // //     setIsJoining(false);
// // //   };
// // //   return (
// // //     <View style={{ flex: 1 }}>
// // //       {isHostBool ? (
// // //         // Host view
// // //         hasPermission && !tryToTurnOffCamera ? (
// // //           <CameraView
// // //             ref={cameraRef}
// // //             style={StyleSheet.absoluteFill}
// // //             facing={facing}
// // //             mute={tryToTurnOffAudio}
// // //             active={!tryToTurnOffCamera}
// // //           />
// // //         ) : (
// // //           <ImageBackground
// // //             source={
// // //               profile?.User.avatar_url
// // //                 ? { uri: profile.User.avatar_url }
// // //                 : require("../../../assets/images/ava1.png")
// // //             }
// // //             style={[
// // //               StyleSheet.absoluteFill,
// // //               { justifyContent: "center", alignItems: "center" },
// // //             ]}
// // //             resizeMode="cover"
// // //           >
// // //             <BlurView
// // //               intensity={50}
// // //               tint="dark"
// // //               style={{ position: "absolute", width: "100%", height: "100%" }}
// // //             />
// // //             <Avatar
// // //               source={profile?.User.avatar_url}
// // //               width={120}
// // //               height={120}
// // //             />
// // //             <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
// // //             <TouchableOpacity
// // //               onPress={toggleCamera}
// // //               style={{
// // //                 marginTop: 20,
// // //                 padding: 10,
// // //                 backgroundColor: "#ffffff30",
// // //                 borderRadius: 5,
// // //               }}
// // //             >
// // //               <Text style={{ color: "white" }}>Turn On Camera</Text>
// // //             </TouchableOpacity>
// // //           </ImageBackground>
// // //         )
// // //       ) : // Viewer view
// // //       remoteVideoTrack ? (
// // //         <RTCView
// // //           streamURL={new MediaStream([remoteVideoTrack]).toURL()}
// // //           style={StyleSheet.absoluteFill}
// // //           objectFit="cover"
// // //         />
// // //       ) : (
// // //         <ImageBackground
// // //           source={
// // //             host?.User?.avatar_url
// // //               ? { uri: host.User.avatar_url }
// // //               : require("../../../assets/images/ava1.png")
// // //           }
// // //           style={[
// // //             StyleSheet.absoluteFill,
// // //             { justifyContent: "center", alignItems: "center" },
// // //           ]}
// // //           resizeMode="cover"
// // //         >
// // //           <BlurView
// // //             intensity={50}
// // //             tint="dark"
// // //             style={{ position: "absolute", width: "100%", height: "100%" }}
// // //           />
// // //           <Avatar source={host?.User?.avatar_url} width={120} height={120} />
// // //           <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
// // //         </ImageBackground>
// // //       )}

// // //       {/* Overlay content */}
// // //       <View className="flex-1 w-full items-center px-4 relative">
// // //         {/* User Info */}
// // //         <View className="items-center absolute top-14 flex flex-row gap-2 w-full justify-between">
// // //           <BlurView
// // //             intensity={40}
// // //             style={{ borderRadius: 30, overflow: "hidden" }}
// // //             className="flex flex-row items-center gap-2 rounded-[30px] pl-3 pr-10 py-1"
// // //           >
// // //             <View className="w-[45px] h-[45px] bg-white rounded-full overflow-hidden justify-center items-center flex">
// // //               <Avatar
// // //                 source={
// // //                   isHostBool
// // //                     ? profile?.User.avatar_url
// // //                     : host && host.User
// // //                     ? host.User.avatar_url
// // //                     : undefined
// // //                 }
// // //                 width={40}
// // //                 height={40}
// // //                 className="rounded-full z-10"
// // //               />
// // //             </View>
// // //             <View className="flex flex-col gap-1">
// // //               <Text className="text-white font-medium z-10">
// // //                 {isHostBool ? profile?.name : host ? host.name : ""}
// // //               </Text>
// // //               <View className="flex flex-row items-center gap-1">
// // //                 <ImageCustom
// // //                   source="https://img.icons8.com/?size=100&id=oKCuVJn91KSH&format=png&color=000000"
// // //                   width={12}
// // //                   height={12}
// // //                   color="white"
// // //                 />
// // //                 <Text className="text-[12px] text-white">{viewerCount}</Text>
// // //               </View>
// // //             </View>
// // //           </BlurView>
// // //           <TouchableOpacity
// // //             onPress={() => {
// // //               router.back();
// // //               if (!isHostBool) {
// // //                 handleLeaveLive();
// // //               }
// // //             }}
// // //             activeOpacity={0.8}
// // //           >
// // //             <BlurView
// // //               intensity={50}
// // //               className="p-4 overflow-hidden rounded-full"
// // //             >
// // //               <ImageCustom
// // //                 source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
// // //                 width={20}
// // //                 height={20}
// // //                 color="white"
// // //               />
// // //             </BlurView>
// // //           </TouchableOpacity>
// // //         </View>
// // //         {isHostBool ? (
// // //           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
// // //             <TouchableOpacity
// // //               onPress={toggleCamera}
// // //               activeOpacity={0.8}
// // //               className="flex flex-col gap-1 justify-center items-center"
// // //             >
// // //               <ImageCustom
// // //                 source={
// // //                   tryToTurnOffCamera
// // //                     ? "https://img.icons8.com/?size=100&id=59749&format=png&color=000000"
// // //                     : "https://img.icons8.com/?size=100&id=82601&format=png&color=000000"
// // //                 }
// // //                 width={25}
// // //                 height={25}
// // //                 color="white"
// // //               />
// // //               <Text className="text-white text-[12px]">Camera</Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               onPress={toggleFacing}
// // //               activeOpacity={0.8}
// // //               className="flex flex-col gap-1 justify-center items-center"
// // //             >
// // //               <ImageCustom
// // //                 source="https://img.icons8.com/?size=100&id=IxtZfghGBNPZ&format=png&color=000000"
// // //                 width={25}
// // //                 height={25}
// // //                 color="white"
// // //               />
// // //               <Text className="text-white text-[12px]">Flip</Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               onPress={toggleMute}
// // //               activeOpacity={0.8}
// // //               className="flex flex-col gap-1 justify-center items-center"
// // //             >
// // //               <ImageCustom
// // //                 source={
// // //                   tryToTurnOffAudio
// // //                     ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
// // //                     : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
// // //                 }
// // //                 width={25}
// // //                 height={25}
// // //                 color="white"
// // //               />
// // //               <Text className="text-white text-[12px]">Mic</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         ) : (
// // //           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
// // //             <TouchableOpacity
// // //               onPress={isJoining ? handleLeaveLive : handleJoinLive}
// // //               activeOpacity={0.8}
// // //               className="flex flex-col gap-1 justify-center items-center"
// // //             >
// // //               <ImageCustom
// // //                 source={
// // //                   isJoining
// // //                     ? "https://img.icons8.com/?size=100&id=Q1xkcFuVON39&format=png&color=000000"
// // //                     : "https://img.icons8.com/?size=100&id=115954&format=png&color=000000"
// // //                 }
// // //                 width={25}
// // //                 height={25}
// // //                 color="white"
// // //               />
// // //               <Text className="text-white text-[12px]">
// // //                 {isJoining ? "Leave" : "Join"}
// // //               </Text>
// // //             </TouchableOpacity>
// // //             {isJoining && (
// // //               <TouchableOpacity
// // //                 onPress={toggleMute}
// // //                 activeOpacity={0.8}
// // //                 className="flex flex-col gap-1 justify-center items-center"
// // //               >
// // //                 <ImageCustom
// // //                   source={
// // //                     tryToTurnOffAudio
// // //                       ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
// // //                       : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
// // //                   }
// // //                   width={25}
// // //                   height={25}
// // //                   color="white"
// // //                 />
// // //                 <Text className="text-white text-[12px]">Mic</Text>
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>
// // //         )}

// // //         <View className="bottom-5 left-0 right-0 absolute px-5">
// // //           {isHostBool && !isLiveStreaming ? (
// // //             <TouchableOpacity
// // //               onPress={() => {
// // //                 startStreaming();
// // //                 setIsLiveStreaming(true);
// // //                 handleUpdateStatus();
// // //               }}
// // //               activeOpacity={0.9}
// // //               className="bg-[#FF4D00] px-4 py-4 rounded-[30px] flex justify-center items-center w-full shadow-md"
// // //             >
// // //               <Text className="text-white font-semibold">Start Live</Text>
// // //             </TouchableOpacity>
// // //           ) : (
// // //             <View
// // //               style={{
// // //                 position: "absolute",
// // //                 left: 0,
// // //                 right: 0,
// // //                 bottom: 0,
// // //                 padding: 10,
// // //                 backgroundColor: "transparent",
// // //               }}
// // //             >
// // //               <View style={{ maxHeight: 210, marginBottom: 8 }}>
// // //                 <ScrollView style={{ maxHeight: 210 }} ref={chatScrollViewRef}>
// // //                   {chatMessages.map((msg, idx) => (
// // //                     <View
// // //                       key={idx}
// // //                       style={{
// // //                         marginBottom: 4,
// // //                         flexDirection: "row",
// // //                         alignItems: "center",
// // //                         padding: 4,
// // //                         gap: 5,
// // //                       }}
// // //                     >
// // //                       <Avatar
// // //                         source={msg?.avatar_url}
// // //                         width={40}
// // //                         height={40}
// // //                       ></Avatar>
// // //                       <View className="flex flex-col gap-0">
// // //                         <Text
// // //                           style={{
// // //                             color: "#fff",
// // //                             fontWeight: "bold",
// // //                             marginRight: 6,
// // //                           }}
// // //                         >
// // //                           {msg.name || "You"}:
// // //                         </Text>
// // //                         <Text style={{ color: "#fff" }}>{msg.content}</Text>
// // //                       </View>
// // //                     </View>
// // //                   ))}
// // //                 </ScrollView>
// // //               </View>
// // //               <View className="flex flex-row w-full px-5 gap-2">
// // //                 <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
// // //                   <ImageCustom
// // //                     width={20}
// // //                     height={20}
// // //                     color="gray"
// // //                     className="abosolute left-1"
// // //                     source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
// // //                   ></ImageCustom>
// // //                   <TextInput
// // //                     value={chatInput}
// // //                     onChangeText={setChatInput}
// // //                     placeholder="Enter message..."
// // //                     className="w-full h-full pl-2 pr-3 "
// // //                   ></TextInput>
// // //                 </View>
// // //                 <TouchableOpacity
// // //                   onPress={handleSendLiveChat}
// // //                   className="bg-[#fbdada]  p-3 rounded-full"
// // //                 >
// // //                   <ImageCustom
// // //                     width={20}
// // //                     height={20}
// // //                     color="#EB4747"
// // //                     source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
// // //                   ></ImageCustom>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // export default PreLive;
// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   Alert,
// //   Platform,
// //   Linking,
// //   StyleSheet,
// //   Image,
// //   ImageBackground,
// //   ScrollView,
// //   TextInput,
// // } from "react-native";
// // import { CameraView, Camera } from "expo-camera";
// // import { Audio } from "expo-av";
// // import { useAuth } from "../../../context/AuthContext";
// // import Avatar from "../../../components/Image/Avatar";
// // import { BlurView } from "expo-blur";
// // import ImageCustom from "../../../components/Image/Image";
// // import { router, useLocalSearchParams } from "expo-router";
// // import * as mediaSoupModule from "../../../mediaSoup/index";
// // import { mediaSoupSocket } from "./SOSMap";
// // import { MediaStream, RTCView, mediaDevices } from "react-native-webrtc";
// // import { getChatSocket } from "../../../utils/socket";
// // import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
// // import { updateViewCount } from "../../../utils/liveStream";
// // import { liveStreamService } from "../../../services/liveStream";
// // import { InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

// // import { userServices } from "../../../services/user";
// // // Extend the Window interface to include setRemoteVideoTrack
// // let videotrack: any;
// // declare global {
// //   interface Window {
// //     setRemoteVideoTrack?: (track: any) => void;
// //   }
// // }

// // export function updateRoomVideo(props: any): void {
// //   const { track } = props;

// //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// //     window.setRemoteVideoTrack(track);
// //     console.log("Video track updated:", track);
// //     videotrack = track;
// //   }
// //   return track;
// // }

// // // export function updateCameraStatus(
// // //   isCameraOn: boolean,
// // //   producerId: string
// // // ): void {
// // //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// // //     console.log("Camera status updated:", isCameraOn, producerId);
// // //     if (isCameraOn) {
// // //       console.log("Camera is on", videotrack);
// // //       window.setRemoteVideoTrack(videotrack);
// // //     } else {
// // //       window.setRemoteVideoTrack(null);
// // //     }
// // //   }
// // // }
// // export function updateCameraStatus(
// //   isCameraOn: boolean,
// //   producerId: string
// // ): void {
// //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// //     console.log("Camera status updated:", isCameraOn, producerId);
// //     if (isCameraOn && videotrack) {
// //       console.log("Setting video track:", videotrack);
// //       window.setRemoteVideoTrack(videotrack);
// //     } else {
// //       console.log("Clearing video track");
// //       window.setRemoteVideoTrack(null);
// //     }
// //   }
// // }
// // export function updateAudioStatus(
// //   isAudioOn: boolean,
// //   producerId: string
// // ): void {}

// // const PreLive = () => {
// //   const { isHost } = useLocalSearchParams<{ isHost: string }>();
// //   const isHostBool = isHost === "true";
// //   const { profile } = useAuth();
// //   const { sosId } = useLocalSearchParams<{ sosId: string }>();
// //   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
// //   const cameraRef = useRef<CameraView | null>(null);
// //   const videoStream = useRef<MediaStream | null>(null);
// //   const [facing, setFacing] = useState<"front" | "back">("front");
// //   const [isCameraOn, setIsCameraOn] = useState(true);
// //   const [isAudioOn, setIsAudioOn] = useState(true);
// //   const [isLiveStreaming, setIsLiveStreaming] = useState(false);
// //   const { groupId } = useLocalSearchParams<{ groupId: string }>();
// //   const chatSocket = getChatSocket();
// //   const [chatMessages, setChatMessages] = useState<any[]>([]);
// //   const [chatInput, setChatInput] = useState("");
// //   const chatScrollViewRef = useRef<ScrollView>(null);
// //   const [viewerCount, setViewerCount] = useState(0);
// //   const [remoteVideoTrack, setRemoteVideoTrack] = useState<any>(null);
// //   console.log("isHostBool, sosId", isHostBool, sosId);
// //   const [host, setHost] = useState<any>();
// //   const [loading, setLoading] = useState(false);
// //   const { userProfile } = useLocalSearchParams<{ userProfile: string }>();
// //   const [isJoining, setIsJoining] = useState(false);

// //   ////////////////////////// FUNCTION COMMON ////////////////////////
// //   // SET
// //   useEffect(() => {
// //     window.setRemoteVideoTrack = (track: any) => {
// //       setRemoteVideoTrack(track);
// //     };
// //     return () => {
// //       window.setRemoteVideoTrack = undefined;
// //     };
// //   }, []);

// //   // UPDATE VIEW COUNT
// //   useEffect(() => {
// //     const update = async () => {
// //       const count = await updateViewCount();
// //       setViewerCount(count);
// //     };

// //     update();
// //     mediaSoupSocket.on("update-room-peers", update);
// //     return () => {
// //       mediaSoupSocket.off("update-room-peers", update);
// //     };
// //   }, []);

// //   // INITIALIZE CHAT SOCKET
// //   useEffect(() => {
// //     if (!chatSocket || !groupId) return;
// //     initializeChatModule({
// //       chatSocket,
// //       groupId,
// //       onNewMessage: (msg) => setChatMessages((prev) => [...prev, msg]),
// //       onChatHistory: (msgs) => setChatMessages(msgs),
// //     });
// //     return () => {
// //       chatSocket.off("receive_message");
// //       chatSocket.off("chat_history");
// //     };
// //   }, [chatSocket, groupId]);

// //   // SROLL CHAT VIEW

// //   useEffect(() => {
// //     if (isLiveStreaming && chatScrollViewRef.current) {
// //       chatScrollViewRef.current.scrollToEnd({ animated: true });
// //     }
// //   }, [chatMessages, isLiveStreaming]);

// //   // SEND MESSAGE
// //   const handleSendLiveChat = () => {
// //     if (chatInput.trim()) {
// //       sendMessage(chatSocket, chatInput, groupId, profile?.id!);
// //       setChatInput("");
// //     }
// //   };

// //   ////////////////////////// FUNCTION FOR HOST LIVE STREAM ////////////////////////
// //   // TOGGLE CAMERA FACING
// //   const toggleFacing = () => {
// //     setFacing((prev) => (prev === "front" ? "back" : "front"));
// //   };
// //   // TOGGLE CAMERA
// //   const toggleCamera = () => {
// //     if (!isLiveStreaming) {
// //       setIsCameraOn((prev) => !prev);
// //       return;
// //     }
// //     console.log("Toggling camera during live stream");

// //     const { videoProducer } = mediaSoupModule.producerModule.getProducerInfo();
// //     console.log("Video Producer:", videoProducer);
// //     if (!videoStream.current) {
// //       console.log("No video stream available");
// //       return;
// //     }
// //     const videoTrack = videoStream?.current?.getVideoTracks()[0];
// //     console.log("Video Track:", videoTrack);

// //     if (!videoProducer || !videoTrack) {
// //       console.log("No video producer or track available");
// //       return;
// //     }

// //     const newCameraState = !isCameraOn;
// //     videoTrack.enabled = newCameraState;

// //     // Emit camera status to remote peers
// //     mediaSoupSocket.emit("camera-status", {
// //       isCameraOn: newCameraState,
// //       producerId: videoProducer.id,
// //     });

// //     // Update local state
// //     setIsCameraOn(newCameraState);

// //     console.log("Camera toggled to:", newCameraState);
// //   };
// //   // UPDATE LIVE STATUS
// //   const handleUpdateStatus = async () => {
// //     try {
// //       const result = await liveStreamService.update_livestream_status({
// //         sosId: Number(sosId),
// //         hasLivestream: true,
// //       });
// //       console.log("update live status");
// //     } catch (error) {
// //       console.log("Error in handleUpdateStatus:", error);
// //     }
// //   }; // GET LOCAL STREAM
// //   const getLocalStream = async (): Promise<void> => {
// //     try {
// //       if (!hasPermission) {
// //         console.log("No camera or microphone access");
// //         return;
// //       }

// //       const stream = await mediaDevices.getUserMedia({
// //         video: true,
// //         audio: true,
// //       });
// //       videoStream.current = stream;

// //       const audioTrack = stream.getAudioTracks()[0];
// //       const videoTrack = stream.getVideoTracks()[0];

// //       if (audioTrack && videoTrack) {
// //         // ✅ LUÔN enable tracks khi bắt đầu stream
// //         videoTrack.enabled = true;
// //         audioTrack.enabled = true;

// //         const audioParams = { track: audioTrack };
// //         const videoParams = { track: videoTrack };
// //         mediaSoupModule.producerModule.setMediaParams(videoParams, audioParams);

// //         console.log(
// //           "Media params set - Video enabled:",
// //           videoTrack.enabled,
// //           "Audio enabled:",
// //           audioTrack.enabled
// //         );

// //         // Cập nhật state UI theo tracks
// //         setIsCameraOn(videoTrack.enabled);
// //         setIsAudioOn(audioTrack.enabled);
// //       } else {
// //         console.log("Unable to get audio/video track from stream.");
// //       }
// //     } catch (error) {
// //       console.log("Error in getLocalStream:", error);
// //     }
// //   };

// //   // HANDLE START STREAMING
// //   // const startStreaming = async () => {
// //   //   try {
// //   //     console.log("Starting streaming...");
// //   //     await getLocalStream();
// //   //     console.log("profileid", profile?.id);
// //   //     mediaSoupModule.joinRoom({ isConsumeOnly: false, userId: profile?.id });
// //   //   } catch (error) {
// //   //     console.log("Error starting streaming:", error);
// //   //   }
// //   // };
// //   const startStreaming = async () => {
// //     try {
// //       console.log("Starting streaming...");
// //       await getLocalStream();

// //       // ✅ Join room TRƯỚC
// //       await mediaSoupModule.joinRoom({
// //         isConsumeOnly: false,
// //         userId: profile?.id,
// //         sosId: sosId,
// //       });

// //       // ✅ Sau đó mới get stream và set params

// //       console.log("Streaming started successfully");
// //     } catch (error) {
// //       console.log("Error starting streaming:", error);
// //     }
// //   };

// //   // REQUEST CAMERA AND AUDIO PERMISSIONS

// //   useEffect(() => {
// //     if (!isHostBool) return;
// //     (async () => {
// //       const { status: cameraStatus } =
// //         await Camera.requestCameraPermissionsAsync();
// //       const { status: audioStatus } = await Audio.requestPermissionsAsync();

// //       if (cameraStatus !== "granted" || audioStatus !== "granted") {
// //         Alert.alert(
// //           "Permission Required",
// //           "App needs access to your camera and microphone to start live streaming. Please enable them in settings.",
// //           [
// //             { text: "Cancel", style: "cancel" },
// //             {
// //               text: "Open Settings",
// //               onPress: () => {
// //                 if (Platform.OS === "ios") {
// //                   Linking.openURL("app-settings:");
// //                 } else {
// //                   Linking.openSettings();
// //                 }
// //               },
// //             },
// //           ]
// //         );
// //         setHasPermission(false);
// //       } else {
// //         setHasPermission(true);
// //       }
// //     })();
// //   }, [isHostBool]);

// //   if (hasPermission === false) {
// //     return (
// //       <View className="flex-1 justify-center items-center bg-black">
// //         <Text className="text-white text-center">
// //           Camera and microphone permissions are required to use this feature.
// //         </Text>
// //         <TouchableOpacity
// //           onPress={() => router.back()}
// //           className="mt-4 bg-gray-600 px-4 py-2 rounded"
// //         >
// //           <Text className="text-white">Go Back</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   ////////////////////////// FUNCTION FOR VIEWER  ////////////////////////

// //   // GET HOST LIVE STREAM
// //   useEffect(() => {
// //     if (isHostBool) return;
// //     const fetchHost = async () => {
// //       try {
// //         if (userProfile) {
// //           const parsedProfile = JSON.parse(userProfile);
// //           setHost(parsedProfile);
// //         } else {
// //           setHost(undefined);
// //         }
// //       } catch (error) {
// //         console.error("Error parsing userProfile:", error);
// //         setHost(undefined);
// //       }
// //     };
// //     fetchHost();
// //   }, [isHostBool, userProfile]);

// //   // UPDATE CAMERA STATUS

// //   useEffect(() => {
// //     if (isHostBool) return;

// //     const handleCameraStatus = ({
// //       isCameraOn,
// //       producerId,
// //     }: {
// //       isCameraOn: boolean;
// //       producerId: string;
// //     }) => {
// //       console.log("Camera status received:", isCameraOn, producerId);
// //       updateCameraStatus(isCameraOn, producerId);
// //     };

// //     mediaSoupSocket.on("camera-status", handleCameraStatus);
// //     return () => {
// //       mediaSoupSocket.off("camera-status", handleCameraStatus);
// //     };
// //   }, [isHostBool]);
// //   // TOGGLE MIC
// //   const toggleMute = () => {
// //     if (!isLiveStreaming) {
// //       setIsAudioOn((prev) => !prev);
// //       return;
// //     }

// //     console.log("Toggling microphone during live stream");

// //     const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
// //     const { audioProducer } = producerInfo || {};
// //     const audioTrack = videoStream.current?.getAudioTracks()[0];

// //     console.log("Audio Producer:", audioProducer);
// //     console.log("Audio Track:", audioTrack);

// //     if (!audioProducer) {
// //       console.log("No audio producer available");
// //       return;
// //     }
// //     if (!audioTrack) {
// //       console.log("No audio track available");
// //       return;
// //     }

// //     const newAudioState = !isAudioOn;
// //     audioTrack.enabled = newAudioState;

// //     // Emit audio status to remote peers
// //     mediaSoupSocket.emit("audio-status", {
// //       isAudioOn: newAudioState,
// //       producerId: audioProducer.id,
// //     });

// //     // Update local state
// //     setIsAudioOn(newAudioState);

// //     console.log("Microphone toggled to:", newAudioState);
// //   };

// //   // const handleJoinLive = async () => {
// //   //   try {
// //   //     // Request microphone permission
// //   //     const { status: audioStatus } = await Audio.requestPermissionsAsync();
// //   //     if (audioStatus !== "granted") {
// //   //       Alert.alert(
// //   //         "Permission Required",
// //   //         "App needs access to your microphone to join the live stream. Please enable it in settings.",
// //   //         [
// //   //           { text: "Cancel", style: "cancel" },
// //   //           {
// //   //             text: "Open Settings",
// //   //             onPress: () => {
// //   //               if (Platform.OS === "ios") {
// //   //                 Linking.openURL("app-settings:");
// //   //               } else {
// //   //                 Linking.openSettings();
// //   //               }
// //   //             },
// //   //           },
// //   //         ]
// //   //       );
// //   //       return;
// //   //     }
// //   //     console.log("Audio permission granted");
// //   //     // Set audio mode
// //   //     await Audio.setAudioModeAsync({
// //   //       allowsRecordingIOS: true,
// //   //       playsInSilentModeIOS: true,
// //   //       staysActiveInBackground: true,
// //   //       interruptionModeIOS: InterruptionModeIOS?.DoNotMix || 1,
// //   //       interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix || 1,
// //   //       shouldDuckAndroid: true,
// //   //     });

// //   //     console.log("Audio mode set");
// //   //     // Get audio-only stream using react-native-webrtc
// //   //     const stream = await mediaDevices.getUserMedia({
// //   //       audio: true,
// //   //       video: false,
// //   //     });

// //   //     // Store stream in ref
// //   //     videoStream.current = stream;

// //   //     // Get audio track
// //   //     const audioTrack = stream.getAudioTracks()[0];
// //   //     if (!audioTrack) {
// //   //       console.log("No audio track available");
// //   //       return;
// //   //     }
// //   //     console.log("Audio Track Prelive:", audioTrack);

// //   //     // Set audio parameters for MediaSoup
// //   //     const audioParams = { track: audioTrack };
// //   //     console.log("Audio Params:", audioParams);
// //   //     console.log("HOST Track:", remoteVideoTrack);
// //   //     mediaSoupModule.producerModule.setMediaParams({}, audioParams);

// //   //     // Join room as audio-only participant
// //   //     mediaSoupModule.joinRoom({
// //   //       isConsumeOnly: false,
// //   //       userId: profile?.id,
// //   //       sosId: sosId,
// //   //     });
// //   //     // setRemoteVideoTrack(videotrack);
// //   //     // Update audio state
// //   //     setTryToTurnOffAudio(true);
// //   //     setIsJoining(true);
// //   //   } catch (error) {
// //   //     console.error("Error in handleJoinLive:", error);
// //   //     Alert.alert("Error", "Failed to join live stream. Please try again.");
// //   //   }
// //   // };
// //   const handleJoinLive = async () => {
// //     try {
// //       // Request microphone permission
// //       const { status: audioStatus } = await Audio.requestPermissionsAsync();
// //       if (audioStatus !== "granted") {
// //         Alert.alert(
// //           "Permission Required",
// //           "App needs access to your microphone to join the live stream. Please enable it in settings.",
// //           [
// //             { text: "Cancel", style: "cancel" },
// //             {
// //               text: "Open Settings",
// //               onPress: () => {
// //                 if (Platform.OS === "ios") {
// //                   Linking.openURL("app-settings:");
// //                 } else {
// //                   Linking.openSettings();
// //                 }
// //               },
// //             },
// //           ]
// //         );
// //         return;
// //       }
// //       console.log("Audio permission granted");
// //       setLoading(true);

// //       // Set audio mode
// //       await Audio.setAudioModeAsync({
// //         allowsRecordingIOS: true,
// //         playsInSilentModeIOS: true,
// //         staysActiveInBackground: true,
// //         interruptionModeIOS: InterruptionModeIOS?.DoNotMix || 1,
// //         interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix || 1,
// //         shouldDuckAndroid: true,
// //       });
// //       console.log("Audio mode set");

// //       // Get audio-only stream
// //       const stream = await mediaDevices.getUserMedia({
// //         audio: true,
// //         video: false,
// //       });
// //       videoStream.current = stream;
// //       const audioTrack = stream.getAudioTracks()[0];
// //       if (!audioTrack) {
// //         console.log("No audio track available");
// //         return;
// //       }
// //       console.log("Audio Track Prelive:", audioTrack);

// //       // Set audio parameters for MediaSoup
// //       const audioParams = { track: audioTrack };
// //       mediaSoupModule.producerModule.setMediaParams({}, audioParams);

// //       setIsAudioOn(true);
// //       setIsJoining(true);
// //       try {
// //         await mediaSoupModule.joinRoom({
// //           isConsumeOnly: false,
// //           userId: profile?.id,
// //           sosId: sosId,
// //         });
// //       } catch (error) {
// //         console.log("Error joining room:", error);
// //         Alert.alert("Error", "Failed to join live stream. Please try again.");
// //         // return;
// //       }
// //       setRemoteVideoTrack(videotrack);
// //       console.log("Remote after join live stream", remoteVideoTrack);
// //     } catch (error) {
// //       console.error("Error in handleJoinLive:", error);
// //     }
// //   };
// //   const handleLeaveLive = async () => {
// //     if (videoStream.current) {
// //       const audioTrack = videoStream.current.getAudioTracks()[0];
// //       if (audioTrack) {
// //         audioTrack.stop();
// //         videoStream.current.removeTrack(audioTrack);
// //       }
// //     }

// //     setIsJoining(false);
// //   };
// //   // Thêm hàm endLive cho host
// //   const endLive = async () => {
// //     try {
// //       console.log("Ending live stream...");

// //       // 1. Stop all tracks
// //       if (videoStream.current) {
// //         const tracks = videoStream.current.getTracks();
// //         tracks.forEach((track) => {
// //           track.stop();
// //           videoStream.current?.removeTrack(track);
// //         });
// //       }

// //       // 2. Close MediaSoup producers
// //       try {
// //         const producerInfo = mediaSoupModule.producerModule.getProducerInfo();
// //         const { videoProducer, audioProducer } = producerInfo || {};

// //         if (videoProducer) {
// //           videoProducer.close();
// //           console.log("Video producer closed");
// //         }

// //         if (audioProducer) {
// //           audioProducer.close();
// //           console.log("Audio producer closed");
// //         }
// //       } catch (error) {
// //         console.log("Error closing producers:", error);
// //       }

// //       // 3. Leave MediaSoup room
// //       // try {
// //       //   mediaSoupSocket.emit("leave-room");
// //       //   console.log("Left MediaSoup room");
// //       // } catch (error) {
// //       //   console.log("Error leaving room:", error);
// //       // }

// //       // 4. Update live stream status to false
// //       try {
// //         await liveStreamService.update_livestream_status({
// //           sosId: Number(sosId),
// //           hasLivestream: false,
// //         });
// //         console.log("Live stream status updated to ended");
// //       } catch (error) {
// //         console.log("Error updating live status:", error);
// //       }

// //       // 5. Reset states
// //       setIsLiveStreaming(false);
// //       setIsCameraOn(false);
// //       setIsAudioOn(false);
// //       videoStream.current = null;
// //       router.back();

// //       console.log("Live stream ended successfully");
// //     } catch (error) {
// //       console.error("Error ending live stream:", error);
// //     }
// //   };

// //   // Sửa hàm handleClose để xử lý cả host và viewer
// //   const handleClose = async () => {
// //     if (isHostBool) {
// //       // Host: end live stream
// //       if (isLiveStreaming) {
// //         Alert.alert(
// //           "End Live Stream",
// //           "Are you sure you want to end the live stream?",
// //           [
// //             {
// //               text: "Cancel",
// //               style: "cancel",
// //             },
// //             {
// //               text: "End Live",
// //               style: "destructive",
// //               onPress: async () => {
// //                 await endLive();
// //                 router.back();
// //               },
// //             },
// //           ]
// //         );
// //       } else {
// //         // Chưa live thì back luôn
// //         router.back();
// //       }
// //     } else {
// //       // Viewer: leave live stream
// //       if (isJoining) {
// //         await handleLeaveLive();
// //       }
// //       router.back();
// //     }
// //   };

// //   useEffect(() => {
// //     if (remoteVideoTrack) {
// //       console.log("remoteVideoTrack state:", {
// //         enabled: remoteVideoTrack.enabled,
// //         readyState: remoteVideoTrack.readyState,
// //         muted: remoteVideoTrack.muted,
// //       });
// //     }
// //   }, [remoteVideoTrack]);
// //   return (
// //     <View style={{ flex: 1 }}>
// //       {isHostBool ? (
// //         // Host view
// //         hasPermission && isCameraOn ? (
// //           <CameraView
// //             ref={cameraRef}
// //             style={StyleSheet.absoluteFill}
// //             facing={facing}
// //             mute={!isAudioOn}
// //             active={isCameraOn}
// //           />
// //         ) : (
// //           <ImageBackground
// //             source={
// //               profile?.User.avatar_url
// //                 ? { uri: profile.User.avatar_url }
// //                 : require("../../../assets/images/ava1.png")
// //             }
// //             style={[
// //               StyleSheet.absoluteFill,
// //               { justifyContent: "center", alignItems: "center" },
// //             ]}
// //             resizeMode="cover"
// //           >
// //             <BlurView
// //               intensity={50}
// //               tint="dark"
// //               style={{ position: "absolute", width: "100%", height: "100%" }}
// //             />
// //             <Avatar
// //               source={profile?.User.avatar_url}
// //               width={120}
// //               height={120}
// //             />
// //             <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
// //             <TouchableOpacity
// //               onPress={toggleCamera}
// //               style={{
// //                 marginTop: 20,
// //                 padding: 10,
// //                 backgroundColor: "#ffffff30",
// //                 borderRadius: 5,
// //               }}
// //             >
// //               <Text style={{ color: "white" }}>Turn On Camera</Text>
// //             </TouchableOpacity>
// //           </ImageBackground>
// //         )
// //       ) : // Viewer view
// //       remoteVideoTrack &&
// //         remoteVideoTrack.enabled &&
// //         remoteVideoTrack.readyState === "live" ? (
// //         (console.log("[RTCView render] remoteVideoTrack:", remoteVideoTrack),
// //         (
// //           <RTCView
// //             streamURL={new MediaStream([remoteVideoTrack]).toURL()}
// //             style={StyleSheet.absoluteFill}
// //             objectFit="cover"
// //           />
// //         ))
// //       ) : (
// //         <ImageBackground
// //           source={
// //             host?.User?.avatar_url
// //               ? { uri: host.User.avatar_url }
// //               : require("../../../assets/images/ava1.png")
// //           }
// //           style={[
// //             StyleSheet.absoluteFill,
// //             { justifyContent: "center", alignItems: "center" },
// //           ]}
// //           resizeMode="cover"
// //         >
// //           <BlurView
// //             intensity={50}
// //             tint="dark"
// //             style={{ position: "absolute", width: "100%", height: "100%" }}
// //           />
// //           <Avatar source={host?.User?.avatar_url} width={120} height={120} />
// //           <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
// //         </ImageBackground>
// //       )}

// //       {/* Overlay content */}
// //       <View className="flex-1 w-full items-center px-4 relative">
// //         {/* User Info */}
// //         <View className="items-center absolute top-14 flex flex-row gap-2 w-full justify-between">
// //           <BlurView
// //             intensity={40}
// //             style={{ borderRadius: 30, overflow: "hidden" }}
// //             className="flex flex-row items-center gap-2 rounded-[30px] pl-3 pr-10 py-1"
// //           >
// //             <View className="w-[45px] h-[45px] bg-white rounded-full overflow-hidden justify-center items-center flex">
// //               <Avatar
// //                 source={
// //                   isHostBool
// //                     ? profile?.User.avatar_url
// //                     : host && host.User
// //                     ? host.User.avatar_url
// //                     : undefined
// //                 }
// //                 width={40}
// //                 height={40}
// //                 className="rounded-full z-10"
// //               />
// //             </View>
// //             <View className="flex flex-col gap-1">
// //               <Text className="text-white font-medium z-10">
// //                 {isHostBool ? profile?.name : host ? host.name : ""}
// //               </Text>
// //               <View className="flex flex-row items-center gap-1">
// //                 <ImageCustom
// //                   source="https://img.icons8.com/?size=100&id=oKCuVJn91KSH&format=png&color=000000"
// //                   width={12}
// //                   height={12}
// //                   color="white"
// //                 />
// //                 <Text className="text-[12px] text-white">{viewerCount}</Text>
// //               </View>
// //             </View>
// //           </BlurView>
// //           <TouchableOpacity
// //             onPress={() => {
// //               if (isHostBool) {
// //                 handleClose();
// //               } else {
// //                 router.back();
// //                 if (!isHostBool) {
// //                   handleLeaveLive();
// //                 }
// //               }
// //             }}
// //             activeOpacity={0.8}
// //           >
// //             <BlurView
// //               intensity={50}
// //               className="p-4 overflow-hidden rounded-full"
// //             >
// //               <ImageCustom
// //                 source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
// //                 width={20}
// //                 height={20}
// //                 color="white"
// //               />
// //             </BlurView>
// //           </TouchableOpacity>
// //         </View>
// //         {isHostBool ? (
// //           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
// //             <TouchableOpacity
// //               onPress={toggleCamera}
// //               activeOpacity={0.8}
// //               className="flex flex-col gap-1 justify-center items-center"
// //             >
// //               <ImageCustom
// //                 source={
// //                   isCameraOn
// //                     ? "https://img.icons8.com/?size=100&id=59749&format=png&color=000000"
// //                     : "https://img.icons8.com/?size=100&id=82601&format=png&color=000000"
// //                 }
// //                 width={25}
// //                 height={25}
// //                 color="white"
// //               />
// //               <Text className="text-white text-[12px]">Camera</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               onPress={toggleFacing}
// //               activeOpacity={0.8}
// //               className="flex flex-col gap-1 justify-center items-center"
// //             >
// //               <ImageCustom
// //                 source="https://img.icons8.com/?size=100&id=IxtZfghGBNPZ&format=png&color=000000"
// //                 width={25}
// //                 height={25}
// //                 color="white"
// //               />
// //               <Text className="text-white text-[12px]">Flip</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               onPress={toggleMute}
// //               activeOpacity={0.8}
// //               className="flex flex-col gap-1 justify-center items-center"
// //             >
// //               <ImageCustom
// //                 source={
// //                   isAudioOn
// //                     ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
// //                     : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
// //                 }
// //                 width={25}
// //                 height={25}
// //                 color="white"
// //               />
// //               <Text className="text-white text-[12px]">Mic</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ) : (
// //           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
// //             <TouchableOpacity
// //               onPress={isJoining ? handleLeaveLive : handleJoinLive}
// //               activeOpacity={0.8}
// //               className="flex flex-col gap-1 justify-center items-center"
// //             >
// //               <ImageCustom
// //                 source={
// //                   isJoining
// //                     ? "https://img.icons8.com/?size=100&id=Q1xkcFuVON39&format=png&color=000000"
// //                     : "https://img.icons8.com/?size=100&id=115954&format=png&color=000000"
// //                 }
// //                 width={25}
// //                 height={25}
// //                 color="white"
// //               />
// //               <Text className="text-white text-[12px]">
// //                 {isJoining ? "Leave" : "Join"}
// //               </Text>
// //             </TouchableOpacity>
// //             {isJoining && (
// //               <TouchableOpacity
// //                 onPress={toggleMute}
// //                 activeOpacity={0.8}
// //                 className="flex flex-col gap-1 justify-center items-center"
// //               >
// //                 <ImageCustom
// //                   source={
// //                     isAudioOn
// //                       ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
// //                       : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
// //                   }
// //                   width={25}
// //                   height={25}
// //                   color="white"
// //                 />
// //                 <Text className="text-white text-[12px]">Mic</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         )}

// //         <View className="bottom-5 left-0 right-0 absolute px-5">
// //           {isHostBool && !isLiveStreaming ? (
// //             <TouchableOpacity
// //               onPress={async () => {
// //                 // setIsCameraOn(true);
// //                 // setIsAudioOn(true);

// //                 await startStreaming();
// //                 setIsLiveStreaming(true);
// //                 await handleUpdateStatus();
// //               }}
// //               activeOpacity={0.9}
// //               className="bg-[#FF4D00] px-4 py-4 rounded-[30px] flex justify-center items-center w-full shadow-md"
// //             >
// //               <Text className="text-white font-semibold">Start Live</Text>
// //             </TouchableOpacity>
// //           ) : (
// //             <View
// //               style={{
// //                 position: "absolute",
// //                 left: 0,
// //                 right: 0,
// //                 bottom: 0,
// //                 padding: 10,
// //                 backgroundColor: "transparent",
// //               }}
// //             >
// //               <View style={{ maxHeight: 210, marginBottom: 8 }}>
// //                 <ScrollView style={{ maxHeight: 210 }} ref={chatScrollViewRef}>
// //                   {chatMessages.map((msg, idx) => (
// //                     <View
// //                       key={idx}
// //                       style={{
// //                         marginBottom: 4,
// //                         flexDirection: "row",
// //                         alignItems: "center",
// //                         padding: 4,
// //                         gap: 5,
// //                       }}
// //                     >
// //                       <Avatar
// //                         source={msg?.avatar_url}
// //                         width={40}
// //                         height={40}
// //                       ></Avatar>
// //                       <View className="flex flex-col gap-0">
// //                         <Text
// //                           style={{
// //                             color: "#fff",
// //                             fontWeight: "bold",
// //                             marginRight: 6,
// //                           }}
// //                         >
// //                           {msg.name || "You"}:
// //                         </Text>
// //                         <Text style={{ color: "#fff" }}>{msg.content}</Text>
// //                       </View>
// //                     </View>
// //                   ))}
// //                 </ScrollView>
// //               </View>
// //               <View className="flex flex-row w-full px-5 gap-2">
// //                 <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
// //                   <ImageCustom
// //                     width={20}
// //                     height={20}
// //                     color="gray"
// //                     className="abosolute left-1"
// //                     source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
// //                   ></ImageCustom>
// //                   <TextInput
// //                     value={chatInput}
// //                     onChangeText={setChatInput}
// //                     placeholder="Enter message..."
// //                     className="w-full h-full pl-2 pr-3 "
// //                   ></TextInput>
// //                 </View>
// //                 <TouchableOpacity
// //                   onPress={handleSendLiveChat}
// //                   className="bg-[#fbdada]  p-3 rounded-full"
// //                 >
// //                   <ImageCustom
// //                     width={20}
// //                     height={20}
// //                     color="#EB4747"
// //                     source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
// //                   ></ImageCustom>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // export default PreLive;
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Linking,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   ScrollView,
//   TextInput,
// } from "react-native";
// import { CameraView, Camera } from "expo-camera";
// import { Audio } from "expo-av";
// import { useAuth } from "../../../context/AuthContext";
// import Avatar from "../../../components/Image/Avatar";
// import { BlurView } from "expo-blur";
// import ImageCustom from "../../../components/Image/Image";
// import { router, useLocalSearchParams } from "expo-router";
// import * as mediaSoupModule from "../../../mediaSoup/index";
// import { mediaSoupSocket } from "./SOSMap";
// import { MediaStream, RTCView, mediaDevices } from "react-native-webrtc";
// import { getChatSocket } from "../../../utils/socket";
// import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
// import { updateViewCount } from "../../../utils/liveStream";
// import { liveStreamService } from "../../../services/liveStream";
// import { InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

// import { userServices } from "../../../services/user";
// // Extend the Window interface to include setRemoteVideoTrack
// let videotrack: any;
// declare global {
//   interface Window {
//     setRemoteVideoTrack?: (track: any) => void;
//   }
// }

// export function updateRoomVideo(props: any): void {
//   const { track } = props;

//   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
//     window.setRemoteVideoTrack(track);
//     console.log("Video track updated:", track);
//     videotrack = track;
//   }
//   return track;
// }

// // export function updateCameraStatus(
// //   isCameraOn: boolean,
// //   producerId: string
// // ): void {
// //   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
// //     console.log("Camera status updated:", isCameraOn, producerId);
// //     if (isCameraOn) {
// //       console.log("Camera is on", videotrack);
// //       window.setRemoteVideoTrack(videotrack);
// //     } else {
// //       window.setRemoteVideoTrack(null);
// //     }
// //   }
// // }
// export function updateCameraStatus(
//   isCameraOn: boolean,
//   producerId: string
// ): void {
//   if (typeof window !== "undefined" && window.setRemoteVideoTrack) {
//     console.log("Camera status updated:", isCameraOn, producerId);
//     if (isCameraOn && videotrack) {
//       console.log("Setting video track:", videotrack);
//       if (videotrack.enabled === false) {
//         videotrack.enabled = true; // Ensure track is enabled
//       }
//       window.setRemoteVideoTrack(videotrack);
//     } else {
//       console.log("Clearing video track");
//       window.setRemoteVideoTrack(null);
//     }
//   }
// }
// export function updateAudioStatus(
//   isAudioOn: boolean,
//   producerId: string
// ): void {}

// const PreLive = () => {
//   const { isHost } = useLocalSearchParams<{ isHost: string }>();
//   const isHostBool = isHost === "true";
//   const { profile } = useAuth();
//   const { sosId } = useLocalSearchParams<{ sosId: string }>();
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const cameraRef = useRef<CameraView | null>(null);
//   const videoStream = useRef<MediaStream | null>(null);
//   const [facing, setFacing] = useState<"front" | "back">("front");
//   const [tryToTurnOffAudio, setTryToTurnOffAudio] = useState(true);
//   const [isCameraOn, setIsCameraOn] = useState(true);
//   const [isLiveStreaming, setIsLiveStreaming] = useState(false);
//   const { groupId } = useLocalSearchParams<{ groupId: string }>();
//   const chatSocket = getChatSocket();
//   const [chatMessages, setChatMessages] = useState<any[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const chatScrollViewRef = useRef<ScrollView>(null);
//   const [viewerCount, setViewerCount] = useState(0);
//   const [remoteVideoTrack, setRemoteVideoTrack] = useState<any>(null);
//   console.log("isHostBool, sosId", isHostBool, sosId);
//   const [host, setHost] = useState<any>();
//   const [loading, setLoading] = useState(false);
//   const { userProfile } = useLocalSearchParams<{ userProfile: string }>();
//   const [isJoining, setIsJoining] = useState(false);
//   // GET HOST LIVE STREAM
//   useEffect(() => {
//     if (isHostBool) return;
//     const fetchHost = async () => {
//       if (!chatSocket.connected) {
//         chatSocket.connect();
//         console.log("Reconnected chatSocket");
//       }
//       if (!mediaSoupSocket.connected) {
//         mediaSoupSocket.connect();
//         console.log("Reconnected mediaSoupSocket");
//       }
//       try {
//         if (userProfile) {
//           const parsedProfile = JSON.parse(userProfile);
//           setHost(parsedProfile);
//         } else {
//           setHost(undefined);
//         }
//       } catch (error) {
//         console.error("Error parsing userProfile:", error);
//         setHost(undefined);
//       }
//     };
//     fetchHost();
//   }, [isHostBool, userProfile]);

//   useEffect(() => {
//     if (isHostBool) return;

//     const handleCameraStatus = ({
//       isCameraOn,
//       producerId,
//     }: {
//       isCameraOn: boolean;
//       producerId: string;
//     }) => {
//       console.log("Camera status received:", isCameraOn, producerId);
//       updateCameraStatus(isCameraOn, producerId);
//     };

//     mediaSoupSocket.on("camera-status", handleCameraStatus);
//     return () => {
//       mediaSoupSocket.off("camera-status", handleCameraStatus);
//     };
//   }, [isHostBool]);
//   // SET SOCKET
//   useEffect(() => {
//     window.setRemoteVideoTrack = (track: any) => {
//       setRemoteVideoTrack(track);
//     };
//     return () => {
//       window.setRemoteVideoTrack = undefined;
//     };
//   }, []);
//   // UPDATE VIEW COUNT
//   useEffect(() => {
//     const update = async () => {
//       const count = await updateViewCount();
//       setViewerCount(count);
//     };

//     update();
//     mediaSoupSocket.on("update-room-peers", update);
//     return () => {
//       mediaSoupSocket.off("update-room-peers", update);
//     };
//   }, []);

//   // INITIALIZE CHAT SOCKET
//   useEffect(() => {
//     if (!chatSocket || !groupId) return;
//     initializeChatModule({
//       chatSocket,
//       groupId,
//       onNewMessage: (msg) => setChatMessages((prev) => [...prev, msg]),
//       onChatHistory: (msgs) => setChatMessages(msgs),
//     });
//     return () => {
//       chatSocket.off("receive_message");
//       chatSocket.off("chat_history");
//     };
//   }, [chatSocket, groupId]);

//   // SROLL CHAT VIEW

//   useEffect(() => {
//     if (chatScrollViewRef.current && chatMessages.length > 0) {
//       requestAnimationFrame(() => {
//         chatScrollViewRef.current?.scrollToEnd({ animated: true });
//       });
//     }
//   }, [chatMessages]);

//   // SEND MESSAGE
//   const handleSendLiveChat = () => {
//     if (chatInput.trim()) {
//       try {
//         console.log(
//           "params of send message",
//           chatSocket,
//           chatInput,
//           groupId,
//           profile?.id
//         );
//         sendMessage(chatSocket, chatInput, groupId, profile?.id!);
//         setChatInput("");
//         setTimeout(() => {
//           if (chatScrollViewRef.current) {
//             chatScrollViewRef.current.scrollToEnd({ animated: true });
//           }
//         }, 100);
//       } catch (error) {
//         console.log("Error sending message:", error);
//       }
//     }
//   };

//   // TOGGLE CAMERA FACING
//   // const toggleFacing = () => {
//   //   setFacing((prev) => (prev === "front" ? "back" : "front"));
//   // };
//   const toggleFacing = async () => {
//     if (!isLiveStreaming || !videoStream.current) {
//       // If not streaming, just toggle the facing state for preview
//       setFacing((prev) => (prev === "front" ? "back" : "front"));
//       return;
//     }

//     try {
//       // Toggle facing state
//       const newFacing = facing === "front" ? "back" : "front";
//       setFacing(newFacing);

//       // Stop the current video track
//       const currentVideoTrack = videoStream.current.getVideoTracks()[0];
//       if (currentVideoTrack) {
//         currentVideoTrack.stop();
//         videoStream.current.removeTrack(currentVideoTrack);
//       }

//       // Request a new stream with the updated facing mode
//       const newStream = await mediaDevices.getUserMedia({
//         video: {
//           facingMode: newFacing === "front" ? "user" : "environment",
//         },
//         audio: true, // Preserve audio track
//       });

//       // Update videoStream with the new stream
//       videoStream.current = newStream;
//       const newVideoTrack = newStream.getVideoTracks()[0];

//       // Update remoteVideoTrack
//       setRemoteVideoTrack(newVideoTrack);
//       window.setRemoteVideoTrack?.(newVideoTrack);

//       // Update MediaSoup producer with the new video track
//       const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
//       const { videoProducer } = producerInfo || {};
//       if (videoProducer) {
//         // Replace the track in the existing video producer
//         await videoProducer.replaceTrack({ track: newVideoTrack });
//         console.log(
//           "Video producer track replaced with new facing:",
//           newFacing
//         );
//       } else {
//         // If no video producer exists, set new media params
//         const videoParams = { track: newVideoTrack };
//         const audioTrack = newStream.getAudioTracks()[0];
//         const audioParams = audioTrack ? { track: audioTrack } : {};
//         mediaSoupModule.producerModule.setMediaParams(videoParams, audioParams);
//         console.log("Set new media params for video producer");
//       }

//       // Notify peers about camera status
//       if (videoProducer) {
//         mediaSoupSocket.emit("camera-status", {
//           isCameraOn: isCameraOn,
//           producerId: videoProducer.id,
//         });
//       }

//       console.log("Camera facing toggled to:", newFacing);
//     } catch (error) {
//       console.error("Error toggling camera facing:", error);
//       // Revert facing state on error
//       setFacing(facing);
//       // Optionally, restore the previous stream or handle the error gracefully
//     }
//   };

//   // TOGGLE MIC
//   const toggleMute = () => {
//     if (!isLiveStreaming) {
//       setTryToTurnOffAudio((prev) => !prev);
//       return;
//     }
//     const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
//     const { audioProducer } = producerInfo || {};
//     const audioTrack = videoStream.current?.getAudioTracks()[0];
//     console.log("Audio Track:", audioTrack);
//     if (!audioProducer) {
//       console.log("No audio producer available");
//       return;
//     }
//     if (!audioTrack) {
//       console.log("No audio track available");
//       return;
//     }

//     const newAudioState = !tryToTurnOffAudio;
//     audioTrack.enabled = newAudioState;
//     mediaSoupSocket.emit("audio-status", {
//       isAudioOn: newAudioState,
//       producerId: audioProducer.id,
//     });
//     setTryToTurnOffAudio(newAudioState);
//   };
//   // TOGGLE CAMERA
//   const toggleCamera = () => {
//     if (!isLiveStreaming) {
//       setIsCameraOn((prev) => !prev);
//       return;
//     }
//     const { videoProducer } = mediaSoupModule.producerModule.getProducerInfo();
//     console.log("Video Stream at toggle cam:", videoStream);
//     const videoTrackk = videoStream?.current?.getVideoTracks()[0];
//     console.log("Video Track:", videoTrackk);

//     if (!videoProducer) {
//       console.log("No video producer available");
//       return;
//     }
//     // if (!videoTrackk) {
//     //   console.log("No video track available");
//     //   return;
//     // }
//     if (isCameraOn) {
//       if (
//         videoStream.current &&
//         videoStream.current.getVideoTracks().length > 0
//       ) {
//         videoTrackk!.enabled = false;
//         mediaSoupSocket.emit("camera-status", {
//           isCameraOn: false,
//           producerId: videoProducer.id,
//         });
//         setRemoteVideoTrack(null);
//       } else {
//         console.log("No video track to stop");
//       }
//     } else {
//       videoTrackk!.enabled = true;
//       mediaSoupSocket.emit("camera-status", {
//         isCameraOn: true,
//         producerId: videoProducer.id,
//       });
//       setRemoteVideoTrack(videoTrackk);
//     }
//     setIsCameraOn((prev) => !prev);
//   };

//   // useEffect(() => {
//   //   if (isHostBool) return;
//   //   const handleCameraStatus = ({
//   //     isCameraOn,
//   //     producerId,
//   //   }: {
//   //     isCameraOn: boolean;
//   //     producerId: string;
//   //   }) => {
//   //     console.log("Camera status received:", isCameraOn, producerId);
//   //     updateCameraStatus(isCameraOn, producerId);
//   //   };

//   //   mediaSoupSocket.on("camera-status", handleCameraStatus);
//   //   return () => {
//   //     mediaSoupSocket.off("camera-status", handleCameraStatus);
//   //   };
//   // }, [isHostBool]);

//   // UPDATE LIVE STATUS
//   const handleUpdateStatus = async () => {
//     try {
//       const result = await liveStreamService.update_livestream_status({
//         sosId: Number(sosId),
//         hasLivestream: true,
//       });
//       console.log("update live status");
//     } catch (error) {
//       console.log("Error in handleUpdateStatus:", error);
//     }
//   };

//   // GET LOCAL STREAM
//   const getLocalStream = async (): Promise<void> => {
//     try {
//       //Only take streams if you have permission
//       if (!hasPermission) {
//         console.log("No camera or microphone access");
//         return;
//       }
//       const stream = await mediaDevices.getUserMedia({
//         video: {
//           facingMode: facing === "front" ? "user" : "environment",
//         },
//         audio: true,
//       });
//       videoStream.current = stream;
//       console.log("videoStream.current set:", videoStream.current);
//       // Get audio/video track
//       const audioTrack = stream.getAudioTracks()[0];
//       const videoTrack = stream.getVideoTracks()[0];
//       // Set parameters for producer
//       if (audioTrack && videoTrack) {
//         const audioParams = { track: audioTrack };
//         const videoParams = { track: videoTrack };
//         setRemoteVideoTrack(videoTrack);
//         mediaSoupModule.producerModule.setMediaParams(videoParams, audioParams);
//       } else {
//         console.log("Unable to get audio/video track from stream.");
//       }
//     } catch (error) {
//       console.log("Error in getLocalStream:", (error as Error).message);
//     }
//   };

//   // HANDLE START STREAMING
//   const startStreaming = async () => {
//     try {
//       console.log("Starting streaming...");
//       if (!mediaSoupSocket.connected) {
//         mediaSoupSocket.connect();
//         console.log("Reconnected mediaSoupSocket");
//       }
//       if (!chatSocket.connected) {
//         chatSocket.connect();
//         console.log("Reconnected chatSocket");
//       }
//       await getLocalStream();
//       console.log("profileid", profile?.id);
//       mediaSoupModule.joinRoom({ isConsumeOnly: false, userId: profile?.id });
//       await handleUpdateStatus();
//     } catch (error) {
//       console.log("Error starting streaming:", error);
//     }
//   };

//   // REQUEST CAMERA AND AUDIO PERMISSIONS

//   useEffect(() => {
//     if (!isHostBool) return;
//     (async () => {
//       const { status: cameraStatus } =
//         await Camera.requestCameraPermissionsAsync();
//       const { status: audioStatus } = await Audio.requestPermissionsAsync();

//       if (cameraStatus !== "granted" || audioStatus !== "granted") {
//         Alert.alert(
//           "Permission Required",
//           "App needs access to your camera and microphone to start live streaming. Please enable them in settings.",
//           [
//             { text: "Cancel", style: "cancel" },
//             {
//               text: "Open Settings",
//               onPress: () => {
//                 if (Platform.OS === "ios") {
//                   Linking.openURL("app-settings:");
//                 } else {
//                   Linking.openSettings();
//                 }
//               },
//             },
//           ]
//         );
//         setHasPermission(false);
//       } else {
//         setHasPermission(true);
//       }
//     })();
//   }, [isHostBool]);

//   if (hasPermission === false) {
//     return (
//       <View className="flex-1 justify-center items-center bg-black">
//         <Text className="text-white text-center">
//           Camera and microphone permissions are required to use this feature.
//         </Text>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="mt-4 bg-gray-600 px-4 py-2 rounded"
//         >
//           <Text className="text-white">Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // const handleJoinLive = async () => {
//   //   try {
//   //     // Request microphone permission
//   //     const { status: audioStatus } = await Audio.requestPermissionsAsync();
//   //     if (audioStatus !== "granted") {
//   //       Alert.alert(
//   //         "Permission Required",
//   //         "App needs access to your microphone to join the live stream. Please enable it in settings.",
//   //         [
//   //           { text: "Cancel", style: "cancel" },
//   //           {
//   //             text: "Open Settings",
//   //             onPress: () => {
//   //               if (Platform.OS === "ios") {
//   //                 Linking.openURL("app-settings:");
//   //               } else {
//   //                 Linking.openSettings();
//   //               }
//   //             },
//   //           },
//   //         ]
//   //       );
//   //       return;
//   //     }
//   //     console.log("Audio permission granted");
//   //     // Set audio mode
//   //     await Audio.setAudioModeAsync({
//   //       allowsRecordingIOS: true,
//   //       playsInSilentModeIOS: true,
//   //       staysActiveInBackground: true,
//   //       interruptionModeIOS: InterruptionModeIOS?.DoNotMix || 1,
//   //       interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix || 1,
//   //       shouldDuckAndroid: true,
//   //     });

//   //     console.log("Audio mode set");
//   //     // Get audio-only stream using react-native-webrtc
//   //     const stream = await mediaDevices.getUserMedia({
//   //       audio: true,
//   //       video: false,
//   //     });

//   //     // Store stream in ref
//   //     videoStream.current = stream;

//   //     // Get audio track
//   //     const audioTrack = stream.getAudioTracks()[0];
//   //     if (!audioTrack) {
//   //       console.log("No audio track available");
//   //       return;
//   //     }
//   //     console.log("Audio Track Prelive:", audioTrack);

//   //     // Set audio parameters for MediaSoup
//   //     const audioParams = { track: audioTrack };
//   //     console.log("Audio Params:", audioParams);
//   //     console.log("HOST Track:", remoteVideoTrack);
//   //     mediaSoupModule.producerModule.setMediaParams({}, audioParams);

//   //     // Join room as audio-only participant
//   //     mediaSoupModule.joinRoom({
//   //       isConsumeOnly: false,
//   //       userId: profile?.id,
//   //       sosId: sosId,
//   //     });
//   //     // setRemoteVideoTrack(videotrack);
//   //     // Update audio state
//   //     setTryToTurnOffAudio(true);
//   //     setIsJoining(true);
//   //   } catch (error) {
//   //     console.error("Error in handleJoinLive:", error);
//   //     Alert.alert("Error", "Failed to join live stream. Please try again.");
//   //   }
//   // };
//   const handleJoinLive = async () => {
//     setLoading(true);
//     try {
//       // Request microphone permission
//       const { status: audioStatus } = await Audio.requestPermissionsAsync();
//       if (audioStatus !== "granted") {
//         Alert.alert(
//           "Permission Required",
//           "App needs access to your microphone to join the live stream. Please enable it in settings.",
//           [
//             { text: "Cancel", style: "cancel" },
//             {
//               text: "Open Settings",
//               onPress: () => {
//                 if (Platform.OS === "ios") {
//                   Linking.openURL("app-settings:");
//                 } else {
//                   Linking.openSettings();
//                 }
//               },
//             },
//           ]
//         );
//         return;
//       }

//       console.log("Audio permission granted");

//       // Set audio mode
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         staysActiveInBackground: true,
//         interruptionModeIOS: InterruptionModeIOS?.DoNotMix || 1,
//         interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix || 1,
//         shouldDuckAndroid: true,
//       });

//       console.log("Audio mode set");

//       // Connect sockets if needed
//       if (!mediaSoupSocket.connected) {
//         mediaSoupSocket.connect();
//         console.log("Reconnected mediaSoupSocket");
//       }
//       if (!chatSocket.connected) {
//         chatSocket.connect();
//         console.log("Reconnected chatSocket");
//       }

//       // Get audio-only stream for viewer
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: false,
//       });

//       videoStream.current = stream;
//       const audioTrack = stream.getAudioTracks()[0];

//       if (!audioTrack) {
//         console.log("No audio track available");
//         throw new Error("No audio track available");
//       }

//       console.log("Audio Track Prelive:", audioTrack);

//       // Set audio parameters for MediaSoup
//       const audioParams = { track: audioTrack };
//       mediaSoupModule.producerModule.setMediaParams({}, audioParams);

//       // ✅ SỬA: Viewer nên join với isConsumeOnly: true
//       await mediaSoupModule.joinRoom({
//         isConsumeOnly: false, // ✅ Viewer chỉ consume, không produce video
//         userId: profile?.id,
//         sosId: sosId,
//       });

//       console.log("Joined room successfully as viewer");

//       // Set states
//       setTryToTurnOffAudio(true);
//       setIsJoining(true);

//       // ✅ Set remote video track từ global videotrack nếu có
//       if (videotrack) {
//         console.log("Setting existing video track:", videotrack);
//         setRemoteVideoTrack(videotrack);
//       }
//     } catch (error) {
//       console.error("Error in handleJoinLive:", error);
//       Alert.alert("Error", "Failed to join live stream. Please try again.");

//       // Cleanup on error
//       setIsJoining(false);
//       setTryToTurnOffAudio(true);
//     } finally {
//       // ✅ SỬA: Đảm bảo luôn tắt loading
//       setLoading(false);
//     }
//   };
//   const handleLeaveLive = async () => {
//     try {
//       console.log("Participant leaving live stream...");

//       try {
//         if (mediaSoupSocket.connected) {
//           mediaSoupSocket.disconnect();
//           console.log("mediaSoupSocket disconnected");
//         }
//         if (chatSocket.connected) {
//           chatSocket.disconnect();
//           console.log("chatSocket disconnected");
//         }
//       } catch (error) {
//         console.log("Error disconnecting sockets:", error);
//       }
//       console.log("Participant left live stream successfully");
//     } catch (error) {
//       console.error("Error leaving live stream:", error);
//       Alert.alert("Error", "Failed to leave live stream. Navigating back.");
//     } finally {
//       router.back();
//     }
//   };

//   useEffect(() => {
//     if (remoteVideoTrack) {
//       console.log("remoteVideoTrack state:", {
//         enabled: remoteVideoTrack.enabled,
//         readyState: remoteVideoTrack.readyState,
//         muted: remoteVideoTrack.muted,
//       });
//     }
//   }, [remoteVideoTrack]);
//   const endLive = async () => {
//     try {
//       console.log("Ending live stream...");

//       // 1. Stop all tracks
//       if (videoStream.current) {
//         const tracks = videoStream.current.getTracks();
//         tracks.forEach((track) => {
//           console.log("Stopping track:", track.kind);
//           track.stop();
//           videoStream.current?.removeTrack(track);
//         });
//         videoStream.current = null;
//       }

//       // 2. Close MediaSoup producers
//       try {
//         const producerInfo = mediaSoupModule.producerModule.getProducerInfo?.();
//         const { videoProducer, audioProducer } = producerInfo || {};

//         if (videoProducer) {
//           videoProducer.close();
//           console.log("Video producer closed");
//         }
//         if (audioProducer) {
//           audioProducer.close();
//           console.log("Audio producer closed");
//         }
//       } catch (error) {
//         console.log("Error closing producers:", error);
//       }

//       // 4. Disconnect sockets
//       try {
//         mediaSoupSocket.disconnect();
//         chatSocket.disconnect();
//         console.log("Sockets disconnected");
//       } catch (error) {
//         console.log("Error disconnecting sockets:", error);
//       }

//       // 5. Update live stream status
//       try {
//         await liveStreamService.update_livestream_status({
//           sosId: Number(sosId),
//           hasLivestream: false,
//         });
//         console.log("Live stream status updated to ended");
//       } catch (error) {
//         console.log("Error updating live status:", error);
//       }

//       // 6. Reset states
//       setIsLiveStreaming(false);
//       setIsCameraOn(false);
//       setTryToTurnOffAudio(false);
//       setRemoteVideoTrack(null);
//       videotrack = null; // Reset global videotrack
//       window.setRemoteVideoTrack?.(null); // Clear remote video track

//       console.log("Live stream ended successfully");
//     } catch (error) {
//       console.error("Error ending live stream:", error);
//     } finally {
//       router.back();
//     }
//   };

//   const handleClose = async () => {
//     if (isHostBool) {
//       // Host: end live stream
//       if (isLiveStreaming) {
//         Alert.alert(
//           "End Live Stream",
//           "Are you sure you want to end the live stream?",
//           [
//             {
//               text: "Cancel",
//               style: "cancel",
//             },
//             {
//               text: "End Live",
//               style: "destructive",
//               onPress: async () => {
//                 await endLive();
//                 router.back();
//               },
//             },
//           ]
//         );
//       } else {
//         // Chưa live thì back luôn
//         router.back();
//       }
//     } else {
//       // Viewer: leave live stream
//       try {
//         if (isJoining) {
//           // Viewer is participating with audio, perform full cleanup
//           await handleLeaveLive();
//         } else {
//           // Viewer is only watching, disconnect sockets
//           if (mediaSoupSocket.connected) {
//             mediaSoupSocket.disconnect();
//             console.log("mediaSoupSocket disconnected");
//           }
//           if (chatSocket.connected) {
//             chatSocket.disconnect();
//             console.log("chatSocket disconnected");
//           }
//         }
//       } catch (error) {
//         console.error("Error in handleClose (viewer):", error);
//         Alert.alert("Error", "Failed to leave live stream. Navigating back.");
//       } finally {
//         router.back();
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {isHostBool ? (
//         // Host view
//         hasPermission && isCameraOn ? (
//           remoteVideoTrack ? (
//             <RTCView
//               streamURL={new MediaStream([remoteVideoTrack]).toURL()}
//               style={StyleSheet.absoluteFill}
//               objectFit="cover"
//             />
//           ) : (
//             <CameraView
//               ref={cameraRef}
//               active={isCameraOn}
//               style={StyleSheet.absoluteFill}
//               facing={facing}
//             ></CameraView>
//           )
//         ) : (
//           <ImageBackground
//             source={
//               profile?.User.avatar_url
//                 ? { uri: profile.User.avatar_url }
//                 : require("../../../assets/images/ava1.png")
//             }
//             style={[
//               StyleSheet.absoluteFill,
//               { justifyContent: "center", alignItems: "center" },
//             ]}
//             resizeMode="cover"
//           >
//             <BlurView
//               intensity={50}
//               tint="dark"
//               style={{ position: "absolute", width: "100%", height: "100%" }}
//             />
//             <Avatar
//               source={profile?.User.avatar_url}
//               width={120}
//               height={120}
//             />
//             <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
//             <TouchableOpacity
//               onPress={toggleCamera}
//               style={{
//                 marginTop: 20,
//                 padding: 10,
//                 backgroundColor: "#ffffff30",
//                 borderRadius: 5,
//               }}
//             >
//               <Text style={{ color: "white" }}>Turn On Camera</Text>
//             </TouchableOpacity>
//           </ImageBackground>
//         )
//       ) : // Viewer view
//       remoteVideoTrack &&
//         remoteVideoTrack.enabled &&
//         remoteVideoTrack.readyState === "live" ? (
//         (console.log("[RTCView render] remoteVideoTrack:", remoteVideoTrack),
//         (
//           <RTCView
//             streamURL={new MediaStream([remoteVideoTrack]).toURL()}
//             style={StyleSheet.absoluteFill}
//             objectFit="cover"
//           />
//         ))
//       ) : (
//         <ImageBackground
//           source={
//             host?.User?.avatar_url
//               ? { uri: host.User.avatar_url }
//               : require("../../../assets/images/ava1.png")
//           }
//           style={[
//             StyleSheet.absoluteFill,
//             { justifyContent: "center", alignItems: "center" },
//           ]}
//           resizeMode="cover"
//         >
//           <BlurView
//             intensity={50}
//             tint="dark"
//             style={{ position: "absolute", width: "100%", height: "100%" }}
//           />
//           <Avatar source={host?.User?.avatar_url} width={120} height={120} />
//           <Text style={{ color: "white", marginTop: 10 }}>Camera is off</Text>
//         </ImageBackground>
//       )}

//       {/* Overlay content */}
//       <View className="flex-1 w-full items-center px-4 relative">
//         {/* User Info */}
//         <View className="items-center absolute top-14 flex flex-row gap-2 w-full justify-between">
//           <BlurView
//             intensity={40}
//             style={{ borderRadius: 30, overflow: "hidden" }}
//             className="flex flex-row items-center gap-2 rounded-[30px] pl-3 pr-10 py-1"
//           >
//             <View className="w-[45px] h-[45px] bg-white rounded-full overflow-hidden justify-center items-center flex">
//               <Avatar
//                 source={
//                   isHostBool
//                     ? profile?.User.avatar_url
//                     : host && host.User
//                     ? host.User.avatar_url
//                     : undefined
//                 }
//                 width={40}
//                 height={40}
//                 className="rounded-full z-10"
//               />
//             </View>
//             <View className="flex flex-col gap-1">
//               <Text className="text-white font-medium z-10">
//                 {isHostBool ? profile?.name : host ? host.name : ""}
//               </Text>
//               <View className="flex flex-row items-center gap-1">
//                 <ImageCustom
//                   source="https://img.icons8.com/?size=100&id=oKCuVJn91KSH&format=png&color=000000"
//                   width={12}
//                   height={12}
//                   color="white"
//                 />
//                 <Text className="text-[12px] text-white">{viewerCount}</Text>
//               </View>
//             </View>
//           </BlurView>
//           <TouchableOpacity
//             onPress={() => {
//               handleClose();
//             }}
//             activeOpacity={0.8}
//           >
//             <BlurView
//               intensity={50}
//               className="p-4 overflow-hidden rounded-full"
//             >
//               <ImageCustom
//                 source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
//                 width={20}
//                 height={20}
//                 color="white"
//               />
//             </BlurView>
//           </TouchableOpacity>
//         </View>
//         {isHostBool ? (
//           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
//             <TouchableOpacity
//               onPress={toggleCamera}
//               activeOpacity={0.8}
//               className="flex flex-col gap-1 justify-center items-center"
//             >
//               <ImageCustom
//                 source={
//                   isCameraOn
//                     ? "https://img.icons8.com/?size=100&id=59749&format=png&color=000000"
//                     : "https://img.icons8.com/?size=100&id=82601&format=png&color=000000"
//                 }
//                 width={25}
//                 height={25}
//                 color="white"
//               />
//               <Text className="text-white text-[12px]">Camera</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={toggleFacing}
//               activeOpacity={0.8}
//               className="flex flex-col gap-1 justify-center items-center"
//             >
//               <ImageCustom
//                 source="https://img.icons8.com/?size=100&id=IxtZfghGBNPZ&format=png&color=000000"
//                 width={25}
//                 height={25}
//                 color="white"
//               />
//               <Text className="text-white text-[12px]">Flip</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={toggleMute}
//               activeOpacity={0.8}
//               className="flex flex-col gap-1 justify-center items-center"
//             >
//               <ImageCustom
//                 source={
//                   tryToTurnOffAudio
//                     ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
//                     : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
//                 }
//                 width={25}
//                 height={25}
//                 color="white"
//               />
//               <Text className="text-white text-[12px]">Mic</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View className="absolute right-2 top-1/4 flex flex-col gap-5">
//             <TouchableOpacity
//               onPress={isJoining ? handleLeaveLive : handleJoinLive}
//               activeOpacity={0.8}
//               className="flex flex-col gap-1 justify-center items-center"
//             >
//               <ImageCustom
//                 source={
//                   isJoining
//                     ? "https://img.icons8.com/?size=100&id=Q1xkcFuVON39&format=png&color=000000"
//                     : "https://img.icons8.com/?size=100&id=115954&format=png&color=000000"
//                 }
//                 width={25}
//                 height={25}
//                 color="white"
//               />
//               <Text className="text-white text-[12px]">
//                 {isJoining ? "Leave" : "Join"}
//               </Text>
//             </TouchableOpacity>
//             {isJoining && (
//               <TouchableOpacity
//                 onPress={toggleMute}
//                 activeOpacity={0.8}
//                 className="flex flex-col gap-1 justify-center items-center"
//               >
//                 <ImageCustom
//                   source={
//                     tryToTurnOffAudio
//                       ? "https://img.icons8.com/?size=100&id=85836&format=png&color=000000" // Replace with actual muted icon URL
//                       : "https://img.icons8.com/?size=100&id=qv2H3YadsNcR&format=png&color=000000" // Replace with actual unmuted icon URL
//                   }
//                   width={25}
//                   height={25}
//                   color="white"
//                 />
//                 <Text className="text-white text-[12px]">Mic</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}

//         <View className="bottom-5 left-0 right-0 absolute px-5">
//           {isHostBool && !isLiveStreaming ? (
//             <TouchableOpacity
//               onPress={() => {
//                 setIsCameraOn(true);
//                 startStreaming();
//                 setIsLiveStreaming(true);
//               }}
//               activeOpacity={0.9}
//               className="bg-[#FF4D00] px-4 py-4 rounded-[30px] flex justify-center items-center w-full shadow-md"
//             >
//               <Text className="text-white font-semibold">Start Live</Text>
//             </TouchableOpacity>
//           ) : (
//             <View
//               style={{
//                 position: "absolute",
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 padding: 10,
//                 backgroundColor: "transparent",
//               }}
//             >
//               <View style={{ maxHeight: 210, marginBottom: 8 }}>
//                 <ScrollView style={{ maxHeight: 210 }} ref={chatScrollViewRef}>
//                   {chatMessages.map((msg, idx) => (
//                     <View
//                       key={idx}
//                       style={{
//                         marginBottom: 4,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         padding: 4,
//                         gap: 5,
//                       }}
//                     >
//                       <Avatar
//                         source={msg?.avatar_url}
//                         width={40}
//                         height={40}
//                       ></Avatar>
//                       <View className="flex flex-col gap-0">
//                         <Text
//                           style={{
//                             color: "#fff",
//                             fontWeight: "bold",
//                             marginRight: 6,
//                           }}
//                         >
//                           {msg.name || "You"}:
//                         </Text>
//                         <Text style={{ color: "#fff" }}>{msg.content}</Text>
//                       </View>
//                     </View>
//                   ))}
//                 </ScrollView>
//               </View>
//               <View className="flex flex-row w-full px-5 gap-2">
//                 <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
//                   <ImageCustom
//                     width={20}
//                     height={20}
//                     color="gray"
//                     className="abosolute left-1"
//                     source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
//                   ></ImageCustom>
//                   <TextInput
//                     value={chatInput}
//                     onChangeText={setChatInput}
//                     placeholder="Enter message..."
//                     className="w-full h-full pl-2 pr-3 "
//                   ></TextInput>
//                 </View>
//                 <TouchableOpacity
//                   onPress={handleSendLiveChat}
//                   className="bg-[#fbdada]  p-3 rounded-full"
//                 >
//                   <ImageCustom
//                     width={20}
//                     height={20}
//                     color="#EB4747"
//                     source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
//                   ></ImageCustom>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PreLive;
