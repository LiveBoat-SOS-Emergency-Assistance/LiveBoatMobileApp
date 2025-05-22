import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ChatProps {
  notification?: {
    id?: string;

    content?: string;
    created_at?: string;
    title?: string;
    type?: string;
    extra_data: {};
  };
  created_at?: string;
  id?: string;
  is_read?: boolean;
  notification_id?: string;
  user_id?: string;
  onPress?: () => void;
  groupId?: number;
}

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "";
  const now = dayjs();
  const date = dayjs(dateString);
  if (now.diff(date, "day") === 1) return "Yesterday";
  return date.fromNow();
};

const SystemItem = ({
  notification,
  onPress,
  groupId,
  is_read,
  created_at,
}: ChatProps) => {
  const [isPressed, setIsPressed] = useState(false);
  //   console.log("SystemItem", is_read);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`w-full py-4  flex flex-row gap-3 border border-b-[1px] border-gray-100 items-center px-2 bg-white  ${
        is_read ? "bg-white" : "bg-gray-50"
      } `}
      //   style={{
      //     shadowColor: "#000",
      //     shadowOffset: { width: 0, height: 4 },
      //     shadowOpacity: 0.3,
      //     shadowRadius: 4,
      //     elevation: 5,
      //   }}
    >
      <Avatar
        width={50}
        height={50}
        source="https://img.icons8.com/?size=100&id=FBjASjlt3V58&format=png&color=000000"
      ></Avatar>
      <View className="flex flex-col gap-2 w-full">
        <View className="flex flex-row items-center justify-between w-[80%]">
          <Text className="text-[#404040] text-[12px] font-bold">
            {notification?.title || "System Notification"}
          </Text>
          <Text className="text-[10px]">
            {formatTimeAgo(notification?.created_at || created_at)}
          </Text>
        </View>
        <Text className="text-[#969696] text-[11px] truncate w-[80%] ">
          {notification?.content ||
            "Please check their location and respond ASAP."}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default SystemItem;
