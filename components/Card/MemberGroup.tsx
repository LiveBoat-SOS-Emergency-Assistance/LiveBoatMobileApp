import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ImageCustom from "../Image/Image";
import Avatar from "../Image/Avatar";
import { useAuth } from "../../context/AuthContext";

interface memberProps {
  data: any;
  handleDel?: () => void;
  handleLeave?: () => void;
}
const MemberGroup = ({ data, handleLeave, handleDel }: memberProps) => {
  const displayName =
    data.User.UserProfile.name === "Chưa điền"
      ? "Unknown name"
      : data.User.UserProfile.name || "No name";

  const { profile } = useAuth();
  return (
    <View className="flex flex-row gap-2 justify-between items-center w-full py-1 bg-white cursor-pointer">
      <View className="flex flex-row justify-center items-center gap-4">
        <Avatar source={data.User.avatar_url} width={50} height={50}></Avatar>
        <Text className="text-[#404040] font-bold">{displayName}</Text>
      </View>

      {data.User.id !== profile?.user_id && data.role === "MEMBER" && (
        <TouchableOpacity onPress={handleDel} className="cursor-pointer">
          <ImageCustom
            width={18}
            height={18}
            source="https://img.icons8.com/?size=100&id=99950&format=png&color=000000"
          ></ImageCustom>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default MemberGroup;
