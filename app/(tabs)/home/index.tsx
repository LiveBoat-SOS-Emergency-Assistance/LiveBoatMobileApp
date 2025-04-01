import { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, Image, Pressable, Button, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronDown } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { AnimatePresence } from "framer-motion";
import BottomModal from "../../../components/Modal/BottomModal";
import LinearGradient from "react-native-linear-gradient";

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback(() => {
    console.log("Opening BottomSheet");
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View className="flex-1 w-full h-full justify-center items-center bg-white relative">
        {/* Header */}
        {/* <Map></Map> */}
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
                Gia đình
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
              onPress={openBottomSheet}
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
            <View className="flex flex-col gap-4">
              <LinearGradient
                colors={["#FFA6A6", "#F73D3D"]}
                style={styles.linear}
              >
                {[
                  <View
                    key="1"
                    className="w-full flex flex-row justify-between"
                  >
                    <Pressable className="">
                      <Text>Thành viên</Text>
                    </Pressable>
                    <Text>Địa điểm</Text>
                  </View>,
                ]}
              </LinearGradient>
            </View>
          </BottomModal>
        </AnimatePresence>
        {/* <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["25%", "50%"]}
          index={-1}
          style={{ zIndex: 10 }}
          enablePanDownToClose={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Nội dung BottomSheet</Text>
            <Button
              title="Đóng"
              onPress={() => bottomSheetRef.current?.close()}
            />
          </View>
        </BottomSheet> */}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  linear: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    borderRadius: 30,
    shadowColor: "#ddd",
  },
});
