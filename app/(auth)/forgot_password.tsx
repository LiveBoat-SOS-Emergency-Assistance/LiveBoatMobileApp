import { Text, View } from "react-native";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
import Input from "../../components/Input/Input";
import { useState } from "react";
const forgot_password = () => {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [loading, setLoading] = useState(false);
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    return phoneRegex.test(phone);
  };
  const handleSendSMS = () => {
    setLoading(true);
    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      setLoading(false);
      return;
    }
    setPhoneError(false);
    setLoading(false);
    router.push("/send_otp");
  };
  return (
    <>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-5 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
          <Text className="font-bold text-[25px] text-[#404040] w-[90%]">
            Nhập số điện thoại bạn đã sử dụng để đăng ký
          </Text>
        </View>
        <View className="flex flex-col w-full justify-center items-center gap-2 pt-5">
          <Text className="text-start justify-start w-[90%] font-bold">
            Số điện thoại
          </Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Số điện thoại"
            error={phoneError}
          ></Input>
        </View>

        <View className="w-[90%] pt-5 justify-center items-center gap-8">
          <CustomButton
            onPress={handleSendSMS}
            primary={true}
            title="Gửi SMS"
            isLoading={loading}
          ></CustomButton>
        </View>
        <Text className="text-[#9A9898] text-[14px]">
          Chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
        </Text>
      </View>
    </>
  );
};
export default forgot_password;
