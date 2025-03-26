import { Image, Text, View } from "react-native";

const verify_account = () => {
  return (
    <View className="bg-white w-full min-h-dvh flex flex-col">
      <View className="flex gap-3 w-full flex-row items-start px-1  justify-center pb-5">
        <Text className="font-bold text-[25px] text-[#404040]">
          Xác minh tài khoản
        </Text>
      </View>
      <View className="w-full flex flex-col justify-center items-center">
        <View className="w-[90%] flex flex-col rounded-[10px] justify-center">
          <Image
            source={require("../../assets/images/phone.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text>Xác minh tài khoản qua số điện thoại</Text>
        </View>
        <View className="w-[90%] flex flex-col  rounded-[10px]">
          <Image
            source={require("../../assets/images/gg.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text>Xác minh tài khoản qua Email</Text>
        </View>
      </View>
    </View>
  );
};
export default verify_account;
