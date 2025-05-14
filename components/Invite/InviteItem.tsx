import React from "react";
import { View, Text, Pressable } from "react-native";
import ImageCustom from "../Image/Image";

interface InviteItemProps {
  item: {
    id: string;
    Group: {
      name: string;
      description?: string;
    };
  };
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const InviteItem: React.FC<InviteItemProps> = ({
  item,
  onAccept,
  onReject,
}) => {
  return (
    <View className="px-4 py-3 border-b border-gray-200 flex flex-row justify-between items-center">
      <View className="flex flex-col">
        <Text className="text-lg font-bold text-[#404040]">
          {item.Group.name}
        </Text>
        <Text className="text-gray-500">
          {item.Group.description || "No description"}
        </Text>
      </View>
      <View className="flex flex-row gap-2">
        <Pressable onPress={() => onAccept(item.id)}>
          <ImageCustom
            width={20}
            height={20}
            color="#009900"
            source="https://img.icons8.com/?size=100&id=pmwTGmuQrtwg&format=png&color=000000"
          />
        </Pressable>
        <Pressable onPress={() => onReject(item.id)}>
          <ImageCustom
            width={20}
            height={20}
            color="red"
            source="https://img.icons8.com/?size=100&id=84073&format=png&color=000000"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default InviteItem;
