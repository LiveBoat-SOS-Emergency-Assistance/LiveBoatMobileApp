import { Stack } from "expo-router";
import { Image, StatusBar } from "react-native";
import Toast from "react-native-toast-message";

const RootLayout = () => {
  return (
    <>
      <StatusBar hidden={false} barStyle={"dark-content"}></StatusBar>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#fff" },
          headerShadowVisible: false,
        }}
      >
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
          name="(auth)/forgot_password"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="(auth)/send_otp"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="(auth)/reset_password"
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
      </Stack>

      <Toast></Toast>
    </>
  );
};

export default RootLayout;
