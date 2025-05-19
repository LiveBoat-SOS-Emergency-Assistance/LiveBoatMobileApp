import { Stack } from "expo-router";
import React from "react";
import ImageCustom from "../../../components/Image/Image";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SOSAlert" options={{ headerShown: false }} />
      <Stack.Screen name="SOSMap" options={{ headerShown: false }} />
      <Stack.Screen
        name="SOSDisable"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="PreLive" options={{ headerShown: false }} />
      <Stack.Screen
        name="GroupChat"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          // headerTitle: () => (
          //   <ImageCustom
          //     source="https://img.icons8.com/?size=100&id=fJXFbcW0WrW9&format=png&color=000000"
          //     width={50}
          //     height={50}
          //     color="#fff"
          //   />
          // ),
          headerStyle: { backgroundColor: "#f87171" },
        }}
      />
    </Stack>
  );
}
