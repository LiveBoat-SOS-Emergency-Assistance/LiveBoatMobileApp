import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";

const DonationItem = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`flex flex-row w-full px-6 py-2 justify-between items-center ${
        isPressed ? "bg-gray-50" : ""
      }`}
    >
      <View className="flex flex-row gap-2 items-center ">
        <Avatar
          source={require("../../assets/images/ava4.png")}
          width={40}
          height={40}
        ></Avatar>
        <View className="flex flex-col gap-1">
          <Text className="text-[#404040] text-[12px]">Phuong Anh</Text>
          <Text className="text-[#404040] opacity-50 text-[9px] italic">
            Time: 16:00 16-03-2025
          </Text>
        </View>
      </View>
      <Text className="text-[#404040] text-[12px] font-bold">+100.000VND</Text>
    </TouchableOpacity>
  );
};
export default DonationItem;
