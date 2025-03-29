import { Image, Pressable, Text, View } from "react-native";
import CustomButton from "../../components/Button/CustomButton";
import { useState } from "react";
import { router } from "expo-router";

const verify_account = () => {
  const [isMethod, setIsMethod] = useState("email");
  const handleVerify = () => {
    if (isMethod === "phone") {
      console.log("phone");
    } else {
      router.replace("/verify_email_phone");
    }
  };
  return (
    <View className="bg-white w-full h-full min-h-dvh flex flex-col gap-[50px]">
      <View className="flex gap-3 w-full flex-row items-start px-1 pt-10 justify-center pb-5">
        <Text className="font-bold text-[25px] text-[#404040]">
          Xác minh tài khoản
        </Text>
      </View>
      <View className="w-full flex flex-col justify-center items-center gap-[60px]">
        <Pressable
          onPress={() => setIsMethod("phone")}
          className={`w-[90%] flex flex-col rounded-[10px] justify-center items-center border ${
            isMethod === "phone" ? "border-[#5698BC]" : "border-[#d9d9d9]/70"
          } py-5 gap-3 shadow-lg bg-white`}
        >
          <Image
            source={require("../../assets/images/phone.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text
            className={`font-bold ${
              isMethod === "phone" ? "text-[#5698BC]" : "text-[#404040]"
            }`}
          >
            Xác minh tài khoản qua số điện thoại
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setIsMethod("email")}
          className={`w-[90%] flex flex-col rounded-[10px] justify-center items-center border ${
            isMethod === "email" ? "border-[#5698BC]" : "border-[#d9d9d9]/70"
          } py-5 gap-3 shadow-lg bg-white`}
        >
          <Image
            source={require("../../assets/images/gg.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text
            className={`font-bold ${
              isMethod === "email" ? "text-[#5698BC]" : "text-[#404040]"
            }`}
          >
            Xác minh tài khoản qua Email
          </Text>
        </Pressable>
        <View className="w-[90%] flex justify-center items-center">
          <CustomButton
            third={true}
            title="Tiếp tục"
            onPress={handleVerify}
            // onPress={() => console.log("hi")}
          ></CustomButton>
        </View>
      </View>
    </View>
  );
};
export default verify_account;
