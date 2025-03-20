import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleLogin = () => {
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError(true);
      setLoading(false);
      return;
    }
    Toast.show({
      type: "error",
      text1: "Thông báo",
      text2: "Tài khoản hoặc mật khẩu không hợp lệ!",
      position: "top",
      visibilityTime: 2000,
    });
    setLoading(false);
    console.log(email, password);
  };
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View className="bg-white w-full h-full flex flex-col pt-10 relative">
        <View className="flex gap-3 w-full flex-row items-center px-2  justify-center pb-5">
          <View
            style={tw.style(
              "w-[60px] h-[60px] bg-[#ed5a5a] rounded-[90px] flex justify-center items-center"
            )}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png",
              }}
              style={{ width: 30, height: 30, tintColor: "#ffffff" }}
            />
          </View>
          <Text className="font-bold text-[25px] text-[#404040]">
            Chào bạn, mừng bạn trở lại!
          </Text>
        </View>

        <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Email
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              error={emailError}
              type="email"
              placeholder="Email"
            ></Input>
          </View>
          <View className="flex flex-col justify-center items-center w-full gap-2">
            <Text className="text-start justify-start w-[90%] font-bold">
              Mật khẩu
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              type="password"
              placeholder="Mật khẩu"
            ></Input>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/forgot_password")}
          className="w-full justify-center flex items-center pt-10"
        >
          <Text className="font-bold underline w-[90%] ">Quên mật khẩu?</Text>
        </Pressable>
        <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
          <CustomButton
            primary={true}
            secondary={false}
            isLoading={loading}
            title="Đăng nhập"
            onPress={handleLogin}
          ></CustomButton>
          <CustomButton
            primary={false}
            secondary={true}
            title="Đăng ký"
            onPress={() => router.replace("/register")}
          ></CustomButton>
        </View>
      </View>
    </>
  );
};
export default Login;
