import { Stack } from "expo-router";
import { Image, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import AuthProvider from "../context/AuthContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const Layout = () => {
  return (
    <AuthProvider>
      <StatusBar hidden={false} barStyle={"dark-content"} />
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#fff" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ title: "" }} />
        {/* <Stack.Screen name="(main)" />
        <Stack.Screen name="(main)/chat/chatbot" /> */}
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="(auth)/verify_account"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="(auth)/send_otp"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="(auth)/forgot_password"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="(auth)/change_password"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Image
                source={require("../assets/images/liveboat.png")}
                style={{ marginRight: 0 }}
              />
            ),
          }}
        />
      </Stack>
      <Toast />
    </AuthProvider>
  );
};

export default Layout;
