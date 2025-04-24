import { Pressable, Text, View } from "react-native";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import React from "react";
import { Keyboard } from "react-native";
const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    return phoneRegex.test(phone);
  };
  const handleLogin = async () => {
    setLoading(true);
    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      setLoading(false);
      return;
    }
    setPhoneError(false);
    if (!password) {
      setPasswordError("Please enter your password");
      setLoading(false);
      return;
    }
    setPasswordError("");
    try {
      await login!({ phone: phone, password: password });
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "Login successful!",
        position: "top",
        visibilityTime: 2000,
      });
      Keyboard.dismiss();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: "Invalid account or password!",
        position: "top",
        visibilityTime: 2000,
      });
      setLoading(false);
      console.log(phone, password);
    }
  };
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View className="bg-white w-full h-full flex flex-col pt-10 relative">
        <View className="flex gap-3 w-full flex-row items-center px-2  justify-center pb-5">
          <Text className="font-bold text-[25px] text-[#404040]">
            Hello, welcome back!
          </Text>
        </View>

        <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Phone Number
            </Text>
            <Input
              error={phoneError}
              value={phone}
              onChangeText={setPhone}
              type="phone"
              keyboardType="number-pad"
              placeholder="Phone Number"
            ></Input>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Password
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              type="password"
              errorPassword={passwordError}
              placeholder="Password"
            ></Input>
          </View>
        </View>
        <Pressable
          // onPress={handleForgotPassword}
          onPress={() => router.push("/forgot_password")}
          className="w-full justify-center  flex items-center pt-10"
        >
          <Text className="font-bold underline w-[90%] ">Forgot password?</Text>
        </Pressable>
        <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
          <CustomButton
            primary={true}
            secondary={false}
            isLoading={loading}
            title="Login"
            onPress={handleLogin}
          ></CustomButton>
          <CustomButton
            primary={false}
            secondary={true}
            title="Register"
            onPress={() => router.replace("/register")}
          ></CustomButton>
        </View>
      </View>
    </>
  );
};
export default Login;
