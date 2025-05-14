import { Stack, useSegments } from "expo-router";
import { Image, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import AuthProvider from "../context/AuthContext";
import React from "react";
import { SCREENS } from "../constants/screens";
import { SocketProvider } from "../context/SocketContext";
const Layout = () => {
  const isChatScreen = useSegments().includes("(main)/chat/ChatBox");

  return (
    <AuthProvider>
      {!isChatScreen ? (
        <SocketProvider>
          <StatusBar hidden={false} barStyle={"dark-content"} />
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#fff" },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name={SCREENS.INDEX.name}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.TABS.name}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.MAIN.name}
              options={{ title: SCREENS.MAIN.title, headerShown: false }}
            />

            <Stack.Screen
              name={SCREENS.LOGIN.name}
              options={{
                headerShown: true,
                title: SCREENS.LOGIN.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.REGISTER.name}
              options={{
                headerShown: true,
                title: SCREENS.REGISTER.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.VERIFY_ACCOUNT.name}
              options={{
                headerShown: true,
                title: SCREENS.VERIFY_ACCOUNT.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.SEND_OTP.name}
              options={{
                headerShown: true,
                title: SCREENS.SEND_OTP.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />

            <Stack.Screen
              name={SCREENS.FORGOT_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.FORGOT_PASSWORD.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />

            <Stack.Screen
              name={SCREENS.CHANGE_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.CHANGE_PASSWORD.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.VERIFY_EMAIL_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.VERIFY_EMAIL_PASSWORD.title,
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
        </SocketProvider>
      ) : (
        <>
          <StatusBar hidden={false} barStyle={"dark-content"} />
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#fff" },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name={SCREENS.INDEX.name}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.TABS.name}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.MAIN.name}
              options={{ title: SCREENS.MAIN.title, headerShown: false }}
            />

            <Stack.Screen
              name={SCREENS.LOGIN.name}
              options={{
                headerShown: true,
                title: SCREENS.LOGIN.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.REGISTER.name}
              options={{
                headerShown: true,
                title: SCREENS.REGISTER.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.VERIFY_ACCOUNT.name}
              options={{
                headerShown: true,
                title: SCREENS.VERIFY_ACCOUNT.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.SEND_OTP.name}
              options={{
                headerShown: true,
                title: SCREENS.SEND_OTP.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />

            <Stack.Screen
              name={SCREENS.FORGOT_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.FORGOT_PASSWORD.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            {/* <Stack.Screen
            name="(main)"
            options={{
              headerShown: false,
              title: "",
              headerShadowVisible: false,
            }}
          /> */}
            <Stack.Screen
              name={SCREENS.CHANGE_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.CHANGE_PASSWORD.title,
                headerRight: () => (
                  <Image
                    source={require("../assets/images/liveboat.png")}
                    style={{ marginRight: 0 }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name={SCREENS.VERIFY_EMAIL_PASSWORD.name}
              options={{
                headerShown: true,
                title: SCREENS.VERIFY_EMAIL_PASSWORD.title,
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
        </>
      )}
    </AuthProvider>
  );
};

export default Layout;
