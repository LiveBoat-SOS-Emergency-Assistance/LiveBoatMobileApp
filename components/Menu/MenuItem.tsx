import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Icon } from "../Icon/Icon";

const MenuItem: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <TouchableOpacity className="flex-row justify-between py-5 px-5 border-b border-gray-200">
    <View>
      <Text className="text-base">{title}</Text>
      {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
    </View>
    <Icon path="M9 6L15 12L9 18" />
  </TouchableOpacity>
);
export { MenuItem };
