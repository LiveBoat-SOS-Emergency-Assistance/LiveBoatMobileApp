import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";
const ChatItem = () => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        backgroundColor: isPressed ? "#f0f0f0" : "transparent",
      }}
      className="w-full py-2  flex flex-row gap-3"
    >
      <Avatar width={50} height={50}></Avatar>
      <View className="flex flex-col gap-2">
        <Text className="text-[#404040] text-[10px] font-bold">Phuong Anh</Text>
        <Text className="text-[#969696] text-[13px]">
          The system: message from system
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatItem;
