import { Keyboard, SafeAreaView, Text, View } from "react-native";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import Input from "../../components/Input/Input";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import Toast from "react-native-toast-message";
import React from "react";
import { authen } from "../../services/authentication";
import { TouchableWithoutFeedback } from "react-native";
import { Key } from "lucide-react-native";
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
  const handleSendEmail = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError(true);
      setLoading(false);
      return;
    }
    try {
      await authen.reset_send_otp(email);
      await AsyncStorage.setItem("email", email);
      setEmailError(false);
      setLoading(false);
      router.push({
        pathname: "/send_otp",
        params: { type: "forgot_password" },
      });
    } catch (error: any) {
      // console.error(error);
      console.error("Error forget password:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      Toast.show({
        type: "info",
        text1: "Notification",
        text2: "This email is not registered!",
        position: "top",
        visibilityTime: 2000,
      });
      setLoading(false);
      setEmailError(true);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-5 gap-5">
          <View className="flex flex-col gap-3 w-full items-center">
            <Text className="font-bold text-[25px] text-[#404040] w-[90%]">
              Enter the email you used to register
            </Text>
          </View>
          <View className="flex flex-col w-full justify-center items-center gap-2 pt-5">
            <Text className="text-start justify-start w-[90%] font-bold">
              Email
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="text"
              placeholder="Enter your email"
              error={emailError}
            ></Input>
          </View>

          <View className="w-[90%] pt-5 justify-center items-center gap-8">
            <CustomButton
              onPress={handleSendEmail}
              primary={true}
              title="Send SMS"
              isLoading={loading}
            ></CustomButton>
          </View>
          <Text className="text-[#9A9898] text-[14px]">
            We'll send you password reset instructions.
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default forgot_password;
