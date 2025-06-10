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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { SOSProfile } from "../../../types/sosItem";
const DetailSOS = () => {
  const [checkSOS, setCheckSOS] = useState(false);
  const [listRescuer, setListRescuer] = useState<RescuerItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [helpingUserId, setHelpingTheUserId] = useState<number | null>(null);
  const helpingUserIdRef = useRef<number | null>(null);
  const [currentSOS, setCurrentSOS] = useState<SOSProfile | null>(null);
  const setHelpingUserId = (value: number | null) => {
    console.log(`DetailSOS: Setting helpingUserId to ${value}`);
    setHelpingTheUserId(value);
    helpingUserIdRef.current = value;
  };
  const { sosId, userProfile, profileSOS } = useLocalSearchParams();
  const { idSender } = useLocalSearchParams<{ idSender: string }>();
  const { checkHelping } = useLocalSearchParams<{ checkHelping: string }>();
  console.log("checkHelping", checkHelping);
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const [isAlertVisible, setAlertVisible] = useState(false);
  const chatSocket = getChatSocket();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollViewRef = useRef<ScrollView>(null);
  const { profile } = useAuth();
  const {
    socket,
    setUserInfo,
    updateLocation,
    otherUserMarkers,
    displayOfflineMarker,
    displayOrUpdateMarkers,
    registerCommonSocketEvents,
    clearAndRefreshMarkers,
  } = useSocketContext();
  const [showSOSFinishedModal, setShowSOSFinishedModal] = useState(false);
  const [finishedSOSData, setFinishedSOSData] = useState<any>(null);

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
        sendMessage(
          chatSocket,
          chatInput,
          Array.isArray(groupId) ? groupId[0] : groupId,
          profile?.User?.id!
        );
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

  useEffect(() => {
    if (sosId && profileSOS) {
      try {
        const profileSOSString = Array.isArray(profileSOS)
          ? profileSOS[0]
          : profileSOS;
        const parsedSOS = JSON.parse(profileSOSString) as SOSProfile;
        setCurrentSOS(parsedSOS);
        console.log("163 Helping User ID:", idSender);
        setHelpingUserId(Number(idSender));
        setCheckSOS(checkHelping === "true");
      } catch (error) {
        console.error("Error parsing profileSOS:", error);
        setCurrentSOS(null);
      }
    }
  }, [sosId, profileSOS, idSender, checkHelping, profile]);
  const getCurrentSOS = async () => {
    try {
      console.log("Fetching SOS by ID:", sosId);
      const result = await sosService.getSOSById(Number(sosId));
      console.log("Current SOS:", profileSOS);
      // setSOS(result.data);
      setSOS(profileSOS);
      if (helpingUserId === null) {
        setHelpingUserId(result.data?.user_id);
      }

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
    console.log("Focus on DETAIL SOS screen");
    registerCommonSocketEvents();
    if (!socket.current) return;

    console.log("Rescuer mode active");

    socket?.current?.on(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION, (data) => {
      // console.log("The Sender location:", data);
      displayOrUpdateMarkers(data);
      setCheckRoute(true);
    });
    console.log("222 get helper locations");
    socket?.current.on(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS, (data) => {
      console.log("Other helper locations:", data);
      displayOrUpdateMarkers(data);
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED, (data) => {
      console.log("User disconnected:", data.userId);
      console.log("Helping User ID (from ref):", helpingUserIdRef.current);
      console.log("Helping User ID (from state):", helpingUserId);
      if (data.userId == helpingUserIdRef.current) {
        console.log("Sender disconnected, display offline marker");
        getCurrentSOS();
      }
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED, (data) => {
      console.log("User finished:", data.userId);
      console.log("Helping User ID (from ref):", helpingUserIdRef.current);
      if (data.userId == helpingUserIdRef.current) {
        setFinishedSOSData(data);
        setShowSOSFinishedModal(true);

        // ✅ Update states
        setHelpingUserId(null);
        setCheckSOS(false);
      }
    });
    console.log("256 checkHelping:", checkHelping);
    // if (checkHelping == "true") {
    //   console.log("267 --------------- cung cung cung");
    //   setUserInfo("HELPER");
    //   console.log('269 sau khi set userInfo "HELPER"');
    // }
    setUserInfo("HELPER");
    const timeout1 = setTimeout(() => {
      socket?.current?.emit(
        SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
      );
      console.log("178: helpingUserId:", helpingUserId);
      socket?.current?.emit(SOCKET_EVENTS.TOSERVER_REGISTER_SOS_SENDER, {
        helpingTheUserId: Number(idSender),
      });
      console.log("helpingUserId 181:", helpingUserId);
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
          getCurrentSOS();
          if (response?.status === false && helpingUserId !== null) {
            console.log(
              "helpingUserId 200:",
              helpingUserId,
              currentSOS?.longitude,
              currentSOS?.latitude
            );

            displayOfflineMarker(
              helpingUserId,
              Number(currentSOS?.longitude),
              Number(currentSOS?.latitude),
              false
            );
          } else {
            console.log("SENDER ONLINE");
            setCheckRoute(true);
          }
        }
      );
    }, 5000);

    // Cleanup on unfocus
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  const handleCancelSOS = async () => {
    try {
      console.log("Cancel SOS clicked");
      if (currentSOS) {
        const result = await rescuerServices.updateRescuer({
          longitude: currentSOS.longitude,
          latitude: currentSOS.latitude,
          accuracy: currentSOS.accuracy,
          status: "CANCELED",
        });
      }
      if (socket.current) {
        console.log("🧹 Cleaning up socket connections...");
        socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
        socket.current.disconnect();
        socket.current.connect();
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
      setCheckSOS(false);
      setShowCancelDialog(false);

      Toast.show({
        type: "success",
        text1: "SOS Cancelled",
        text2: "You have canceled your request for emergency assistance.",
      });
      clearAndRefreshMarkers();
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
  clearAndRefreshMarkers;
  const showCancelConfirmation = () => {
    setShowCancelDialog(true);
  };
  const handleBack = () => {
    if (checkHelping === "false") {
      if (socket.current) {
        console.log("🧹 Cleaning up socket connections...");
        socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
        socket.current.disconnect();
        socket.current.connect();
        console.log("✅ Socket cleanup completed");
      }
      if (chatSocket) {
        console.log("🧹 Cleaning up chat socket...");
        chatSocket.off("receive_message");
        chatSocket.off("chat_history");
        chatSocket.emit("leave_room", { groupId });
        console.log("✅ Chat socket cleanup completed");
      }
    }
    router.back();
  };
  const handleSOSFinishedConfirm = async () => {
    try {
      console.log("🏁 SOS Finished - cleaning up and navigating...");

      // ✅ Cleanup socket connections
      if (socket.current) {
        socket.current.off(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED);
        socket.current.off(SOCKET_EVENTS.TOCLIENT_SOS_FINISHED);
      }

      // ✅ Cleanup chat socket
      if (chatSocket) {
        chatSocket.off("receive_message");
        chatSocket.off("chat_history");
        chatSocket.emit("leave_room", { groupId });
      }

      // ✅ Reset user info
      setUserInfo("NORMAL");
      clearAndRefreshMarkers();

      // ✅ Close modal
      setShowSOSFinishedModal(false);
      setFinishedSOSData(null);

      // ✅ Navigate to history
      router.replace("/(tabs)/history");
    } catch (error) {
      console.error("Error handling SOS finished:", error);
      // Still navigate even if cleanup fails
      setShowSOSFinishedModal(false);
      router.replace("/(tabs)/history");
    }
  };

  // const handleSOSFinishedCancel = () => {
  //   // ✅ User muốn ở lại xem thêm
  //   setShowSOSFinishedModal(false);
  //   setFinishedSOSData(null);

  //   Toast.show({
  //     type: "info",
  //     text1: "Staying on scene",
  //     text2: "You can continue to monitor the situation.",
  //   });
  // };
  return (
    <View className="flex-1  w-full h-full justify-center items-center bg-white relative">
      <Map
        checkSOS={checkSOS}
        sos={currentSOS ?? undefined}
        cameraRef={cameraRef}
        listRescuer={listRescuer}
        otherUserMarkers={otherUserMarkers}
        checkRoute={checkRoute}
        idSender={idSender ?? undefined}
      ></Map>
      <TouchableOpacity
        onPress={() => handleBack()}
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
        {checkHelping === "true" && (
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
                    {msg.name || "You"}
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
            <View className="flex-row space-x-3 gap-2">
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
      <Modal
        visible={showSOSFinishedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setCheckSOS(false);
          setShowSOSFinishedModal(false);
        }}
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
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 360,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* ✅ Success Icon */}
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=7690&format=png&color=000000"
                  width={40}
                  height={40}
                  color="#10B981"
                />
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                SOS Completed! 🎉
              </Text>
            </View>

            {/* ✅ Content */}
            <View className="mb-6">
              <Text className="text-gray-600 text-center text-base leading-6 mb-4">
                The emergency situation has been successfully resolved. The
                person you were helping is now safe.
              </Text>

              <View className="bg-green-50 p-4 rounded-lg border border-green-200">
                <Text className="text-green-800 font-semibold text-center">
                  ✅ Mission Accomplished
                </Text>
                <Text className="text-green-700 text-sm text-center mt-1">
                  Thank you for your quick response and assistance!
                </Text>
              </View>
            </View>

            {/* ✅ Action Buttons */}
            <View className="flex-row space-x-3 gap-3">
              {/* Stay Button */}
              {/* <TouchableOpacity
                onPress={handleSOSFinishedCancel}
                className="flex-1 bg-gray-100 py-3 px-4 rounded-lg border border-gray-200"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Stay Here
                </Text>
              </TouchableOpacity> */}

              {/* Go to History Button */}
              <TouchableOpacity
                onPress={handleSOSFinishedConfirm}
                className="flex-1 bg-green-500 py-3 px-4 rounded-lg"
              >
                <Text className="text-white font-semibold text-center">
                  Got it!
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
