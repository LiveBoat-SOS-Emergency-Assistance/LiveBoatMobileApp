import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Icon } from "../Icon/Icon";

interface MenuItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  subtitle,
  value,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row justify-between items-center py-5 px-5 border-b border-gray-200"
  >
    <View>
      <Text className="text-base">{title}</Text>
      {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
    </View>

    <View className="flex-row items-center space-x-2 ">
      {value && (
        <Text
          className="text-gray-500 text-sm truncate w-[150px]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      )}
      <Icon path="M9 6L15 12L9 18" />
    </View>
  </TouchableOpacity>
);

export { MenuItem };
