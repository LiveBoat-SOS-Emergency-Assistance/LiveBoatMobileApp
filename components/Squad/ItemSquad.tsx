import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import Avatar from "../Image/Avatar";
interface itemSquadProps {
  id: string;
  name: string;
  onPress?: () => void;
  onSelectId?: (id: string) => void;
}
const ItemSquad = ({ id, name, onPress, onSelectId }: itemSquadProps) => {
  return (
    <View className=" flex flex-row justify-between w-full items-center">
      <Pressable
        onPress={() => onSelectId?.(id)}
        className="flex flex-row w-full gap-3"
      >
        <Avatar
          width={50}
          height={50}
          source="https://img.icons8.com/?size=100&id=114422&format=png&color=000000"
        ></Avatar>
        <View className="flex flex-col gap-1 justify-start w-full">
          <Text className="font-bold text-[#404040] text-[15px] ">{name}</Text>
          <Text>(2 members)</Text>
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
