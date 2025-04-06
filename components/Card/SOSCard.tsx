import { Image, Text, View } from "react-native";
import React from "react";
export default function SOSCard() {
  return (
    <View className="w-full max-w-[120px] h-[170px] bg-white rounded-[5px] flex justify-center items-center shadow-lg">
      <Image
        className="w-[90%] h-4/5 rounded-[5px] object-cover"
        source={require("../../assets/images/sos.png")}
      ></Image>
      <View className="flex flex-row gap-1 text-start justify-start items-start w-full px-2 pt-1">
        <Text className="text-[#404040] font-bold text-[8px]">Type:</Text>
        <Text className="text-[#404040] text-[7px]">Traffic accident</Text>
      </View>
      <View className="flex flex-row gap-1 text-start justify-start items-start w-full px-2">
        <Text className="text-[#404040] font-bold text-[8px]">Location:</Text>
        <Text className="text-[#404040] text-[7px]">
          Lien chieu, Da Nang....
        </Text>
      </View>
    </View>
  );
}
