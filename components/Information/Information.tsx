import { Text, View } from "react-native";
import React from "react";
import ImageCustom from "../Image/Image";
interface inforProps {
  title?: string;
  icon?: string;
  content?: string;
}
const Information = ({ icon, title, content }: inforProps) => {
  return (
    <View className="flex flex-row gap-2">
      <ImageCustom
        source={icon}
        width={27}
        height={27}
        color="#404040"
      ></ImageCustom>
      <View className="flex flex-col">
        <Text className="text-[#404040] opacity-60 text-[9px]">{title}</Text>
        <Text className="text-[#404040] text-[12px]">{content}</Text>
      </View>
    </View>
  );
};
export default Information;
