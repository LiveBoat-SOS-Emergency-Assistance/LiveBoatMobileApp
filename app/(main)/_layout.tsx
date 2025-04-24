import { Stack } from "expo-router";
import React from "react";
export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="squad" options={{ headerShown: false }} />
    </Stack>
  );
}
