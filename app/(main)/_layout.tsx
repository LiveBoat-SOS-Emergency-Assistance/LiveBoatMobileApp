import { Stack } from "expo-router";
import React from "react";
export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen name="chat" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="squad" options={{ headerShown: false }} />
    </Stack>
  );
}
