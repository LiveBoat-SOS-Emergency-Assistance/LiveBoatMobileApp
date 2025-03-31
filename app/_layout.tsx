import { Stack } from "expo-router";
import { Image, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import AuthProvider from "./(auth)/AuthContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
          </Stack>
          <Toast />
        </AuthProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
