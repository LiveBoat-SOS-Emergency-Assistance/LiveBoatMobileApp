import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  BackHandler,
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

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState(true);
  const handleChangeTab = useCallback((choice: boolean) => {
    console.log("choice", choice);
    setActiveTab(choice);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getAccessToken = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          router.replace("/");
          return;
        }
      };
      getAccessToken();
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View className="flex-1 w-full h-full justify-center items-center bg-white relative">
        {/* Header */}
        <Map signal="normal"></Map>
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
            <View
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
            </View>

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
