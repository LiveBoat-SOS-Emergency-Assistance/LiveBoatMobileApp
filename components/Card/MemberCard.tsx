import { Text, Touchable, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "../Image/Avatar";
import { m } from "framer-motion";
interface cardProps {
  active?: boolean;
  member?: any;
  id?: string;
  name?: string;
  avatar?: string;
}
const MemberCard = ({ active, avatar, member }: cardProps) => {
  return (
    <TouchableOpacity
      className={`w-full  rounded-[10px] flex flex-row gap-3 h-[80px] items-center px-5 ${
        active ? "bg-white" : "bg-transparent  border-white border-[2px]"
      }`}
      style={{
        shadowColor: active ? "#000" : "transparent",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
      activeOpacity={0.9}
    >
      <Avatar source={avatar} width={50} height={50}></Avatar>
      <View className="flex flex-col gap-2">
        <Text className="font-bold text-[#404040] text-[10px]">
          {member?.User?.UserProfile?.name || "Unknown User"}
        </Text>
        <Text className=" text-[#404040] text-[9px]">
          {member?.User.UserProfile?.address || "Unknown Email"}
        </Text>
        <View className="flex flex-row gap-2">
          <View className="w-[22px] h-[11px] border-[#404040] border rounded-[3px]"></View>
          <Text className=" text-[#404040] text-[9px]">31</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default MemberCard;
