import { Image, Text, TouchableOpacity, View } from "react-native";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // };
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    return phoneRegex.test(phone);
  };

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

  const handleRegister = () => {
    // setLoading(true);
    // if (!validatePhoneNumber(phone)) {
    //   setPhoneError(true);
    //   setLoading(false);
    //   return;
    // }
    // setPhoneError(false);
    // const passwordValidationMessage = validatePassword(password);
    // if (passwordValidationMessage) {
    //   setPasswordError(passwordValidationMessage);
    //   setLoading(false);
    //   return;
    // }
    // setPasswordError("");
    // setPhoneError(false);
    router.push("/verify_account");
    // Toast.show({
    //   type: "success",
    //   text1: "Thông báo",
    //   text2: "Bạn đã đăng ký thành công!",
    //   position: "top",
    //   visibilityTime: 2000,
    // });
    setLoading(false);
  };
  return (
    <View className="bg-white w-full h-full min-h-dvh flex flex-col pt-10 relative">
      <View className="flex gap-3 w-full flex-row items-start px-1  justify-center pb-5">
        <Text className="font-bold text-[25px] text-[#404040]">
          Trở thành một phần của LiveBoat!
        </Text>
      </View>

      <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
        <View className="flex flex-col justify-center items-center w-full gap-2">
          <Text className="text-start justify-start w-[90%] font-bold">
            Số điện thoại
          </Text>
          <Input
            error={phoneError}
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            placeholder="Số điện thoại"
          ></Input>
        </View>
        <View className="flex flex-col justify-center items-center w-full gap-2">
          <Text className="text-start justify-start w-[90%] font-bold">
            Mật khẩu
          </Text>
          <Input
            errorPassword={passwordError}
            value={password}
            onChangeText={setPassword}
            placeholder="Mật khẩu"
            type="password"
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
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          className="flex flex-row gap-2 text-start justify-start w-[95%] items-start px-2 pt-2 "
        >
          <Checkbox value={isChecked} onValueChange={setIsChecked}></Checkbox>
          <Text className="w-[90%] leading-4 text-[13px]">
            Có, hãy thông báo cho tôi về ưu đãi & tính năng mới. Tôi có thể hủy
            bất kỳ lúc nào.
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-12 gap-5">
        <CustomButton
          primary={true}
          secondary={false}
          title="Đăng ký"
          isLoading={loading}
          onPress={handleRegister}
        ></CustomButton>
        <CustomButton
          primary={false}
          secondary={true}
          title="Đăng nhập"
          onPress={() => router.replace("/login")}
        ></CustomButton>
      </View>
    </View>
  );
};
export default Register;
