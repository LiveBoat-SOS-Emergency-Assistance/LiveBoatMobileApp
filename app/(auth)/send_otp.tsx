import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import PinInput from "../../components/Pin/PinInput";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import ImageCustom from "../../components/Image/Image";
import Logo from "../../components/Image/Logo";
import OTPCountdown from "../../components/Pin/OTPCountdown";
const send_otp = () => {
  return (
    <>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-2 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
          <Logo></Logo>
          <Text className="font-bold text-[25px] text-[#404040]">
            Xác minh tài khoản
          </Text>
          <Text className="text-[#9A9898] text-[14px]">
            Chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
          </Text>
        </View>
        <View className="w-full">
          <PinInput
            onComplete={(pin) => console.log("Mã PIN nhập:", pin)}
          ></PinInput>
        </View>
        <View className="w-[90%] pt-10 justify-center items-center gap-8">
          <CustomButton
            onPress={() => router.push("/reset_password")}
            primary={true}
            title="Tiếp tục"
          ></CustomButton>
          <OTPCountdown></OTPCountdown>

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
export default send_otp;
