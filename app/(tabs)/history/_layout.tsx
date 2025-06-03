import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import ImageCustom from "../../../components/Image/Image";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="ProfileSOS"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="DetailSOS"
        options={{
          headerShown: false,
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
}
