import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit_profile" options={{ headerShown: false }} />
      <Stack.Screen name="SmartNotification" options={{ headerShown: false }} />
    </Stack>
  );
}
