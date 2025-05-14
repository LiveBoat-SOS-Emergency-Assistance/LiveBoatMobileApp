import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";

interface ChatProps {
  notification?: {
    type?: string;
    count?: number;
    lastest?: any;
    content?: string;
    created_at?: string;
    title?: string;
  };
  chatId?: number;
  name?: string;
  onPress?: () => void;
  groupId?: number;
}
const ChatItem = ({ notification, onPress, name, groupId }: ChatProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="w-full py-2 flex flex-row gap-3 items-center "
    >
      {notification ? (
        <Avatar
          width={50}
          height={50}
          source="https://img.icons8.com/?size=100&id=FBjASjlt3V58&format=png&color=000000"
        ></Avatar>
      ) : (
        <View className="w-[50px] h-[50px] bg-[#fbdada] rounded-full flex justify-center items-center">
          <Text className="font-bold text-[#EB4747] text-xl">
            {name?.charAt(0).toUpperCase() || "A"}
          </Text>
        </View>
      )}
      <View className="flex flex-col gap-1 w-full">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-[#404040] text-[12px] font-bold">
            {notification?.type || name}
          </Text>
          <Text className="text-[10px]">5 mins ago</Text>
        </View>
        <Text className="text-[#969696] text-[11px] truncate w-[80%] ">
          {notification?.content || "Hello, how are you?"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatItem;
