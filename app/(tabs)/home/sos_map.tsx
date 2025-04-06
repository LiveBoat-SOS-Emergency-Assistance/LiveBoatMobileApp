import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Video } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import ImageCustom from "../../../components/Image/Image";
import { AnimatePresence } from "framer-motion";
import BottomModal from "../../../components/Modal/BottomModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SlideToCancel from "../../../components/Button/SlideCancelButton";
import { router } from "expo-router";

export default function SOSMap() {
  const [isDisable, setIsDisable] = useState(false);
  const handleDisableSOS = () => {
    setIsDisable(true);
  };

  const handleCancelSOS = () => {
    setIsDisable(false);
    router.push("/(tabs)/home/sos_diable");
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 bg-[#EB4747] py-8 items-center z-10 rounded-b-[30px]">
          <Text className="text-white text-lg font-bold pt-3">
            SOS Activated
          </Text>
        </View>
        <Map signal="sos" />

        {/* Action Buttons */}
        <View className="absolute top-[100px] gap-5 left-0 right-0 flex-row justify-center space-x-4">
          <TouchableOpacity className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full">
            <Video color="white" size={24} />
            <Text className="text-white ml-2">Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full">
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=d7iUgF8ZrDaO&format=png&color=000000"
              width={24}
              height={24}
              color="#ffffff"
            ></ImageCustom>
            <Text className="text-white ml-2">Group Chat</Text>
          </TouchableOpacity>
        </View>
        {isDisable ? (
          <AnimatePresence>
            <BottomModal expandedHeight={55} collapsedHeight={55} color="white">
              <View className="flex flex-col justify-center w-full h-full items-center gap-4 relative">
                <View className="flex flex-col justify-center items-center gap-2  absolute top-3">
                  <View className="flex flex-row justify-center ">
                    <Text className="text-[#404040] font-bold text-lg">
                      SOS has been activated–
                    </Text>
                    <Text className="text-[#EB4747] font-bold text-lg">
                      03:25 minutes
                    </Text>
                  </View>
                  <Image
                    source={require("../../../assets/images/imageDisable.png")}
                  ></Image>
                  <View className="flex flex-col gap-4">
                    <Text className="text-[#EB4747] font-semibold">
                      Are you sure you want to cancel SOS?
                    </Text>
                    <View className="flex flex-row">
                      <Text className="text-[#404040] opacity-1 italic">
                        If you are still in danger, keep
                      </Text>
                      <TouchableOpacity onPress={() => setIsDisable(false)}>
                        <Text className="text-[#4F8AAB] italic underline">
                          {" "}
                          SOS active!
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <SlideToCancel onCancel={handleCancelSOS}></SlideToCancel>
              </View>
            </BottomModal>
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
                  ></ScrollView>
                </View>
              </BottomModal>
            </AnimatePresence>
            {/* Bottom Controls */}
            <View className="absolute bg-white border border-t-[#ddd] bottom-0 py-5 left-0 right-0 flex-row justify-around px-5  items-center">
              {/* <Text className="text-lg font-bold text-gray-400">Are you OK?</Text> */}
              {/* <CustomButton secondary title="Edit SOS"></CustomButton> */}
              <TouchableOpacity
                // onPress={handleDisableSOS}
                className="flex-row items-center bg-white px-4 py-2 rounded-full shadow"
              >
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=86376&format=png&color=404040"
                  width={24}
                  height={24}
                  color="#404040"
                ></ImageCustom>
                <Text className="text-black ml-2 font-bold">Edit SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDisableSOS}
                className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full"
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
