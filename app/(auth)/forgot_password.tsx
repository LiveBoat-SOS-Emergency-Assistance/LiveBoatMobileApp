import { Text, View } from "react-native";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import Input from "../../components/Input/Input";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import Toast from "react-native-toast-message";
import React from "react";
const forgot_password = () => {
  const [loading, setLoading] = useState(false);
  // const [phone, setPhone] = useState("");
  // const [phoneError, setPhoneError] = useState(false);
  // const validatePhoneNumber = (phone: string) => {
  //   const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
  //   return phoneRegex.test(phone);
  // };
  const send_otp_auth = useAuth().send_otp;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSendSMS = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError(true);
      setLoading(false);
      return;
    }
    try {
      await send_otp_auth!({ email: email.trim() });
      await AsyncStorage.setItem("email", email);
      setEmailError(false);
      setLoading(false);
      router.push({
        pathname: "/send_otp",
        params: { type: "forgot_password" },
      });
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "info",
        text1: "Thông báo",
        text2: "Email này chưa được đăng ký!",
        position: "top",
        visibilityTime: 2000,
      });
      setLoading(false);
      setEmailError(true);
    }
  };
  return (
    <>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-5 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
          <Text className="font-bold text-[25px] text-[#404040] w-[90%]">
            Nhập số điện thoại bạn đã sử dụng để đăng ký
          </Text>
        </View>
        <View className="flex flex-col w-full justify-center items-center gap-2 pt-5">
          <Text className="text-start justify-start w-[90%] font-bold">
            Email/Số điện thoại
          </Text>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="number-pad"
            placeholder="Số điện thoại"
            error={emailError}
          ></Input>
        </View>

        <View className="w-[90%] pt-5 justify-center items-center gap-8">
          <CustomButton
            onPress={handleSendSMS}
            primary={true}
            title="Gửi SMS"
            isLoading={loading}
          ></CustomButton>
        </View>
        <Text className="text-[#9A9898] text-[14px]">
          Chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
        </Text>
      </View>
    </>
  );
};
export default forgot_password;
