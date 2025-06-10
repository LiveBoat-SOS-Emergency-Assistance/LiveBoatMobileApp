import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  BackHandler,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import ImageCustom from "../../../components/Image/Image";
import { AnimatePresence, time } from "framer-motion";
import BottomModal from "../../../components/Modal/BottomModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SlideToCancel from "../../../components/Button/SlideCancelButton";
import { router, useFocusEffect, useNavigation } from "expo-router";
import CustomDialog from "../../../components/Dialog/DialogEditSOS";
import AddressSOSCard from "../../../components/Card/AddressSOSCard";
import Avatar from "../../../components/Image/Avatar";
import { Camera } from "@rnmapbox/maps";
import { getCurrentLocation, LocationResult } from "../../../utils/location";
import { rescuerServices } from "../../../services/rescuer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sosService } from "../../../services/sos";
import Toast from "react-native-toast-message";
import { useSocketContext } from "../../../context/SocketContext";
import { useAuth } from "../../../context/AuthContext";
import { getChatSocket, getMediaSoupSocket } from "../../../utils/socket";
import { initializeChatModule } from "../../../sockets/ChatModule";
import * as mediaSoupModule from "../../../mediaSoup/index";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";

// registerGlobals();
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
export const mediaSoupSocket = getMediaSoupSocket();
export const chatSocket = getChatSocket();
interface SocketEvents {
  TOCLIENT_HELPER_LOCATIONS: string;
  TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP: string;
  TOSERVER_SOS_FINISHED: string;
}
export default function SOSMap() {
  const [isDisable, setIsDisable] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);
  const [listRescuer, setListRescuer] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sosId, setSosId] = useState<string | null>(null);
  const sosIdRef = useRef<string | null>(null);
  const userId = useAuth()?.profile?.id;

  const [groupId, setGroupId] = useState<string | null>(null);
  const { profile } = useAuth();
  const chatSocket = getChatSocket();
  const [sosStartTime, setSosStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateElapsedTime = useCallback((startTime: Date) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  useEffect(() => {
    if (sosStartTime) {
      // Update timer every second
      timerRef.current = setInterval(() => {
        setCurrentTime(calculateElapsedTime(sosStartTime));
      }, 1000);

      // Cleanup on unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [sosStartTime, calculateElapsedTime]);
  useEffect(() => {
    const getSOSId = async () => {
      try {
        const id = await AsyncStorage.getItem("sosId");
        setSosId(id);
        sosIdRef.current = id;
        const result = await sosService.getSOSById(Number(id));
        console.log("SOSMap: SOS ID", result.data.created_at);
        const startTime = new Date(result.data.created_at);
        setSosStartTime(startTime);

        setCurrentTime(calculateElapsedTime(startTime));
      } catch (error) {
        console.log("Error when get SOS ID", error);
      }
    };
    getSOSId();
  }, []);
  const consumeOnly = (): Promise<any> => {
    return mediaSoupModule.joinRoom({
      isConsumeOnly: true,
      userId: profile?.id,
    });
  };
  const initialize = async () => {
    try {
      const storedSosId = await AsyncStorage.getItem("sosId");
      setSosId(storedSosId);

      const fetchedGroupId = await sosService.getGroupBySOSID(
        Number(storedSosId)
      );
      console.log("Fetched group ID:", fetchedGroupId.data);
      setGroupId(fetchedGroupId.data);

      if (chatSocket && fetchedGroupId) {
        console.log("Chat Socket at sos", chatSocket.id);
        initializeChatModule({
          chatSocket,
          groupId: fetchedGroupId.data,
        });
      }
      console.log("before mediaSoupSocket");
      if (mediaSoupSocket) {
        mediaSoupModule.initializeMediaSoupModule();
      }
      consumeOnly();
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleDisableSOS = () => {
    setIsDisable(true);
  };
  const {
    socket,
    // userId,
    setUserInfo,
    updateLocation,
    otherUserMarkers,
    setOtherUserMarkers,
    displayOrUpdateMarkers,
    registerCommonSocketEvents,
  } = useSocketContext();
  const SOCKET_EVENTS: SocketEvents = {
    TOCLIENT_HELPER_LOCATIONS: "TOCLIENT_HELPER_LOCATIONS",
    TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP:
      "TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP",
    TOSERVER_SOS_FINISHED: "TOSERVER_SOS_FINISHED",
  };
  // console.log("161 SOSMap, userId", userId);
  const handleCancelSOS = () => {
    setIsDisable(false);
    router.push({
      pathname: "/(tabs)/home/SOSDisable",
      params: {
        userId: userId,
      },
    });
  };
  const handleEditSOS = () => {
    setVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      registerCommonSocketEvents();
      console.log("🔄 useFocusEffect triggered with sosId:", sosId);

      socket?.current?.on(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS, (data) => {
        // console.log("The Helper locations:", data);
        if (data) {
          // Toast.show({
          //   type: "info",
          //   text1: "Notification",
          //   text2: "Someone is coming to support you!",
          //   position: "top",
          //   visibilityTime: 2000,
          // });
          console.log("191 Data Rescuer of SOSMap:", data);
          // setListRescuer(data);
          displayOrUpdateMarkers(data);
        }
      });
      const userType = "SENDER";
      setUserInfo(userType);
      const timeout1 = setTimeout(() => {
        socket.current?.emit(
          SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
        );
      }, 3000);

      // socket?.current?.emit(SOCKET_EVENTS.TOSERVER_SOS_FINISHED, { userId });
      const timeout2 = setTimeout(async () => {
        const location = await getCurrentLocation();
        if (location) {
          updateLocation(
            location.latitude,
            location.longitude,
            location.accuracy ?? 0
          );
        }
      }, 5000);

      let watchId = null;
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            updateLocation(
              position.coords.latitude,
              position.coords.longitude,
              position.coords.accuracy ?? 0
            );
            // Gọi sos_edit để update location SOS trên server
            if (sosId) {
              try {
                await sosService.sos_edit(sosId, {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy ?? 0,
                  status: "ONGOING",
                });
                console.log("SOSMAP 222: update location sos sender ");
              } catch (err) {
                console.log("Error updating SOS location:", err);
              }
            }
          },
          (error) => {
            console.log("Location watch error:", error);
          },
          { enableHighAccuracy: true }
        );
      }
      // Fallback: interval lấy location mỗi 10s (có thể bỏ nếu không cần)
      const locationInterval = setInterval(async () => {
        const location = await getCurrentLocation();
        if (location) {
          updateLocation(
            location.latitude,
            location.longitude,
            location.accuracy ?? 0
          );
          if (sosId) {
            try {
              await sosService.sos_edit(sosId, {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy ?? 0,
                status: "ONGOING",
              });
            } catch (err) {
              console.log("Error updating SOS location (interval):", err);
            }
          }
        }
      }, 5000);
      return () => {
        clearInterval(timeout1);
        clearTimeout(timeout2);
        clearInterval(locationInterval);
        if (watchId !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(watchId);
        }
        console.log("Unsubscribed from socket events");
        socket.current?.off(SOCKET_EVENTS.TOCLIENT_HELPER_LOCATIONS);
        setOtherUserMarkers([]);
        socket.current?.off(
          SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
        );
      };
    }, [sosId])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e: { preventDefault: () => void }) => {
        e.preventDefault();
      }
    );
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, isDisable]);
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

  const handleResolve = async () => {
    try {
      // setLoading(true);
      const longitude = await AsyncStorage.getItem("longitudeSOS");
      const latitude = await AsyncStorage.getItem("latitudeSOS");
      const accuracy = await AsyncStorage.getItem("accuracySOS");
      const sosId = await AsyncStorage.getItem("sosId");

      const result = await sosService.sos_edit(sosId!, {
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
        status: "RESOLVED",
      });
      await AsyncStorage.multiRemove([
        "longitudeSOS",
        "latitudeSOS",
        "accuracySOS",
        "sosId",
      ]);
      socket?.current?.emit(SOCKET_EVENTS.TOSERVER_SOS_FINISHED, { userId });
      // displayOrUpdateMarkers([]);
      setOtherUserMarkers({});
      Toast.show({
        type: "info",
        text1: "Notification",
        text2: "SOS has been resolved successfully!",
        position: "top",
        visibilityTime: 2000,
      });
      console.log("Result", result);
      router.push("/(tabs)/home");
      socket.current?.disconnect();
      socket.current?.connect();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={false} barStyle={"dark-content"} />
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 bg-[#EB4747] py-8 items-center z-10 rounded-b-[30px]">
          <Text className="text-white text-lg font-bold pt-3">
            SOS Activated
          </Text>
        </View>
        {visible && (
          <CustomDialog
            title="Edit SOS signal"
            message="Are you sure you want to edit the SOS signal?"
            confirmText="Accept"
            cancelText="Cancel"
            onConfirm={() => {
              console.log("Confirmed");
              setVisible(false);
            }}
            onCancel={() => setVisible(false)}
          />
        )}
        <Map
          signal="sos"
          cameraRef={cameraRef}
          listRescuer={listRescuer}
          otherUserMarkers={otherUserMarkers}
        />
        <View
          className={`absolute right-2 ${
            isExpanded ? "w-[50px] h-[180px]" : "w-[30px] h-[135px]"
          } flex flex-col items-center gap-1 py-3 top-[130px] bg-[#FFDEDE] rounded-[90px]`}
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
        {/* Action Buttons */}
        <View className="absolute top-[100px] gap-5 left-0 right-0 flex-row justify-center space-x-4">
          <TouchableOpacity
            onPress={() => {
              // router.push("/(tabs)/home/PreLive");
              router.push({
                pathname: "/(tabs)/home/PreLive",
                params: { groupId: groupId, sosId: sosId, isHost: "true" },
              });
            }}
            activeOpacity={0.8}
            className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full"
          >
            <Video color="white" size={24} />
            <Text className="text-white ml-2">Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/home/GroupChat",
                params: { groupId: groupId },
              });
            }}
            activeOpacity={0.8}
            className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full"
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=d7iUgF8ZrDaO&format=png&color=000000"
              width={24}
              height={24}
              color="#ffffff"
            ></ImageCustom>
            <Text className="text-white ml-2">Group Chat</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleResolve}
          activeOpacity={0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
          className="flex-row absolute  bottom-[240px] left-16 items-center bg-[#EB4747] px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Mark Safe</Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => handleControl()}
          className="w-[40px] absolute bottom-[235px] left-3 h-[40px] bg-white rounded-full flex justify-center items-center shadow "
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
        </Pressable>
        {isDisable ? (
          <AnimatePresence>
            <View className="absolute inset-0 z-40 bg-black/20">
              <TouchableWithoutFeedback onPress={() => setIsDisable(false)}>
                <View className="flex-1">
                  <BottomModal
                    expandedHeight={55}
                    collapsedHeight={55}
                    color="white"
                  >
                    {/* Add a TouchableWithoutFeedback to capture touches inside the modal */}
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View className="flex flex-col justify-center w-full h-full items-center gap-4 relative">
                        <View className="flex flex-col justify-center items-center gap-2 absolute top-3">
                          <View className="flex flex-row justify-center">
                            <Text className="text-[#404040] font-bold text-lg">
                              SOS has been activated–
                            </Text>
                            <Text className="text-[#EB4747] font-bold text-lg">
                              {currentTime} minutes
                            </Text>
                          </View>
                          <ImageCustom
                            width={160}
                            height={160}
                            source={require("../../../assets/images/imageDisable.png")}
                          />
                          <View className="flex flex-col gap-4">
                            <Text className="text-[#EB4747] font-semibold">
                              Are you sure you want to cancel SOS?
                            </Text>
                            <View className="flex flex-row">
                              <Text className="text-[#404040] opacity-1 italic">
                                If you are still in danger, keep
                              </Text>
                              <TouchableOpacity
                                onPress={() => setIsDisable(false)}
                              >
                                <Text className="text-[#4F8AAB] italic underline">
                                  {" "}
                                  SOS active!
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <SlideToCancel onCancel={handleCancelSOS} />
                      </View>
                    </TouchableWithoutFeedback>
                  </BottomModal>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </AnimatePresence>
        ) : (
          <>
            <AnimatePresence>
              <BottomModal color="white">
                <View className="w-full flex flex-col justify-center items-center">
                  <ScrollView
                    style={{ width: "100%", flexGrow: 1 }}
                    contentContainerStyle={{
                      paddingVertical: 20,
                      gap: 25,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    <AddressSOSCard></AddressSOSCard>
                  </ScrollView>
                </View>
              </BottomModal>
            </AnimatePresence>
            {/* Bottom Controls */}
            <View className="absolute bg-white border border-t-[#ddd] bottom-0 py-5 left-0 right-0 flex-row justify-around px-5  items-center">
              <TouchableOpacity
                onPress={handleEditSOS}
                className="flex-row items-center bg-white px-4 py-2 rounded-full shadow"
              >
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=86376&format=png&color=404040"
                  width={15}
                  height={15}
                  color="#404040"
                ></ImageCustom>
                <Text className="text-black ml-2 font-bold">Edit SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDisableSOS}
                className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full shadow"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=AqDEb8mCIrk9&format=png&color=000000"
                  width={24}
                  height={24}
                  color="#ffffff"
                ></ImageCustom>
                <Text className="text-white ml-2 font-bold">Disable SOS</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

export async function getRoomName() {
  const sosId = await AsyncStorage.getItem("sosId");
  return sosId;
}
