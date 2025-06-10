import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Pressable,
  LogBox,
  BackHandler,
  Dimensions,
} from "react-native";
import { FONTS } from "../constants/theme";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import CustomButton from "../components/Button/CustomButton";
import tw from "twrnc";
import React, { useCallback, useEffect, useState } from "react";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();
// SplashScreen.setOptions({
//   duration: 2000,
//   fade: true,
// });
LogBox.ignoreAllLogs();
export default function home() {
  const router = useRouter();
  const [isAppReady, setAppReady] = useState(false);
  const handleLoginViaGoogle = () => {
    Toast.show({
      type: "info",
      text1: "Login via Google",
      text2: "The feature will coming soon!",
    });
  };
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
      setAppReady(true);
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  // if (!isAppReady) {
  //   return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
  // }

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      // Block back with gesture or back button on header
      const unsubscribe = navigation.addListener(
        "beforeRemove",
        (e: { preventDefault: () => void }) => {
          e.preventDefault();
        }
      );

      // Block back with Android physical button
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );

      return () => {
        unsubscribe();
        backHandler.remove();
      };
    }, [])
  );

  const screenHeight = Dimensions.get("window").height;

  return !isAppReady ? (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
  ) : (
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
            style={{
              width: "80%",
              height: screenHeight / 3,
              resizeMode: "cover",
            }}
          />
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
