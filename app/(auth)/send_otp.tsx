import { Pressable, Text, View } from "react-native";
import PinInput from "../../components/Pin/PinInput";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import ImageCustom from "../../components/Image/Image";
import Logo from "../../components/Image/Logo";
import OTPCountdown from "../../components/Pin/OTPCountdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import Toast from "react-native-toast-message";
const send_otp = () => {
  const [otp, setOtp] = useState("");
  const { send_otp, register } = useAuth();
  const handleResetOTP = async () => {
    const email = AsyncStorage.getItem("email");
    if (email) {
      await send_otp(email);
      Toast.show({
        type: "success",
        text1: "Thông báo",
        text2: "Mã OTP đã được gửi đến email của bạn!",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };
  const handleCompleteRegister = async () => {
    const phone = AsyncStorage.getItem("phone");
    const password = AsyncStorage.getItem("password");
    const email = AsyncStorage.getItem("email");

    try {
      if (phone && password && email && otp) {
        await register!({
          phone: phone,
          password: password,
          email: email,
          code: otp,
        });
        router.push("/login");
        Toast.show({
          type: "success",
          text1: "Thông báo",
          text2: "Bạn đã đăng ký thành công!",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        console.log("error");
      }
    } catch (error: any) {
      console.error(error.response);
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
            Xác minh tài khoản
          </Text>
          <Text className="text-[#9A9898] text-[14px]">
            Chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
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
