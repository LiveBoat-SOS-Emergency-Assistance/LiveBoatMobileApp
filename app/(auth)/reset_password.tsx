import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import ImageCustom from "../../components/Image/Image";
const Login = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const validatePassword = (password: string) => {
    if (password.length < 10) {
      return "Mật khẩu phải có ít nhất 10 ký tự.";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái.";
    }
    if (!/\d/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một số.";
    }
    if (!/[@$!%*?&]/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&).";
    }
    return "";
  };
  const handleResetPassword = () => {
    setLoading(true);
    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      setLoading(false);
      return;
    }
    setPasswordError("");
    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }
    setConfirmPasswordError("");
    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Thay đổi mật khẩu thành công!",
      position: "top",
      visibilityTime: 2000,
    });
    setLoading(false);
  };
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View className="bg-white w-full h-full flex flex-col pt-10 relative">
        <View className="flex gap-3 w-full flex-col items-center px-2  justify-center pb-5">
          <Text className="font-bold text-[25px] text-[#404040]">
            Thiết lập mật khẩu mới
          </Text>
          <Text className="text-[#9A9898] text-[14px]">
            Chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
          </Text>
        </View>

        <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Mật khẩu
            </Text>
            <Input
              value={password}
              errorPassword={passwordError}
              onChangeText={setPassword}
              type="password"
              placeholder="Mật khẩu"
            ></Input>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Xác nhận mật khẩu
            </Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              errorPassword={confirmPasswordError}
              type="password"
              placeholder="Mật khẩu"
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
            <Text className="text-[12px]">Ít nhất 10 ký tự</Text>
          </View>
          <View className="flex flex-row gap-2 text-start justify-start w-[90%] items-center">
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=21083&format=png&color=000000",
              }}
              style={{ width: 15, height: 15 }}
            ></Image>
            <Text className="text-[12px]">
              Mật khẩu phải chứa số, chữ cái và ký tự đặc biệt
            </Text>
          </View>
        </View>
        <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
          <CustomButton
            primary={true}
            secondary={false}
            isLoading={loading}
            title="Đặt lại mật khẩu"
            onPress={handleResetPassword}
          ></CustomButton>
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
export default Login;
