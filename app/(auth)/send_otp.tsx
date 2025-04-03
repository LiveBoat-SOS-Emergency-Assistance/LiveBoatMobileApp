import { Pressable, Text, View } from "react-native";
import PinInput from "../../components/Pin/PinInput";
import CustomButton from "../../components/Button/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import ImageCustom from "../../components/Image/Image";
import Logo from "../../components/Image/Logo";
import OTPCountdown from "../../components/Pin/OTPCountdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import Toast from "react-native-toast-message";
import React from "react";
const send_otp = () => {
  const [otp, setOtp] = useState("");
  const { send_otp, register } = useAuth();
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const handleResetOTP = async () => {
    if (type === "register_email") {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        await send_otp({ email });
        Toast.show({
          type: "success",
          text1: "Thông báo",
          text2: "Mã OTP đã được gửi đến email của bạn!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    } else if (type === "forgot_password") {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        await send_otp({ email });
        Toast.show({
          type: "success",
          text1: "Thông báo",
          text2: "Mã OTP đã được gửi đến email của bạn!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    }
  };
  const handleCompleteRegister = async () => {
    try {
      setLoading(true);
      if (!otp) {
        Toast.show({
          type: "error",
          text1: "Thông báo",
          text2: "Vui lòng nhập mã OTP!",
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
            text1: "Thông báo",
            text2: "Bạn đã đăng ký thành công!",
            position: "top",
            visibilityTime: 2000,
          });
        }
      }else{
        
      }
    } catch (error: any) {
      console.error(error.response);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Thông báo",
        text2: "Mã OTP không hợp lệ!",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };
  return (
    <>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-2 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
          <Logo></Logo>
          <Text className="font-bold text-[25px] text-[#404040]">
            {type === "register_email"
              ? "Xác minh tài khoản"
              : type === "register_phone"
              ? "Xác minh số điện thoại"
              : "Quên mật khẩu"}
          </Text>
          <Text className="text-[#9A9898] text-[14px]">
            {type === "register_email"
              ? "Nhập mã OTP để hoàn tất đăng ký."
              : type === "register_phone"
              ? "Nhập mã OTP để xác minh số điện thoại của bạn."
              : "Nhập mã OTP để đặt lại mật khẩu."}
          </Text>
        </View>
        <View className="w-full">
          <PinInput onComplete={(pin) => setOtp(pin)}></PinInput>
        </View>
        <View className="w-[90%] pt-10 justify-center items-center gap-8">
          <CustomButton
            onPress={handleCompleteRegister}
            primary={true}
            title="Tiếp tục"
          ></CustomButton>
          <OTPCountdown></OTPCountdown>

          <Pressable
            className="flex gap-2 flex-row"
            onPress={() => router.replace("/login")}
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=357&format=png"
              width={20}
              height={20}
              color="#404040"
            ></ImageCustom>
            <Text className="text-[#404040] text-[12px]">
              Quay lại đăng nhập
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
export default send_otp;
