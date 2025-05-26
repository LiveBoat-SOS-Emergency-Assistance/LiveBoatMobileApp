import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "";
  const now = dayjs();
  const date = dayjs(dateString);
  if (now.diff(date, "day") === 1) return "Yesterday";
  return date.fromNow();
};

interface ChatProps {
  created_at?: string;
  description?: string;
  group_type?: string;
  id?: string;
  last_message_time?: string;
  name?: string;
  chatId?: number;

  onPress?: () => void;
}
const ChatItem = ({
  onPress,
  name,
  created_at,
  last_message_time,
}: ChatProps) => {
  const [isPressed, setIsPressed] = useState(false);
  // console.log("ChatItem", created_at);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="w-full py-2 flex flex-row gap-3 items-center "
    >
      <View className="w-[50px] h-[50px] bg-[#fbdada] rounded-full flex justify-center items-center">
        <Text className="font-bold text-[#EB4747] text-xl">
          {name?.charAt(0).toUpperCase() || "A"}
        </Text>
      </View>
      <View className="flex flex-col gap-1 w-full">
        <View className="flex flex-row w-[80%] items-center justify-between">
          <Text className="text-[#404040] text-[12px] font-bold">{name}</Text>
          <Text className="text-[10px]">
            {formatTimeAgo(last_message_time) || "1 days ago"}
          </Text>
        </View>
        <Text className="text-[#969696] text-[11px] truncate w-[80%] ">
          Hello, how are you?
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatItem;
