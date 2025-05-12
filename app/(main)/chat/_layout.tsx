import { Stack } from "expo-router";
import React from "react";
export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "My Inbox" }}
      />
    </Stack>
  );
}
