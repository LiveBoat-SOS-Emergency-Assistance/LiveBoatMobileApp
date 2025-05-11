import { Stack } from "expo-router";
import React from "react";
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
    </Stack>
  );
}
