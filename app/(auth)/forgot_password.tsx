import { Image, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import PinInput from "../../components/Pin/PinInput";
const forgot_password = () => {
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View className="flex flex-col bg-white w-full h-full min-h-dvh items-center py-2 gap-5">
        <View className="flex flex-col gap-3 w-full items-center">
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
            Quên mật khẩu?
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
      </View>
    </>
  );
};
export default forgot_password;
