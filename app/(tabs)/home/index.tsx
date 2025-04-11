import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  BackHandler,
  PermissionsAndroid,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronDown } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router, useFocusEffect } from "expo-router";
import { AnimatePresence } from "framer-motion";
import BottomModal from "../../../components/Modal/BottomModal";
import MemberCard from "../../../components/Card/MemberCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { sosService } from "../../../services/sos";
import TopSheet, { TopSheetRef } from "../../../components/Modal/TopSheet";
import ItemSquad from "../../../components/Squad/ItemSquad";
import ModalCreateSquad from "../../../components/Modal/ModalCreateSquad";
import { groupServices } from "../../../services/group";
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState(true);
  const [checkSOS, setCheckSOS] = useState(false);
  const [currentSOS, setCurrentSOS] = useState<any>(null);
  const topSheetRef = useRef<TopSheetRef>(null);
  const [openModalCreateSquad, setOpenModalCreateSquad] = useState(false);
  const [group, setGroup] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const openSheet = () => {
    topSheetRef.current?.open();
  };
  const { width, height } = Dimensions.get("window");
  const handleClose = () => {
    setOpenModalCreateSquad(false);
    console.log("Clickkkk");
  };
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
        // Handle error gracefully
      }
    };
    initialize();
  }, []);
  useEffect(() => {
    const getSOS = async () => {
      try {
        const current = await sosService.getSOSCurrent();
        // const result = await groupServices.getGroup();

        console.log("current");
        if (current && current.data) {
          setCurrentSOS(current.data);
          setCheckSOS(true);
        } else {
          console.log("khong co ");
        }
        // if (result && result.data) {
        //   console.log("kkk", result.data);
        // }
      } catch (error: any) {
        console.log(error);
        setCurrentSOS(null);
        setCheckSOS(false);
      }
    };
    getSOS();
  }, []);
  useEffect(() => {
    const getSOS = async () => {
      try {
        const result = await groupServices.getGroup();
        if (result && result.data) {
          console.log("kkk", result.data);
          setGroup(result.data);
        }
      } catch (error: any) {
        console.log("get squad", error);
      }
    };
    getSOS();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <View className="flex-1 w-full h-full justify-center items-center bg-white relative">
        {/* Header */}
        {checkSOS ? <Map sos={currentSOS}></Map> : <Map signal="normal"></Map>}
        {openModalCreateSquad && <ModalCreateSquad onClose={handleClose} />}
        {/* {openModalCreateSquad && <ModalCreateSquad onClose={handleClose} />} */}
        {/* <Modal
          isVisible={openModalCreateSquad}
          onBackdropPress={() => setOpenModalCreateSquad(false)}
          onBackButtonPress={() => setOpenModalCreateSquad(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver
          statusBarTranslucent
          backdropOpacity={0.5}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              marginTop: height / 3,
              marginLeft: 50,
            }}
          >
            <ModalCreateSquad onClose={handleClose} />
          </View>
        </Modal> */}
        <TopSheet ref={topSheetRef}>
          <View className="flex flex-col pb-4 gap-3 justify-center items-center w-full">
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
                My family
              </Text>
            </View>
            <ScrollView
              className="w-full px-7"
              contentContainerStyle={{ gap: 8 }} // Replace gap-2 with contentContainerStyle
              showsVerticalScrollIndicator={true}
            >
              {group.map((squad) => (
                <ItemSquad key={squad.id} name={squad.name} id={""} />
              ))}
            </ScrollView>
            <View className="w-full justify-around flex flex-row">
              <Pressable
                // onPress={() => router.push("/(tabs)/home/add_group")}
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
              <Pressable
                className="w-[40%] h-[43px] bg-[#80C4E9] rounded-[30px] flex justify-center items-center relative"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text
                  className="text-white text-sm font-bold"
                  style={{ fontFamily: "Poppins" }}
                >
                  Join a squad
                </Text>
              </Pressable>
            </View>
          </View>
        </TopSheet>
        {/* {!checkSOS ? <Map signal="normal"></Map> : checkSOS ? <Map sos={currentSOS}></Map>} */}

        {/* HEADER INCLUES AVATAR , MESSAGES*/}
        <View className="absolute top-[45px] w-full flex flex-col items-center px-2">
          <View className="w-full flex flex-row items-center justify-between px-2">
            {/* Avatar */}
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Pressable onPress={() => router.push("/(main)/profile")}>
                <Image
                  className="w-[65px] h-[65px] rounded-full object-cover"
                  source={require("../../../assets/images/ava.jpg")}
                />
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
                My family
              </Text>
              <ChevronDown
                size={20}
                color="white"
                style={{ position: "absolute", right: 20 }}
              />
            </Pressable>

            {/* Message */}
            <Pressable
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
            </Pressable>
          </View>
          <View className="w-full justify-end items-end px-2">
            <Pressable
              // onPress={handleEditSOS}
              className="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center shadow "
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=112468&format=png&color=000000",
                }}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: "contain",
                  tintColor: "#EB4747",
                }}
              />
            </Pressable>
          </View>
        </View>
        {/* Bottome Sheet for MEMBER AND PLACES */}
        <AnimatePresence>
          <BottomModal>
            <View className="w-full flex flex-col justify-center items-center">
              <View
                className="flex flex-row h-[50px] gap-4 w-[80%] rounded-[30px] px-1 bg-[#fdb1b1] justify-around items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Pressable
                  className={`w-1/2 h-[85%] rounded-[30px] flex justify-center items-center ${
                    activeTab ? "bg-white shadow-md" : "bg-transparent"
                  }`}
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
                  className={`w-1/2 h-[85%] rounded-[30px] flex justify-center items-center ${
                    activeTab === false
                      ? "bg-white shadow-md"
                      : "bg-transparent"
                  }`}
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

              <ScrollView
                style={{ width: "100%", flexGrow: 1 }}
                contentContainerStyle={{
                  paddingVertical: 20,
                  gap: 25,
                }}
                showsVerticalScrollIndicator={false}
              >
                <MemberCard active />
                <MemberCard />
                <MemberCard />
              </ScrollView>
            </View>
          </BottomModal>
        </AnimatePresence>
      </View>
    </GestureHandlerRootView>
  );
}
