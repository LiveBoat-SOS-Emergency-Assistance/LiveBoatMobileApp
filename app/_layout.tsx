import { Stack } from "expo-router";
import { StatusBar } from "react-native";
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
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="(auth)/forgot_password"
          options={{ headerShown: true, title: "" }}
        />
      </Stack>
      <Toast></Toast>
    </>
  );
};

export default RootLayout;
