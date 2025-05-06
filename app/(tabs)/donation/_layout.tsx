import { Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="SupportDiary"
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 25,
                fontWeight: "800",
                color: "#404040",
              }}
            >
              Support diary
            </Text>
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="DonationDetail"
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 25,
                fontWeight: "800",
                color: "#559CC3",
              }}
            >
              Event
            </Text>
          ),

          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
