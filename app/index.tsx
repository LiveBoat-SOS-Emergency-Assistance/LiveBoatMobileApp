import { router, Stack } from "expo-router";
import { Image, StatusBar, View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import AuthProvider from "./(auth)/AuthContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

// Giữ splash screen cho đến khi token kiểm tra xong
SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("🔑 Token nhận được:", token);

        if (token) {
          console.log("🔄 Điều hướng đến: /(tabs)/home/index");
          router.replace("/(tabs)/home/");
        } else {
          console.log("🔄 Điều hướng đến: / (Trang Login)");
          router.replace("/");
        }
      } catch (error) {
        console.error("Lỗi khi lấy token:", error);
      } finally {
        // Đảm bảo điều hướng xong mới ẩn splash screen
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
      </Stack>
      <Toast />
    </AuthProvider>
  );
};

export default Layout;
