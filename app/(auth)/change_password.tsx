import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import ImageCustom from "../../components/Image/Image";
import React from "react";
import { useAuth } from "../../context/AuthContext";
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { change_password } = useAuth();
  const [loading, setLoading] = useState(false);
  const validatePassword = (password: string) => {
    if (password.length < 10) {
      return "Password must be at least 10 characters.";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[@$!%*?&]/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&).";
    }
    return "";
  };
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if (!oldPassword) {
        setOldPasswordError("Please enter your old password");
        setLoading(false);
        return;
      }
      if (validatePassword(password)) {
        setPasswordError(validatePassword(password));
        setLoading(false);
        return;
      }
      setPasswordError("");
      if (password !== confirmPassword) {
        setConfirmPasswordError("Confirm password does not match");
        setLoading(false);
        return;
      }
      setConfirmPasswordError("");
      await change_password!({
        oldPassword: oldPassword,
        newPassword: password,
      });
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "Password changed successfully!",
        position: "top",
        visibilityTime: 2000,
      });
      router.replace("/(main)/profile");
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: "Old password is not correct!",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View className="bg-white w-full h-full flex flex-col pt-10 relative">
        <View className="flex gap-3 w-full flex-col items-center px-2  justify-center pb-5">
          <Text className="font-bold text-[25px] text-[#404040]">
            Set a new password
          </Text>
        </View>

        <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Old password
            </Text>
            <Input
              value={oldPassword}
              errorPassword={oldPasswordError}
              onChangeText={setOldPassword}
              type="password"
              placeholder="Old Password"
            ></Input>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              New password
            </Text>
            <Input
              value={password}
              errorPassword={passwordError}
              onChangeText={setPassword}
              type="password"
              placeholder="New Password"
            ></Input>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Confirm Password
            </Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              errorPassword={confirmPasswordError}
              type="password"
              placeholder="Confirm Password"
            ></Input>
          </View>
        </View>
        <View className="flex flex-col gap-3 justify-center items-center w-full pt-6">
          <View className="flex flex-row gap-2 text-start justify-start w-[90%] items-center">
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=21083&format=png&color=000000",
              }}
              style={{ width: 15, height: 15 }}
            ></Image>
            <Text className="text-[12px]">At least 10 characters</Text>
          </View>
          <View className="flex flex-row gap-2 text-start justify-start w-[90%] items-center">
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=21083&format=png&color=000000",
              }}
              style={{ width: 15, height: 15 }}
            ></Image>
            <Text className="text-[12px] w-[90%]">
              Password must contain a number, a letter, and a special character
            </Text>
          </View>
        </View>
        <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
          <CustomButton
            primary={true}
            secondary={false}
            isLoading={loading}
            title="Change Password"
            onPress={handleChangePassword}
          ></CustomButton>
        </View>
      </View>
    </>
  );
};
export default ChangePassword;
