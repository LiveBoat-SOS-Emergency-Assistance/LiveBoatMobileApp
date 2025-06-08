import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";
interface itemSquadProps {
  id: string;
  name: string;
  onPress?: () => void;
  onSelectId?: (id: string) => void;
  member_amount?: number;
}
const ItemSquad = ({
  id,
  name,
  onPress,
  onSelectId,
  member_amount,
}: itemSquadProps) => {
  return (
    <View className=" flex flex-row justify-between w-full items-center">
      <Pressable
        onPress={() => onSelectId?.(id)}
        className="flex flex-row w-full gap-3"
      >
        <View className="flex justify-center items-center bg-gray-200 rounded-full p-2">
          <ImageCustom
            width={35}
            height={35}
            color="#404040"
            source="https://img.icons8.com/?size=100&id=4C2pzaBlIDEO&format=png&color=000000"
          ></ImageCustom>
        </View>
        <View className="flex flex-col gap-1 justify-start w-full">
          <Text className="font-bold text-[#404040] text-[15px] ">{name}</Text>
          <Text>({member_amount} members)</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          onPress?.();
        }}
        style={{ pointerEvents: "auto", width: 30, height: 30 }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=100&id=4511GGVppfIx&format=png&color=000000",
          }}
          width={24}
          height={24}
        ></Image>
      </Pressable>
    </View>
  );
};
export default ItemSquad;
