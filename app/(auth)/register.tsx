import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError(true);
      setLoading(false);
      return;
    }
    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      setLoading(false);
      return;
    }
    setPasswordError("");
    setEmailError(false);
    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Bạn đã đăng ký thành công!",
      position: "top",
      visibilityTime: 2000,
    });
    setLoading(false);
  };
  return (
    <View className="bg-white w-full h-full min-h-dvh flex flex-col pt-10 relative">
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
          Trở thành một phần của LiveBoat!
        </Text>
      </View>

      <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
        <View className="flex flex-col justify-center items-center w-full gap-2">
          <Text className="text-start justify-start w-[90%] font-bold">
            Email
          </Text>
          <Input
            error={emailError}
            value={email}
            onChangeText={setEmail}
            type="email"
            placeholder="Email"
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
              uri: "https://img.icons8.com/?size=100&id=82771&format=png&color=000000",
            }}
            style={{ width: 15, height: 15, tintColor: "#404040" }}
          ></Image>
          <Text className="text-[12px]">Ít nhất 10 ký tự</Text>
        </View>
        <View className="flex flex-row gap-2 text-start justify-start w-[90%] items-center">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=82771&format=png&color=000000",
            }}
            style={{ width: 15, height: 15, tintColor: "#404040" }}
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

      {/* <View className="w-full justify-center items-center bottom-0 absolute ">
        <Text className="text-[11px]  mx-auto w-[80%] justify-center flex items-center text-center">
          By proceeding, you agree to our
          <Text className="font-bold"> Term of Use</Text> and confirm you have
          read our
          <Text className="font-bold"> Privacy and Cookie Statement</Text>
        </Text>
      </View> */}
    </View>
  );
};
export default Register;
