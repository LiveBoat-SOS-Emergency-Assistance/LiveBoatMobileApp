import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler } from "react-native";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.push("/(tabs)/home"); // Chuyển hướng về trang home
      return true; // Ngăn hành động back mặc định
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="edit_profile"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen name="SmartNotification" options={{ headerShown: false }} />
      <Stack.Screen name="FAQ" options={{ headerShown: false }} />
      <Stack.Screen name="SOSHistory" options={{ headerShown: false }} />
      <Stack.Screen name="ManageGroup" options={{ headerShown: false }} />
      <Stack.Screen name="ShareLocation" options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" options={{ headerShown: false }} />
      <Stack.Screen name="TermOfService" options={{ headerShown: false }} />
    </Stack>
  );
}
