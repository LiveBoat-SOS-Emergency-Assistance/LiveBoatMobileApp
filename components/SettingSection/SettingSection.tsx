import { Text, View } from "react-native";
import React from "react";
const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View className="border-b border-gray-200 px-5 py-3">
    <Text className="text-gray-500 font-semibold mb-2">{title}</Text>
    {children}
  </View>
);

export { SettingsSection };
