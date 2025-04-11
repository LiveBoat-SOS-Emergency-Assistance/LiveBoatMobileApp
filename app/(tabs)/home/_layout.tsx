import { Stack } from "expo-router";
import React from "react";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sos_alert" options={{ headerShown: false }} />
      <Stack.Screen name="sos_map" options={{ headerShown: false }} />
      <Stack.Screen
        name="sos_diable"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="add_group"
        options={{ headerShown: true, title: "" }}
      />
    </Stack>
  );
}
