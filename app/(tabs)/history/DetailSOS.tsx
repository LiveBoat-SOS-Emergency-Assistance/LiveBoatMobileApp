import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map from "../../../components/Map/Map";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
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
  const { userProfile } = useLocalSearchParams();
  const [listRescuer, setListRescuer] = useState<RescuerItem[]>([]);
  // const parsedProfile = profile ? JSON.parse(profile as string) : null;
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [helpingUserId, setHelpingTheUserId] = useState<number | null>(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const chatSocket = getChatSocket();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollViewRef = useRef<ScrollView>(null);
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { profile } = useAuth();
  const {
    socket,
    setUserInfo,
    updateLocation,
    otherUserMarkers,
    displayOfflineMarker,
    displayOrUpdateMarkers,
  } = useSocketContext();
  console.log("groupId 58Detail sos", groupId);
  // console.log("otherUserMarkers", otherUserMarkers);
  const [SOS, setSOS] = useState<any>(null);
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

        sendMessage(chatSocket, chatInput, groupId, profile?.id!);
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
  useFocusEffect(
    useCallback(() => {
      const getSOS = async () => {
        try {
          const current = await rescuerServices.getSOSCurrent();
          if (current.data) {
            setCurrentSOS(current.data);
            console.log("Current SOS 292:", current.data);
            setCheckSOS(true);
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

      getSOS();
    }, [])
  );
  const getCurrentSOS = async () => {
    try {
      const result = await sosService.getSOSById(currentSOS.SOS.id);
      console.log("Current SOS:", result.data);
      setSOS(result.data);
    } catch (error) {
      console.error("Error fetching helpingUserId:", error);
    }
  };
  useEffect(() => {
    if (!socket.current || !currentSOS) return;

    console.log("Rescuer mode active");

    socket.current.on(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION, (data) => {
      // console.log("The Sender location:", data);
      displayOrUpdateMarkers(data);
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS, (data) => {
      console.log("Other helper locations:", data);
      displayOrUpdateMarkers(data);
    });

    socket.current.on(SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED, (data) => {
      console.log("User disconnected:", data.userId);
      console.log("Helping User ID:", helpingUserId);
      if (data.userId == helpingUserId) {
        console.log("Sender disconnected, display offline marker");
        getCurrentSOS();
        displayOfflineMarker(data.userId, SOS?.longitude, SOS?.latitude);
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
          if (response?.status === false && helpingUserId !== null) {
            setHelpingTheUserId(helpingUserId);
            console.log("helpingUserId 200:", helpingUserId);
            displayOfflineMarker(helpingUserId, SOS?.longitude, SOS?.latitude);
          }
        }
      );
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [currentSOS]);

  return (
    <View className="flex-1  w-full h-full justify-center items-center bg-white relative">
      <Map
        checkSOS={checkSOS}
        sos={currentSOS}
        cameraRef={cameraRef}
        listRescuer={listRescuer}
        otherUserMarkers={otherUserMarkers}
      ></Map>
      <View className=" bg-[#EB4747] absolute top-12 rounded-[30px] opacity-90 px-7 py-3 flex justify-center items-center">
        <Text className="font-bold text-white ">Traffic Accident</Text>
      </View>
      {/* <View className="w-[50px] h-[50px] absolute bottom-10 right-5 bg-[#EB4747] rounded-full flex justify-center items-center">
        <ImageCustom
          width={27}
          height={27}
          color="white"
          source="https://img.icons8.com/?size=100&id=2WHX382zjkkB&format=png&color=000000"
        />
      </View> */}
      
      <View
        className={`absolute right-5 ${
          isExpanded ? "w-[50px] h-[180px]" : "w-[30px] h-[135px]"
        } flex flex-col items-center gap-1 py-3 top-[100px] bg-[#FFDEDE] rounded-[90px]`}
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
    </View>
  );
};
export default DetailSOS;
