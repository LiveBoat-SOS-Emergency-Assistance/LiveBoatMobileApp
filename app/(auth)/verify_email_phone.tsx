import {
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import CustomButton from "../../components/Button/CustomButton";
import { useState } from "react";
import { router } from "expo-router";
import Input from "../../components/Input/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import React from "react";
import Toast from "react-native-toast-message";
import { TouchableWithoutFeedback } from "react-native";
const verify_email_phone = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const send_otp_auth = useAuth().send_otp;
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSendOTP = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    await AsyncStorage.setItem("email", email);
    try {
      await send_otp_auth!({ email: email.trim() });
      setEmailError(false);
      setLoading(false);
      router.push({
        pathname: "/send_otp",
        params: { type: "register_email" },
      });
    } catch (error: any) {
      console.error(error.response.data.error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: error.response.data.error,
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-white w-full h-full min-h-dvh flex flex-col gap-5  pt-[100px]">
          <View className="w-full justify-center items-center">
            <Image
              source={require("../../assets/images/gg.png")}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View className="flex gap-3 w-[90%] flex-row items-start px-1 pt-10 justify-center pb-5">
            <Text className="font-bold text-[25px] text-[#404040]">
              Enter Email for verification
            </Text>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Input
              error={emailError}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              type="email"
            ></Input>
          </View>
          <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
            <CustomButton
              primary={true}
              isLoading={loading}
              title="Continue"
              onPress={handleSendOTP}
            ></CustomButton>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default verify_email_phone;
