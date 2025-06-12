import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { AnimatePresence } from "framer-motion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sosService } from "../../../services/sos";
import TopSheet, { TopSheetRef } from "../../../components/Modal/TopSheet";
import ItemSquad from "../../../components/Squad/ItemSquad";
import ModalCreateSquad from "../../../components/Modal/ModalCreateSquad";
import { groupServices } from "../../../services/group";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "../../../components/Image/Avatar";
import { Camera } from "@rnmapbox/maps";
import { getCurrentLocation } from "../../../utils/location";
import ImageCustom from "../../../components/Image/Image";
import Toast from "react-native-toast-message";
import { rescuerServices } from "../../../services/rescuer";
// import { useSocket } from "../../../hooks/useLiveLocation";
import BottomModal from "../../../components/Modal/BottomModal";
import MemberCard from "../../../components/Card/MemberCard";
import * as Animatable from "react-native-animatable";
import { useSocketContext } from "../../../context/SocketContext";
import CustomAlert from "../../../components/Toast/CustomAlert";
// import messaging from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 0,
  fade: false,
});
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

export default function HomeScreen() {
  const [checkSOS, setCheckSOS] = useState(false);
  const [currentSOS, setCurrentSOS] = useState<any>(null);
  const topSheetRef = useRef<TopSheetRef>(null);
  const [openModalCreateSquad, setOpenModalCreateSquad] = useState(false);
  const [group, setGroup] = useState<
    { id: string; name: string; description: string; member_amount: string }[]
  >([]);
  const { profile } = useAuth();
  const cameraRef = useRef<Camera>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectSquad, setSelectSquad] = useState<string | null>(null);
  const [selectNamesquad, setSelectNameSquad] = useState<string | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<boolean>(true);
  const [helpingUserId, setHelpingTheUserId] = useState<number | null>(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [showRescueDialog, setShowRescueDialog] = useState(false);
  const [rescueData, setRescueData] = useState<any>(null);

  const [listMember, setListMember] = useState<any[]>([]);
  const toggleBottomSheet = () => {
    setIsBottomSheetVisible((prev) => !prev);
  };
  const {
    socket,
    setUserInfo,
    updateLocation,
    otherUserMarkers,
    setOtherUserMarkers,
    displayOfflineMarker,
    clearAndRefreshMarkers,
    displayOrUpdateMarkers,
  } = useSocketContext();
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
    if (!socket.current) return;
    console.log("helo ");
    socket.current.on(SOCKET_EVENTS.TOCLIENT_SOS_LOCATIONS, (data) => {
      if (!data || data.length === 0) {
        console.log("No SOS locations received");
        return;
      }
      // console.log("Received SOS locations:", data);
      displayOrUpdateMarkers(data);
    });

    setUserInfo("NORMAL");

    const timeout1 = setTimeout(() => {
      socket.current?.emit(
        SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP
      );
    }, 3000);
    const timeout3 = setInterval(async () => {
      const location = await getCurrentLocation();
      if (location) {
        updateLocation(
          location.latitude,
          location.longitude,
          location.accuracy ?? 0
        );
      }
    }, 5000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout3);
    };
  }, []);

  const handleGiveSupport = async (id: string) => {
    try {
      const result = await rescuerServices.postRescuer(Number(id), location);
      if (result) {
        Toast.show({
          type: "success",
          text1: "Help on the way!",
          text2: "Thank you for responding to the SOS. Stay safe!",
        });
        await AsyncStorage.setItem("SOSID", id.toString());

        router.push({
          pathname: "/(tabs)/history/DetailSOS",
          params: {
            userProfile: JSON.stringify(profile),
            checkHelping: "true",
          },
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Notification!",
        text2: "You are already assisting another SOS request.",
      });
      console.log("Error", error.response?.data);
    }
  };

  useEffect(() => {
    if (!socket.current || !currentSOS) return;

    console.log("Rescuer mode active");

    socket.current.on(SOCKET_EVENTS.TOCLIENT_THE_SENDER_LOCATION, (data) => {
      displayOrUpdateMarkers(data);
    });
  }, [currentSOS]);

  // Func to zoom to current location
  const handleControl = async () => {
    try {
      const location = await getCurrentLocation();
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
  const openSheet = () => {
    topSheetRef.current?.open();
  };
  const handleClose = () => {
    setOpenModalCreateSquad(false);
  };

  const navigation = useNavigation();
  // Prevent comeback the Home.
  useFocusEffect(
    useCallback(() => {
      // Block back with gesture or back button on header
      const unsubscribe = navigation.addListener(
        "beforeRemove",
        (e: { preventDefault: () => void }) => {
          e.preventDefault();
        }
      );

      // Block back with Android physical button
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
    }, [])
  );
  // Check accessToken to direct
  useEffect(() => {
    const initialize = async () => {
      try {
        // check to direct
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.log("No token, redirecting to login...");
          router.replace("/");
          return;
        }
      } catch (error: any) {
        console.log("Fetch error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    };
    initialize();
  }, []);
  // Func to check the User is supporting other?
  useFocusEffect(
    useCallback(() => {
      const getSOS = async () => {
        try {
          const current = await rescuerServices.getSOSCurrent();
          if (current.data) {
            console.log("Current SOS 292:", current.data);

            // ✅ Lưu data và hiển thị dialog
            setRescueData(current.data);
            setShowRescueDialog(true);

            // Set state nhưng chưa navigate
            setCurrentSOS(current.data);
            setCheckSOS(true);
            setHelpingTheUserId(current.data.SOS.user_id);
          } else {
            // Reset states nếu không có SOS đang cứu
            setCurrentSOS(null);
            setCheckSOS(false);
            setRescueData(null);
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
          setRescueData(null);
        }
      };

      getSOS();
    }, [])
  );

  const handleGoToRescue = async () => {
    try {
      setShowRescueDialog(false);

      await AsyncStorage.setItem("SOSID", rescueData.SOS.id.toString());

      Toast.show({
        type: "info",
        text1: "Redirecting...",
        text2: "Taking you to the rescue page.",
      });

      router.push({
        pathname: "/(tabs)/history/ProfileSOS",
        params: { id: rescueData.SOS.id, checkHelping: "true" },
      });
    } catch (error) {
      console.error("Error navigating to rescue page:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to navigate to rescue page.",
      });
    }
  };

  const handleStayOnHome = () => {
    setShowRescueDialog(false);
    console.log("User chose to stay on home page");

    Toast.show({
      type: "info",
      text1: "Staying on Home",
      text2: "You can access rescue details anytime from notifications.",
    });
  };
  // Func to get SQUAD
  useFocusEffect(
    useCallback(() => {
      const getGroup = async () => {
        try {
          const result = await groupServices.getGroup();
          if (result && result.data) {
            const reversedData = result.data.reverse();
            console.log("Groups:", reversedData);
            setGroup(reversedData);
            setSelectNameSquad(reversedData[0]?.name);
            setSelectSquad(reversedData[0]?.id);
          }
        } catch (error: any) {
          console.log("Error fetching groups:", error);
        }
      };

      getGroup();
      setIsRefreshing(false);
    }, [isRefreshing])
  );

  // Check if the user is creating the SOS signal
  useFocusEffect(
    useCallback(() => {
      const handleGetMySOS = async () => {
        try {
          const sos = await sosService.getMySOSCurrent();
          if (sos && sos.data) {
            await AsyncStorage.setItem("sosId", sos.data.id);
            await AsyncStorage.setItem("longitudeSOS", sos.data.longitude);
            await AsyncStorage.setItem("latitudeSOS", sos.data.latitude);
            await AsyncStorage.setItem("accuracySOS", sos.data.accuracy);
            router.push("/(tabs)/home/SOSMap");
          }
        } catch (error: any) {
          console.log("Error at get my sos", error);
        }
      };

      handleGetMySOS();
    }, [])
  );
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.min(prev + 1, 20);
      if (cameraRef.current) {
        cameraRef.current.zoomTo(newZoom, 500);
      }
      return newZoom;
    });
  };
  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 1, 1);
      if (cameraRef.current) {
        cameraRef.current.zoomTo(newZoom, 500);
      }
      return newZoom;
    });
  };

  const getMember = async () => {
    try {
      console.log("hi", selectSquad);
      console.log("hii", selectNamesquad);

      const result = await groupServices.getMemberByIdGroup(
        Number(selectSquad)
      );
      console.log("Members:", result.data);
      setListMember(result.data);
    } catch (error: any) {
      console.error("Error fetching members:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
    }
  };
  useEffect(() => {
    if (selectSquad) {
      getMember();
    }
  }, [selectSquad]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View className="flex-1 w-full h-full justify-center items-center bg-white relative">
        {/* Header */}
        {/* {checkSOS ? (
          <Map
            checkSOS={checkSOS}
            sos={currentSOS}
            cameraRef={cameraRef}
            otherUserMarkers={otherUserMarkers}
          ></Map>
        ) : ( */}
        <Map
          signal="normal"
          cameraRef={cameraRef}
          otherUserMarkers={otherUserMarkers}
        ></Map>
        {/* )} */}
        <CustomAlert
          visible={isAlertVisible}
          title="SOS Completed"
          message="The SOS you were helping has been completed."
          onConfirm={() => {
            console.log("Confirmed!");
            setAlertVisible(false);
          }}
          confirmText="OK"
          onCancel={() => {
            console.log("Cancelled!");
            setAlertVisible(false);
          }}
          cancelText="Cancel"
        />
        {openModalCreateSquad && (
          <View className="absolute top-1/2 left-0">
            <ModalCreateSquad
              onClose={handleClose}
              onRefresh={() => setIsRefreshing((prev) => !prev)}
            />
          </View>
        )}
        <TopSheet ref={topSheetRef}>
          <View
            className="flex flex-col pt-3 pb-0 gap-3  justify-center items-center w-full relative"
            style={{ minHeight: 100 }}
          >
            {group.length > 0 && (
              <>
                <View
                  className="w-[50%] h-[43px] bg-[#80C4E9] rounded-[30px] flex justify-center items-center relative"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text
                    className="text-white text-base font-bold"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {selectNamesquad}
                  </Text>
                </View>
                <View className="h-[160px] w-full pr-5 pb-16">
                  {/* Adjusted padding for button space */}
                  <ScrollView
                    className="w-full px-7"
                    contentContainerStyle={{
                      gap: 8,
                      justifyContent: "flex-start",
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {group.map((squad) => (
                      <ItemSquad
                        key={squad.id}
                        name={squad.name}
                        id={squad.id}
                        member_amount={Number(squad?.member_amount) || 1}
                        onPress={() => {
                          router.push({
                            pathname: "/(main)/squad",
                            params: { id: squad.id, name: squad.name },
                          });
                          setSelectSquad(squad.id);
                        }}
                        onSelectId={() => {
                          setSelectNameSquad(squad.name);
                          setSelectSquad(squad.id.toString());
                          topSheetRef.current?.close();
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
            <View className="absolute w-full justify-self-end px-5 flex flex-col bottom-0 bg-white items-end">
              {group.length === 0 && (
                <Text
                  className="text-[#80C4E9] text-base font-medium w-full text-center"
                  style={{ fontFamily: "Poppins", marginBottom: 10 }}
                >
                  Let's start creating squads!
                </Text>
              )}
              <Pressable
                onPress={() => setOpenModalCreateSquad(true)}
                className="w-[40%] h-[43px] bg-white rounded-[40px] flex justify-center items-center relative border border-[#80C4E9]"
                style={{
                  shadowColor: "#80C4E9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text
                  className="text-[#80C4E9] text-sm font-bold"
                  style={{ fontFamily: "Poppins" }}
                >
                  Create a squad
                </Text>
              </Pressable>
            </View>
          </View>
        </TopSheet>
        {/* HEADER INCLUES AVATAR , MESSAGES*/}
        <View className="absolute top-[45px] w-full flex flex-col items-center px-2">
          <View className="w-full flex flex-row items-center justify-between px-2">
            {/* Avatar */}
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Pressable onPress={() => router.push("/(main)/profile")}>
                <Avatar
                  source={profile?.User?.avatar_url}
                  width={65}
                  height={65}
                ></Avatar>
              </Pressable>
            </View>

            {/* Button Cộng đồng */}
            <Pressable
              onPress={openSheet}
              className="w-[200px] h-[43px] bg-[#EB4747] rounded-[30px] flex justify-center items-center relative"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                className="text-white text-base font-bold"
                style={{ fontFamily: "Poppins" }}
              >
                {selectNamesquad}
              </Text>
              <ChevronDown
                size={20}
                color="white"
                style={{ position: "absolute", right: 20 }}
              />
            </Pressable>

            {/* Message */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push("/(main)/chat");
              }}
              // onPress={() => router.push("/(main)/chat")}
              className="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center shadow"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=59835&format=png&color=000000",
                }}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: "contain",
                  tintColor: "#EB4747",
                }}
              />
            </TouchableOpacity>
          </View>
          <View className="w-full justify-end items-end px-2">
            {/* Geoson Control */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleControl}
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
          </View>
        </View>
        {/* Footer */}
        <View
          style={{
            position: "absolute",
            bottom: isBottomSheetVisible ? 230 : 80,
            right: isBottomSheetVisible ? 10 : 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Zoom In Button*/}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleZoomIn}
            style={{
              width: 35,
              height: 35,
              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Plus size={20} color="#EB4747" />
          </TouchableOpacity>

          {/* Zoom out button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleZoomOut}
            style={{
              width: 35,
              height: 35,
              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Minus size={20} color="#EB4747" />
          </TouchableOpacity>

          {/* Click to open Bottom Sheet */}

          <TouchableOpacity activeOpacity={0.8} onPress={toggleBottomSheet}>
            <Animatable.View
              animation="rubberBand"
              iterationCount="infinite"
              duration={1500}
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#EB4747",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              {isBottomSheetVisible ? (
                <ChevronDown size={20} color="white" />
              ) : (
                <ChevronUp size={20} color="white" />
              )}
            </Animatable.View>
          </TouchableOpacity>
        </View>
        {/* Bottome Sheet for MEMBER AND PLACES */}
        {/* {false && (
          <View
            className="absolute bottom-[100px] w-full flex flex-row gap-2"
            style={{
              position: "absolute",
              bottom: isBottomSheetVisible ? 230 : 80,
              left: 10,
              zIndex: 0,
            }}
          >
            <TouchableOpacity
              onPress={handleCancelSOS}
              activeOpacity={0.8}
              className="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center shadow "
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
                width={18}
                height={18}
                color="#EB4747"
              ></ImageCustom>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/history/ProfileSOS",
                  params: { id: currentSOS.SOS.id },
                });
              }}
              activeOpacity={0.8}
              className=" h-[40px] px-4 bg-[#EB4747] rounded-full flex flex-row justify-center gap-2 items-center shadow "
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=99921&format=png&color=000000"
                width={18}
                height={18}
                color="white"
              ></ImageCustom>
              <Text className="text-white font-bold text-[13px]">Detail</Text>
            </TouchableOpacity>
          </View>
        )} */}
        <AnimatePresence>
          {isBottomSheetVisible && (
            <BottomModal>
              <View className="w-full flex flex-col justify-center items-center">
                <View
                  className="flex flex-row h-[50px] w-[80%] rounded-[30px] px-1 bg-[#fdb1b1] justify-around items-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Pressable
                    onPress={() => setActiveTab(true)}
                    className={`w-1/2 h-[85%] rounded-[30px] flex justify-center items-center ${
                      activeTab ? "bg-white " : "bg-transparent"
                    }`}
                    style={[
                      activeTab && {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      className={`font-bold ${
                        activeTab ? "text-[#EB4747]" : "text-white"
                      }`}
                    >
                      Member
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveTab(false)}
                    className={`w-1/2 h-[85%] rounded-[30px] flex justify-center items-center ${
                      activeTab === false ? "bg-white" : "bg-transparent"
                    }`}
                    style={[
                      activeTab === false && {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      className={`font-bold ${
                        activeTab === false ? "text-[#EB4747]" : "text-white"
                      }`}
                    >
                      Places
                    </Text>
                  </Pressable>
                </View>
                {activeTab && (
                  <ScrollView
                    style={{ width: "100%", flexGrow: 1 }}
                    contentContainerStyle={{
                      paddingVertical: 20,
                      gap: 25,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {listMember.map((member) => (
                      <MemberCard
                        member={member}
                        key={member.id}
                        id={member.id}
                        avatar={member?.User.avatar_url}
                        // onPress={() => {
                        //   router.push({
                        //     pathname: "/(tabs)/profile",
                        //     params: { id: member.id },
                        //   });
                        // }}
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            </BottomModal>
          )}
        </AnimatePresence>
        {/* ✅ Rescue Alert Dialog */}
        <Modal
          visible={showRescueDialog}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRescueDialog(false)}
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
                    source="https://img.icons8.com/?size=100&id=99921&format=png&color=000000"
                    width={32}
                    height={32}
                    color="#EF4444"
                  />
                </View>
                <Text className="text-xl font-bold text-gray-900 text-center">
                  Active Rescue Mission
                </Text>
              </View>

              {/* Dialog Content */}
              <View className="mb-6">
                <Text className="text-gray-600 text-center mb-4 leading-5">
                  You are currently helping someone in an emergency situation.
                </Text>

                {rescueData && (
                  <View className="bg-gray-50 p-3 rounded-lg mb-4">
                    <Text className="text-sm text-gray-700 mb-1">
                      <Text className="font-semibold">SOS ID:</Text> #
                      {rescueData.SOS.id}
                    </Text>
                    <Text className="text-sm text-gray-700 mb-1">
                      <Text className="font-semibold">Status:</Text>{" "}
                      {rescueData.SOS.status || "Active"}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      <Text className="font-semibold">Location:</Text>{" "}
                      {rescueData.SOS.address || "Emergency Location"}
                    </Text>
                  </View>
                )}

                <Text className="text-gray-600 text-center leading-5">
                  Would you like to go to the rescue page to continue helping?
                </Text>
              </View>

              {/* Dialog Actions */}
              <View className="flex-row space-x-3 gap-2">
                {/* Stay Button */}
                <TouchableOpacity
                  onPress={handleStayOnHome}
                  className="flex-1 bg-gray-100 py-3 px-4 rounded-lg"
                >
                  <Text className="text-gray-700 font-semibold text-center">
                    Stay Here
                  </Text>
                </TouchableOpacity>

                {/* Go to Rescue Button */}
                <TouchableOpacity
                  onPress={handleGoToRescue}
                  className="flex-1 bg-red-500 py-3 px-4 rounded-lg"
                >
                  <Text className="text-white font-semibold text-center">
                    Go to Rescue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}
