import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Pressable,
  LogBox,
} from "react-native";
import { FONTS } from "../constants/theme";
import { useRouter } from "expo-router";
import CustomButton from "../components/Button/CustomButton";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseURL } from "../baseUrl";
import * as SplashScreen from "expo-splash-screen";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs();
export default function home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const handleLoginViaGoogle = () => {
    Toast.show({
      type: "info",
      text1: "Login via Google",
      text2: "The feature will coming soon!",
    });
  };

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: true,
  });

  useEffect(() => {
    const loading = async () => {
      SplashScreen.preventAutoHideAsync();
      await getHealthStatus();
      await handleToken();
      SplashScreen.hideAsync();
    };

    loading();
  }, []);

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const getHealthStatus = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken && !isTokenExpired(accessToken)) {
      setIsChecking(false);
      return accessToken;
    }
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken || isTokenExpired(refreshToken)) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setIsChecking(false);
      return null;
    }
    try {
      const response = await axios.post(`${baseURL}/jwt/access-token`, {
        refreshToken,
      });
      // console.log(response.data.accessToken);
      const newAccessToken = response.data?.accessToken;
      await AsyncStorage.setItem("accessToken", newAccessToken);
      setIsChecking(false);
      return newAccessToken;
    } catch (error) {
      console.log("Làm mới token thất bại, đăng xuất.");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      router.replace("/");
      setIsChecking(false);
      return null;
    }
  };
  const handleToken = async () => {
    if (!isChecking) {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/");
      }
    }
  };
  if (isChecking) {
    return null;
  }
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View
        style={tw.style(
          "flex-1 justify-center items-center w-full flex flex-col relative gap-3 bg-white"
        )}
      >
        <View className="absolute top-10 flex flex-col justify-center items-center gap-3">
          <Image
            source={require("../assets/images/imageHomepage.png")}
            style={{ width: 320, height: 350 }}
            className="object-cover "
          ></Image>
          <View
            style={tw.style(
              "w-[80px] h-[80px] bg-[#ed5a5a] rounded-[90px] flex justify-center items-center"
            )}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png",
              }}
              style={{ width: 40, height: 40, tintColor: "#ffffff" }}
            />
          </View>

          <View
            style={tw.style("flex flex-col w-full justify-center items-center")}
          >
            <Text
              className="font-extrabold text-[25px]  text-[#404040]"
              style={{ fontFamily: FONTS.PoppinsBold }}
            >
              Emergency?
            </Text>
            <Text
              className="font-extrabold text-[25px] text-[#404040]"
              style={{ fontFamily: FONTS.PoppinsBold }}
            >
              You are never alone!
            </Text>
          </View>
          <View className="flex flex-col gap-4 w-full justify-center items-center pt-8">
            <CustomButton
              primary={true}
              secondary={false}
              title="Create account"
              onPress={() => router.push("/register")}
            ></CustomButton>
            <Pressable
              onPress={handleLoginViaGoogle}
              className="bg-white py-3 flex items-center w-[100%] rounded-[30px] border-[#d9d9d9] border shadow-md flex-row justify-center gap-3"
            >
              <Image
                source={require("../assets/images/gg.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text className="text-[#404040] font-bold text-[18px]">
                Continue with Google
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="underline text-[#404040]">
                Have an account? Sign in
              </Text>
            </Pressable>
          </View>
        </View>
        <Text className="text-[11px] bottom-2  absolute w-[80%] justify-center flex items-center text-center">
          By proceeding, you agree to our
          <Text className="font-bold"> Term of Use </Text>and confirm you have
          read our
          <Text className="font-bold"> Privacy and Cookie Statement</Text>
        </Text>
      </View>
    </>
  );
}
