import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";

interface ChatProps {
  notification: {
    type?: string;
    count?: number;
    lastest?: any;
    content?: string;
    created_at?: string;
    title?: string;
  };
}
const ChatItem = ({ notification }: ChatProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        backgroundColor: isPressed ? "opacity" : "transparent",
      }}
      className="w-full py-2 flex flex-row gap-3 items-center "
    >
      <Avatar
        width={50}
        height={50}
        source="https://img.icons8.com/?size=100&id=FBjASjlt3V58&format=png&color=000000"
      ></Avatar>
      <View className="flex flex-col gap-1 ">
        <Text className="text-[#404040] text-[10px] font-bold">
          {notification.type}
        </Text>

        <Text className="text-[#969696] text-[11px] truncate w-[80%] ">
          {notification.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatItem;
