import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import React from "react";
import ImageCustom from "../Image/Image";
interface cardProps {
  onPress?: () => void;
}
const SOSCardFilter = ({ onPress }: cardProps) => {
  return (
    <Pressable onPress={onPress} className="w-full">
      <View className="w-full bg-white rounded-[10px] border-gray-200 shadow-md border py-2 px-2 flex flex-row justify-start items-start">
        <View className="flex flex-row gap-5  justify-center items-center">
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=ptFAnHq1YxDk&format=png&color=000000"
            width={70}
            height={70}
          ></ImageCustom>
          <View className="flex flex-col gap-1">
            <Text className="text-[#404040] font-bold text-[12px]">
              Ran out of gas on the highway
            </Text>
            <View className="flex flex-row">
              <Text className="text-[#404040] text-[8px]">Phuong Anh - </Text>
              <Text className="text-[#404040] text-[8px]"> 0914165874</Text>
            </View>
            <View className="flex flex-row">
              <ImageCustom
                width={15}
                height={15}
                source="https://img.icons8.com/?size=100&id=r9lfc22rXPaO&format=png&color=000000"
              ></ImageCustom>
              <Text className="text-[#404040] text-[8px]">
                150 Me Suot, Lien Chieu, Da Nang
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default SOSCardFilter;
