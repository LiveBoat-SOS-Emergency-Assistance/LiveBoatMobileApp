import { Pressable, Text, View } from "react-native";
import PinInput from "../../components/Pin/PinInput";
import CustomButton from "../../components/Button/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import ImageCustom from "../../components/Image/Image";
import Logo from "../../components/Image/Logo";
import OTPCountdown from "../../components/Pin/OTPCountdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Toast from "react-native-toast-message";
import React from "react";

const send_otp = () => {
  const [otp, setOtp] = useState("");
  const { send_otp, register } = useAuth();
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleResetOTP = async () => {
    const email = await AsyncStorage.getItem("email");
    if (email) {
      await send_otp({ email });
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "OTP code has been sent to your email!",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleCompleteRegister = async () => {
    try {
      setLoading(true);
      if (!otp) {
        Toast.show({
          type: "error",
          text1: "Notification",
          text2: "Please enter the OTP code!",
          position: "top",
          visibilityTime: 2000,
        });
        setLoading(false);
        return;
      }
      console.log(type);
      if (type === "register_email") {
        const phone = await AsyncStorage.getItem("phone");
        const password = await AsyncStorage.getItem("password");
        const email = await AsyncStorage.getItem("email");
        console.log(phone, password, email);
        if (phone && password && email) {
          await register({ phone, password, email, code: otp });
          router.push("/login");
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Notification",
            text2: "You have successfully registered!",
            position: "top",
            visibilityTime: 2000,
          });
        }
      } else {
        // Handle other types if needed
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: errorMessage,
      });
    }
  };

  return (
    <>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-2 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
          <Logo />
          <Text className="font-bold text-[25px] text-[#404040]">
            {type === "register_email"
              ? "Verify Account"
              : type === "register_phone"
              ? "Verify Phone Number"
              : "Forgot Password"}
          </Text>
          <Text className="text-[#9A9898] text-[14px]">
            {type === "register_email"
              ? "Enter the OTP code to complete registration."
              : type === "register_phone"
              ? "Enter the OTP code to verify your phone number."
              : "Enter the OTP code to reset your password."}
          </Text>
        </View>
        <View className="w-full">
          <PinInput onComplete={(pin) => setOtp(pin)} />
        </View>
        <View className="w-[90%] pt-10 justify-center items-center gap-8">
          <CustomButton
            onPress={handleCompleteRegister}
            primary={true}
            title="Continue"
          />
          <OTPCountdown />

          <Pressable
            className="flex gap-2 flex-row"
            onPress={() => router.replace("/login")}
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=357&format=png"
              width={20}
              height={20}
              color="#404040"
            />
            <Text className="text-[#404040] text-[12px]">Back to login</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default send_otp;
