import {
  Pressable,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from "react-native";
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
import Input from "../../components/Input/Input"; // ✅ Import Input component
import React from "react";
import { authen } from "../../services/authentication";
import { TouchableWithoutFeedback } from "react-native";

const send_otp = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ✅ State cho password mới
  const [passwordError, setPasswordError] = useState(false);
  const { send_otp, register, reset_password } = useAuth(); // ✅ Thêm reset_password function
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
  // ✅ Validate password
  const validatePasswords = () => {
    let isValid = true;

    if (type === "forgot_password") {
      if (!newPassword || newPassword.length < 6) {
        setPasswordError(true);
        Toast.show({
          type: "error",
          text1: "Invalid Password",
          text2: "Password must be at least 6 characters",
          position: "top",
          visibilityTime: 2000,
        });
        isValid = false;
      }
    }

    return isValid;
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

      // ✅ Validate passwords cho forgot_password
      if (type === "forgot_password" && !validatePasswords()) {
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
      } else if (type === "forgot_password") {
        const email = await AsyncStorage.getItem("email");

        if (email) {
          const result = await authen.verify_otp({
            email,
            code: otp,
            newPassword: newPassword,
          });
          if (result) {
            console.log("Reset password result:", result.data);

            router.push("/login");
            setLoading(false);
            Toast.show({
              type: "success",
              text1: "Password Reset Complete!",
              text2:
                "Your password has been reset successfully. Please login with your new password.",
              position: "top",
              visibilityTime: 3000,
            });
          }
          try {
          } catch (error: any) {
            console.error("Error in reset password:", error);
            setLoading(false);
          }
        }
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1 bg-white"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex flex-col bg-white w-full min-h-full items-center py-2 gap-5">
              <View className="flex flex-col gap-3 w-full items-center">
                <Logo />
                <Text className="font-bold text-[25px] text-[#404040]">
                  {type === "register_email"
                    ? "Verify Account"
                    : type === "register_phone"
                    ? "Verify Phone Number"
                    : "Reset Password"}
                </Text>
                <Text className="text-[#9A9898] text-[14px] text-center w-[80%]">
                  {type === "register_email"
                    ? "Enter the OTP code to complete registration."
                    : type === "register_phone"
                    ? "Enter the OTP code to verify your phone number."
                    : "Enter the OTP code and your new password to reset your password."}
                </Text>
              </View>
              <View className="w-full">
                <PinInput onComplete={(pin) => setOtp(pin)} />
              </View>
              {/* ✅ Thêm input password cho forgot_password */}
              {type === "forgot_password" && (
                <View className="flex flex-col w-full justify-center items-center gap-4">
                  <View className="flex flex-col w-full justify-center items-center gap-2">
                    <Text className="text-start justify-start w-[90%] font-bold">
                      New Password
                    </Text>
                    <Input
                      type="password"
                      value={newPassword}
                      onChangeText={(text) => {
                        setNewPassword(text);
                        if (passwordError) setPasswordError(false);
                      }}
                      keyboardType="default"
                      placeholder="Enter new password"
                      error={passwordError}
                    />
                  </View>
                </View>
              )}
              <View className="w-[90%] pt-5 justify-center items-center gap-8">
                <CustomButton
                  onPress={handleCompleteRegister}
                  primary={true}
                  title={
                    type === "forgot_password" ? "Reset Password" : "Continue"
                  }
                  isLoading={loading}
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
                  <Text className="text-[#404040] text-[12px]">
                    Back to login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default send_otp;
