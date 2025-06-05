// // filepath: d:\DATN\LiveBoatMobileApp\app\(tabs)\history\DetailSOS.tsx
// import {
//   Alert,
//   Image,
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Map from "../../../components/Map/Map";
// import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
// import { rescuerServices } from "../../../services/rescuer";
// import { RescuerItem } from "../../../types/rescuerItem";
// import ImageCustom from "../../../components/Image/Image";
// interface SocketEvents {
//   TOCLIENT_SOS_LOCATIONS: string;
//   TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP: string;
//   TOCLIENT_SOS_FINISHED: string;
//   TOCLIENT_THE_SENDER_LOCATION: string;
//   TOCLIENT_HELPER_LOCATIONS: string;
//   TOCLIENT_USER_DISCONNECTED: string;
//   TOSERVER_REGISTER_SOS_SENDER: string;
//   TOSERVER_GET_THE_SENDER_LOCATION: string;
// }
// import { getCurrentLocation, LocationResult } from "../../../utils/location";
// import { Camera } from "@rnmapbox/maps";
// import Avatar from "../../../components/Image/Avatar";
// import { useSocketContext } from "../../../context/SocketContext";
// import Toast from "react-native-toast-message";
// import { sosService } from "../../../services/sos";
// import { getChatSocket } from "../../../utils/socket";
// import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
// import { useAuth } from "../../../context/AuthContext";

// const DetailSOS = () => {
//   const [checkSOS, setCheckSOS] = useState(false);
//   const [currentSOS, setCurrentSOS] = useState<any>(null);
//   const [listRescuer, setListRescuer] = useState<RescuerItem[]>([]);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const cameraRef = useRef<Camera>(null);

//   // Fixed: Use proper state and ref pattern for helpingUserId
//   const [helpingUserId, setHelpingTheUserId] = useState<number | null>(null);
//   const helpingUserIdRef = useRef<number | null>(null);

//   const setHelpingUserId = (value: number | null) => {
//     console.log(`DetailSOS: Setting helpingUserId to ${value}`);
//     setHelpingTheUserId(value);
//     helpingUserIdRef.current = value;
//   };

//   const [isAlertVisible, setAlertVisible] = useState(false);
//   const chatSocket = getChatSocket();
//   const [chatMessages, setChatMessages] = useState<any[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const chatScrollViewRef = useRef<ScrollView>(null);
//   const { groupId, userProfile, sosId } = useLocalSearchParams<{
//     groupId: string;
//     userProfile: string;
//     sosId: string;
//   }>();
//   console.log("54 DetailSOS userProfile", userProfile);
//   const { profile } = useAuth();
//   const {
//     socket,
//     setUserInfo,
//     updateLocation,
//     otherUserMarkers,
//     displayOfflineMarker,
//     displayOrUpdateMarkers,
//   } = useSocketContext();
//   console.log("groupId 58Detail sos", groupId);
//   const [SOS, setSOS] = useState<any>(null);
//   const [showCancelDialog, setShowCancelDialog] = useState(false);
//   const [checkRoute, setCheckRoute] = useState(false);
//   const SOCKET_EVENTS: SocketEvents = {
//     TOCLIENT_SOS_LOCATIONS: "TOCLIENT_SOS_LOCATIONS",
//     TOCLIENT_SOS_FINISHED: "TOCLIENT_SOS_FINISHED",
//     TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP:
//       "TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP",
//     TOCLIENT_THE_SENDER_LOCATION: "TOCLIENT_THE_SENDER_LOCATION",
//     TOCLIENT_HELPER_LOCATIONS: "TOCLIENT_HELPER_LOCATIONS",
//     TOCLIENT_USER_DISCONNECTED: "TOCLIENT_USER_DISCONNECTED",
//     TOSERVER_REGISTER_SOS_SENDER: "TOSERVER_REGISTER_SOS_SENDER",
//     TOSERVER_GET_THE_SENDER_LOCATION: "TOSERVER_GET_THE_SENDER_LOCATION",
//   };

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

//   useEffect(() => {
//     if (chatScrollViewRef.current && chatMessages.length > 0) {
//       requestAnimationFrame(() => {
//         chatScrollViewRef.current?.scrollToEnd({ animated: true });
//       });
//     }
//   }, [chatMessages]);

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
//         sendMessage(chatSocket, chatInput, groupId, profile?.User?.id!);
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

//   const handleControl = async (
//     targetLocation: LocationResult | null = null
//   ) => {
//     try {
//       let location = targetLocation;

//       if (!location) {
//         location = await getCurrentLocation();
//       }

//       if (location && cameraRef.current) {
//         const { latitude, longitude } = location;
//         cameraRef.current.moveTo([longitude, latitude], 1000);
//         setTimeout(() => {
//           cameraRef.current?.zoomTo(14, 500);
//         }, 1000);
//       }
//     } catch (error) {
//       console.log("Error getting location", error);
//     }
//   };

//   const getSOS = async () => {
//     try {
//       console.log("Fetching SOS with ID:", sosId);
//       const current = await rescuerServices.getSOSCurrent();
//       console.log("147, Current SOS data:", current?.data);
//       console.log("148,SOSid", sosId);
//       if (current && current.data && current.data.SOS.id == sosId) {
//         setCurrentSOS(current.data);
//         console.log("Current SOS 292:", current.data);
//         setCheckSOS(true);
//         console.log("helpingUserIdRef 150:", current.data.SOS.user_id);
//         setHelpingUserId(current.data.SOS.user_id);
//       }
//     } catch (error: any) {
//       console.error("Error when getting current SOS:", {
//         message: error?.message,
//         status: error?.response?.status,
//         data: error?.response?.data,
//         headers: error?.response?.headers,
//       });
//       setCurrentSOS(null);
//       setCheckSOS(false);
//     }
//   };

//   useEffect(() => {
//     console.log("🔄 DetailSOS component mounted, sosId:", sosId);
//     if (sosId) {
//       getSOS();
//       getCurrentSOS();
//     }
//   }, [sosId]);

//   const getCurrentSOS = async () => {
//     try {
//       console.log("Fetching SOS by ID:", sosId);
//       const result = await sosService.getSOSById(Number(sosId));
//       console.log("Current SOS:", result.data);
//       setSOS(result.data);

//       console.log(
//         "Display offline marker for userId:",
//         result.data?.user_id,
//         result.data?.longitude,
//         result.data?.latitude
//       );
//       displayOfflineMarker(
//         result.data?.user_id,
//         result.data?.longitude,
//         result.data?.latitude,
//         false
//       );
//     } catch (error: any) {
//       console.error("Error in Detail SOS 183:", {
//         message: error?.message,
//         status: error?.response?.status,
//         data: error?.response?.data,
//         headers: error?.response?.headers,
//       });
//     }
//   };

//   useEffect(() => {
//     if (!socket.current) return;

//     console.log("Rescuer mode active");

//     socket.current.on(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION, (data) => {
//       console.log("The Sender ONLINE:");
//       displayOrUpdateMarkers(data);
//       setCheckRoute(true);
//     });

//     socket.current.on(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS, (data) => {
//       displayOrUpdateMarkers(data);
//     });

//     // Fixed: Use helpingUserIdRef.current in socket event handlers to avoid closure issues
//     socket.current.on(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED, (data) => {
//       console.log("User disconnected:", data.userId);
//       console.log("Helping User ID (from ref):", helpingUserIdRef.current);
//       console.log("Helping User ID (from state):", helpingUserId);
//       console.log("");
//       if (data.userId == helpingUserIdRef.current) {
//         console.log("Sender disconnected, display offline marker");
//         getCurrentSOS();
//       }
//     });

//     socket.current.on(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED, (data) => {
//       if (data.userId == helpingUserIdRef.current) {
//         console.log("Sender finished SOS, complete rescuing");
//         Toast.show({
//           type: "success",
//           text1: "SOS Completed",
//           text2: "You have successfully completed the SOS request.",
//         });
//         setAlertVisible(true);
//         setHelpingUserId(null);
//         setCheckSOS(false);
//         setCurrentSOS(null);
//       }
//     });

//     setUserInfo("HELPER");

//     const timeout1 = setTimeout(() => {
//       socket?.current?.emit(
//         SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
//       );
//       console.log("178: helpingUserId:", helpingUserId);
//       socket?.current?.emit(SOCKET_EVENTS.TOSERVER_REGISTER_SOS_SENDER, {
//         helpingTheUserId: helpingUserId,
//       });
//       console.log("helpingUserId 181:", helpingUserId);
//     }, 1000);

//     const timeout3 = setTimeout(async () => {
//       const location = await getCurrentLocation();
//       if (location) {
//         updateLocation(
//           location.latitude,
//           location.longitude,
//           location.accuracy ?? 0
//         );
//       }
//     }, 2000);

//     const timeout2 = setTimeout(() => {
//       socket?.current?.emit(
//         SOCKET_EVENTS.TOSERVER_GET_THE_SENDER_LOCATION,
//         (response: any) => {
//           console.log("Server responded:", response);
//           getCurrentLocation();
//           if (response?.status === false && helpingUserId !== null) {
//             console.log("270 Detail SOS get sender location", helpingUserId);
//             console.log(
//               "helpingUserId 200:",
//               helpingUserId,
//               currentSOS?.longitude,
//               currentSOS?.latitude
//             );

//             displayOfflineMarker(
//               helpingUserId,
//               currentSOS?.longitude,
//               currentSOS?.latitude,
//               false
//             );
//           } else {
//             console.log("SENDER ONLINE");
//             setCheckRoute(true);
//           }
//         }
//       );
//     }, 5000);

//     return () => {
//       clearTimeout(timeout1);
//       clearTimeout(timeout2);
//       clearTimeout(timeout3);
//     };
//   }, [currentSOS, helpingUserId]);

//   const handleCancelSOS = async () => {
//     try {
//       console.log("Cancel SOS clicked");
//       if (currentSOS) {
//         const result = await rescuerServices.updateRescuer({
//           longitude: currentSOS.SOS.longitude,
//           latitude: currentSOS.SOS.latitude,
//           accuracy: currentSOS.SOS.accuracy,
//           status: "CANCELED",
//         });
//       }
//       if (socket.current) {
//         console.log("🧹 Cleaning up socket connections...");
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
//         socket.current.disconnect();
//         socket.current.emit("TOSERVER_LEAVE_SOS_GROUP", {
//           sosId: sosId,
//           userId: profile?.id,
//           reason: "CANCELED",
//         });
//         console.log("✅ Socket cleanup completed");
//       }
//       if (chatSocket) {
//         console.log("🧹 Cleaning up chat socket...");
//         chatSocket.off("receive_message");
//         chatSocket.off("chat_history");
//         chatSocket.emit("leave_room", { groupId });
//         console.log("✅ Chat socket cleanup completed");
//       }
//       setUserInfo("NORMAL");
//       setCheckSOS(false);
//       setShowCancelDialog(false);
//       Toast.show({
//         type: "success",
//         text1: "SOS Cancelled",
//         text2: "You have canceled your request for emergency assistance.",
//       });
//       setTimeout(() => {
//         router.back();
//       }, 1000);
//     } catch (error: any) {
//       console.log("Error", error.response?.data);
//       Toast.show({
//         type: "error",
//         text1: "Error!",
//         text2: "Error when cancel support!",
//       });
//     }
//   };

//   const showCancelConfirmation = () => {
//     setShowCancelDialog(true);
//   };

//   const handleBack = () => {
//     if (!checkSOS) {
//       if (socket.current) {
//         console.log("🧹 Cleaning up socket connections...");
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
//         socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
//         socket.current.disconnect();
//         socket.current.emit("TOSERVER_LEAVE_SOS_GROUP", {
//           sosId: sosId,
//           userId: profile?.id,
//           reason: "CANCELED",
//         });
//         console.log("✅ Socket cleanup completed");
//       }
//       if (chatSocket) {
//         chatSocket.off("receive_message");
//         chatSocket.off("chat_history");
//         chatSocket.emit("leave_room", { groupId });
//       }
//       router.back();
//     } else {
//       router.back();
//     }
//   };

//   return (
//     <View className="flex-1 w-full h-full justify-center items-center bg-white relative">
//       <Map
//         checkSOS={checkSOS}
//         sos={currentSOS}
//         cameraRef={cameraRef}
//         listRescuer={listRescuer}
//         otherUserMarkers={otherUserMarkers}
//         checkRoute={checkRoute}
//       ></Map>
//       <TouchableOpacity
//         onPress={handleBack}
//         className="p-2 rounded-full absolute top-12 left-4 bg-gray-100"
//       >
//         <ImageCustom
//           width={20}
//           height={20}
//           source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
//         />
//       </TouchableOpacity>
//       <View className="bg-[#EB4747] absolute top-12 rounded-[30px] opacity-90 px-7 py-3 flex justify-center items-center">
//         <Text className="font-bold text-white">Traffic Accident</Text>
//       </View>

//       <View className="absolute top-12 right-5 flex flex-col gap-3">
//         {checkSOS && (
//           <TouchableOpacity
//             onPress={showCancelConfirmation}
//             className="bg-red-500 p-3 rounded-full"
//           >
//             <Text className="text-white font-bold">Cancel Help</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <Modal
//         visible={showCancelDialog}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowCancelDialog(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white p-6 rounded-lg mx-4">
//             <Text className="text-lg font-bold mb-4">Cancel Help</Text>
//             <Text className="mb-6">
//               Are you sure you want to cancel helping this person?
//             </Text>
//             <View className="flex-row justify-end gap-4">
//               <TouchableOpacity
//                 onPress={() => setShowCancelDialog(false)}
//                 className="px-4 py-2 bg-gray-200 rounded"
//               >
//                 <Text>No</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleCancelSOS}
//                 className="px-4 py-2 bg-red-500 rounded"
//               >
//                 <Text className="text-white">Yes, Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default DetailSOS;
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map from "../../../components/Map/Map";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { rescuerServices } from "../../../services/rescuer";
import { RescuerItem } from "../../../types/rescuerItem";
import ImageCustom from "../../../components/Image/Image";
interface SocketEvents {
  TOCLIENT_SOS_LOCATIONS: string;
  TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP: string;
  TOCLIENT_SOS_FINISHED: string;
  TOCLIENT_THE_SENDER_LOCATION: string;
  TOCLIENT_HELPER_LOCATIONS: string;
  TOCLIENT_USER_DISCONNECTED: string;
  TOSERVER_REGISTER_SOS_SENDER: string;
  TOSERVER_GET_THE_SENDER_LOCATION: string;
}
import { getCurrentLocation, LocationResult } from "../../../utils/location";
import { Camera } from "@rnmapbox/maps";
import Avatar from "../../../components/Image/Avatar";
import { useSocketContext } from "../../../context/SocketContext";
import Toast from "react-native-toast-message";
import { sosService } from "../../../services/sos";
import { getChatSocket } from "../../../utils/socket";
import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
import { useAuth } from "../../../context/AuthContext";
const DetailSOS = () => {
  const [checkSOS, setCheckSOS] = useState(false);
  const [currentSOS, setCurrentSOS] = useState<any>(null);
  const [listRescuer, setListRescuer] = useState<RescuerItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [helpingUserId, setHelpingTheUserId] = useState<number | null>(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const chatSocket = getChatSocket();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollViewRef = useRef<ScrollView>(null);
  const { groupId, userProfile, sosId } = useLocalSearchParams<{
    groupId: string;
    userProfile: string;
    sosId: string;
  }>();
  console.log("54 DetailSOS userProfile", userProfile);
  // const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { profile } = useAuth();
  // const { sosId } = useLocalSearchParams<{ sosId: string }>();
  const {
    socket,
    setUserInfo,
    updateLocation,
    otherUserMarkers,
    displayOfflineMarker,
    displayOrUpdateMarkers,
  } = useSocketContext();
  console.log("groupId 58Detail sos", groupId);
  const [SOS, setSOS] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [checkRoute, setCheckRoute] = useState(false);
  const SOCKET_EVENTS: SocketEvents = {
    TOCLIENT_SOS_LOCATIONS: "TOCLIENT_SOS_LOCATIONS",
    TOCLIENT_SOS_FINISHED: "TOCLIENT_SOS_FINISHED",
    TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP:
      "TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP",
    TOCLIENT_THE_SENDER_LOCATION: "TOCLIENT_THE_SENDER_LOCATION",
    TOCLIENT_HELPER_LOCATIONS: "TOCLIENT_HELPER_LOCATIONS",
    TOCLIENT_USER_DISCONNECTED: "TOCLIENT_USER_DISCONNECTED",
    TOSERVER_REGISTER_SOS_SENDER: "TOSERVER_REGISTER_SOS_SENDER",
    TOSERVER_GET_THE_SENDER_LOCATION: "TOSERVER_GET_THE_SENDER_LOCATION",
  };

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
    if (chatScrollViewRef.current && chatMessages.length > 0) {
      requestAnimationFrame(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [chatMessages]);
  const handleSendLiveChat = () => {
    if (chatInput.trim()) {
      try {
        console.log(
          "params of send message",
          chatSocket,
          chatInput,
          groupId,
          profile?.id
        );
        // console.log("profile", profile);
        sendMessage(chatSocket, chatInput, groupId, profile?.User?.id!);
        setChatInput("");
        setTimeout(() => {
          if (chatScrollViewRef.current) {
            chatScrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      } catch (error) {
        console.log("Error sending message:", error);
      }
    }
  };
  const handleControl = async (
    targetLocation: LocationResult | null = null
  ) => {
    try {
      let location = targetLocation;

      if (!location) {
        location = await getCurrentLocation();
      }

      if (location && cameraRef.current) {
        const { latitude, longitude } = location;
        cameraRef.current.moveTo([longitude, latitude], 1000);
        setTimeout(() => {
          cameraRef.current?.zoomTo(14, 500);
        }, 1000);
      }
    } catch (error) {
      console.log("Error getting location", error);
    }
  };
  const getSOS = async () => {
    try {
      console.log("Fetching SOS with ID:", sosId);
      const current = await rescuerServices.getSOSCurrent();
      console.log("147, Current SOS data:", current?.data);
      console.log("148,SOSid", sosId);
      if (current && current.data && current.data.SOS.id == sosId) {
        setCurrentSOS(current.data);
        console.log("Current SOS 292:", current.data);
        setCheckSOS(true);
        console.log("helpingUserIdRef 150:", current.data.SOS.user_id);
        setHelpingTheUserId(current.data.SOS.user_id);
      }
    } catch (error: any) {
      console.error("Error when getting current SOS:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      setCurrentSOS(null);
      setCheckSOS(false);
    }
  };
  useEffect(() => {
    console.log("🔄 DetailSOS component mounted, sosId:", sosId);
    if (sosId) {
      getSOS();
      getCurrentSOS();
    }
  }, [sosId]);

  const getCurrentSOS = async () => {
    try {
      console.log("Fetching SOS by ID:", sosId);
      const result = await sosService.getSOSById(Number(sosId));
      console.log("Current SOS:", result.data);
      setSOS(result.data);

      console.log(
        "Display offline marker for userId:",
        result.data?.user_id,
        result.data?.longitude,
        result.data?.latitude
      );
      displayOfflineMarker(
        result.data?.user_id,
        result.data?.longitude,
        result.data?.latitude,
        false
      );
    } catch (error: any) {
      console.error("Error in Detail SOS 183:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
    }
  };

  useEffect(() => {
    if (!socket.current) return;

    console.log("Rescuer mode active");

    socket.current.on(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION, (data) => {
      console.log("The Sender ONLINE:");
      displayOrUpdateMarkers(data);
      setCheckRoute(true);
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS, (data) => {
      displayOrUpdateMarkers(data);
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED, (data) => {
      console.log("User disconnected:", data.userId);
      console.log("Helping User ID:", helpingUserId);
      console.log("");
      if (data.userId == helpingUserId) {
        console.log("Sender disconnected, display offline marker");
        getCurrentSOS();
      }
    });
    socket.current.on(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED, (data) => {
      if (data.userId == helpingUserId) {
        console.log("Sender finished SOS, complete rescuing");
        Toast.show({
          type: "success",
          text1: "SOS Completed",
          text2: "You have successfully completed the SOS request.",
        });
        setAlertVisible(true);
        setHelpingTheUserId(null);
        setCheckSOS(false);
        setCurrentSOS(null);
      }
    });
    setUserInfo("HELPER");

    const timeout1 = setTimeout(() => {
      socket?.current?.emit(
        SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
      );
      console.log("178: helpingUserId:", helpingUserId);
      socket?.current?.emit(SOCKET_EVENTS.TOSERVER_REGISTER_SOS_SENDER, {
        helpingTheUserId: helpingUserId,
      });
      console.log("helpingUserId 181:", helpingUserId);
      setHelpingTheUserId(helpingUserId);
    }, 1000);
    const timeout3 = setTimeout(async () => {
      const location = await getCurrentLocation();
      if (location) {
        updateLocation(
          location.latitude,
          location.longitude,
          location.accuracy ?? 0
        );
      }
    }, 2000);
    const timeout2 = setTimeout(() => {
      socket?.current?.emit(
        SOCKET_EVENTS.TOSERVER_GET_THE_SENDER_LOCATION,
        (response: any) => {
          console.log("Server responded:", response);
          getCurrentLocation();
          // getCurrentSOS();
          if (response?.status === false && helpingUserId !== null) {
            console.log("270 Detail SOS get sender location", helpingUserId);
            setHelpingTheUserId(helpingUserId);
            console.log(
              "helpingUserId 200:",
              helpingUserId,
              currentSOS?.longitude,
              currentSOS?.latitude
            );

            displayOfflineMarker(
              helpingUserId,
              currentSOS?.longitude,
              currentSOS?.latitude,
              false
            );
          } else {
            console.log("SENDER ONLINE");
            setCheckRoute(true);
          }
        }
      );
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [currentSOS, helpingUserId]);
  const handleCancelSOS = async () => {
    try {
      console.log("Cancel SOS clicked");
      if (currentSOS) {
        const result = await rescuerServices.updateRescuer({
          longitude: currentSOS.SOS.longitude,
          latitude: currentSOS.SOS.latitude,
          accuracy: currentSOS.SOS.accuracy,
          status: "CANCELED",
        });
      }
      if (socket.current) {
        console.log("🧹 Cleaning up socket connections...");

        // Remove all event listeners
        socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
        socket.current.disconnect();
        socket.current.emit("TOSERVER_LEAVE_SOS_GROUP", {
          sosId: sosId,
          userId: profile?.id,
          reason: "CANCELED",
        });

        console.log("✅ Socket cleanup completed");
      }
      if (chatSocket) {
        console.log("🧹 Cleaning up chat socket...");
        chatSocket.off("receive_message");
        chatSocket.off("chat_history");
        chatSocket.emit("leave_room", { groupId });

        console.log("✅ Chat socket cleanup completed");
      }
      setUserInfo("NORMAL");
      // setCurrentSOS(null);
      setCheckSOS(false);
      setShowCancelDialog(false);
      Toast.show({
        type: "success",
        text1: "SOS Cancelled",
        text2: "You have canceled your request for emergency assistance.",
      });
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      console.log("Error", error.response?.data);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error when cancel support!",
      });
    }
  };
  const showCancelConfirmation = () => {
    setShowCancelDialog(true);
  };
  const handleBack = () => {
    if (!checkSOS) {
      if (socket.current) {
        console.log("🧹 Cleaning up socket connections...");

        // Remove all event listeners
        socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
        socket.current.disconnect();
        socket.current.emit("TOSERVER_LEAVE_SOS_GROUP", {
          sosId: sosId,
          userId: profile?.id,
          reason: "CANCELED",
        });

        console.log("✅ Socket cleanup completed");
      }
      if (chatSocket) {
        chatSocket.off("receive_message");
        chatSocket.off("chat_history");
        chatSocket.emit("leave_room", { groupId });
      }
      router.back();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1  w-full h-full justify-center items-center bg-white relative">
      <Map
        checkSOS={checkSOS}
        sos={currentSOS}
        cameraRef={cameraRef}
        listRescuer={listRescuer}
        otherUserMarkers={otherUserMarkers}
        checkRoute={checkRoute}
      ></Map>
      <TouchableOpacity
        onPress={handleBack}
        className="p-2 rounded-full absolute top-12 left-4 bg-gray-100"
      >
        <ImageCustom
          width={20}
          height={20}
          source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
        />
      </TouchableOpacity>
      <View className=" bg-[#EB4747] absolute top-12 rounded-[30px] opacity-90 px-7 py-3 flex justify-center items-center">
        <Text className="font-bold text-white ">Traffic Accident</Text>
      </View>

      <View className="absolute top-12 right-5 flex flex-col gap-3">
        {checkSOS && (
          <TouchableOpacity
            onPress={showCancelConfirmation}
            className="w-[40px] h-[40px] z-50  bg-[#EB4747] rounded-full flex justify-center items-center"
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=82826&format=png&color=000000"
              width={18}
              height={18}
              color="white"
            ></ImageCustom>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleControl()}
          className="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center shadow "
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=113259&format=png&color=000000",
            }}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: "#EB4747",
            }}
          />
        </TouchableOpacity>
        <View
          className={` ${
            isExpanded ? "w-[50px] h-[180px]" : "w-[30px] h-[135px]"
          } flex flex-col items-center gap-1 py-3  bg-[#FFDEDE] rounded-[90px]`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            className={`${
              isExpanded ? "w-[40] h-[40]" : "w-[24px] h-[24px]"
            } rounded-full bg-[#EB4747] flex justify-center items-center gap-2 flex-col`}
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=pvGJuQWtxCiV&format=png&color=000000"
              color="white"
              width={isExpanded ? 20 : 15}
              height={isExpanded ? 20 : 15}
            ></ImageCustom>
          </Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-col space-y-2 gap-1">
              {Object.values(otherUserMarkers)
                .filter((rescuer) => rescuer.userType === "HELPER")
                .map((rescuer, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleControl({
                        latitude: Number(rescuer?.latitude),
                        longitude: Number(rescuer.longitude),
                      });
                    }}
                  >
                    <Avatar
                      source={
                        rescuer?.avatarUrl || "https://via.placeholder.com/150"
                      }
                      width={isExpanded ? 40 : 24}
                      height={isExpanded ? 40 : 24}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>

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
                      color: "#000",
                      fontWeight: "bold",
                      marginRight: 6,
                    }}
                  >
                    {msg.name || "You"}:
                  </Text>
                  <Text style={{ color: "#000" }}>{msg.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="flex flex-row w-full px-5 gap-2">
          <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
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
      <Modal
        visible={showCancelDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelDialog(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              width: "100%",
              maxWidth: 340,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Dialog Header */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=82826&format=png&color=000000"
                  width={32}
                  height={32}
                  color="#EF4444"
                />
              </View>
              <Text className="text-xl font-bold text-gray-900 text-center">
                Cancel SOS Request
              </Text>
            </View>

            {/* Dialog Content */}
            <Text className="text-gray-600 text-center mb-6 leading-5">
              Are you sure you want to cancel this SOS request?
              {"\n\n"}
              This will stop emergency assistance and cannot be undone.
            </Text>

            {/* Dialog Actions */}
            <View className="flex-row space-x-3">
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setShowCancelDialog(false)}
                className="flex-1 bg-gray-100 py-3 px-4 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Keep Active
                </Text>
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity
                onPress={handleCancelSOS}
                className="flex-1 bg-red-500 py-3 px-4 rounded-lg"
              >
                <Text className="text-white font-semibold text-center">
                  Yes, Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default DetailSOS;
