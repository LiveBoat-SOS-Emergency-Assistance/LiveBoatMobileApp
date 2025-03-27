import { View } from "lucide-react-native";
import { Image, Text } from "react-native";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const verify_email = () => {
  const [email, setEmail] = useState("");
  // const { send_otp } = useAuth();
  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // };
  // const handleVerfiy = async () => {
  //   if (!validateEmail(email)) {
  //     return;
  //   }
  //   try {
  //     await send_otp!({ email: email.trim() });
  //   } catch (error: any) {
  //     console.error(error.response);
  //   }
  //   AsyncStorage.setItem("email", email);
  //   router.push("send_otp");
  // };
  return (
    <View className="w-full min-h-dvh flex flex-col justify-center items-center h-full bg-white">
      <Image
        source={require("../../assets/images/gg.png")}
        style={{ width: 80, height: 80 }}
      />
      <Text className="text-bold text-[#404040] text-[23px]">
        Nhập email để xác minh
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        type="text"
      ></Input>
      <CustomButton
        // onPress={handleVerfiy}
        title="Tiếp tục"
        primary={true}
      ></CustomButton>
    </View>
  );
};
export default verify_email;
