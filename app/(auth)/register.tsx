import { Image, Text, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { router } from "expo-router";

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View className="bg-white w-full h-full flex flex-col pt-10 relative">
      <View className="flex gap-2 w-full flex-row items-center px-2  justify-center pb-5">
        <View
          style={tw.style(
            "w-[60px] h-[60px] bg-[#eb4747] rounded-[90px] flex justify-center items-center"
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
          Become a LiveBoat member
        </Text>
      </View>

      <View className="flex flex-col gap-10 justify-center items-center w-full pt-5">
        <View className="flex flex-col justify-center items-center w-full gap-2">
          <Text className="text-start justify-start w-[90%] font-bold">
            Email
          </Text>
          <Input placeholder="Email address"></Input>
        </View>
        <View className="flex flex-col justify-center items-center w-full gap-2">
          <Text className="text-start justify-start w-[90%] font-bold">
            Password
          </Text>
          <Input placeholder="Password" isPassword={true}></Input>
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
          <Text className="text-[12px]">At least 10 characters</Text>
        </View>
        <View className="flex flex-row gap-2 text-start justify-start w-[90%] items-center">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=82771&format=png&color=000000",
            }}
            style={{ width: 15, height: 15, tintColor: "#404040" }}
          ></Image>
          <Text className="text-[12px]">Contains a special characters</Text>
        </View>
        <View className="flex flex-row gap-2 text-start justify-start w-[95%] items-start px-2 pt-2 ">
          <Checkbox value={isChecked} onValueChange={setIsChecked}></Checkbox>
          <Text className="w-[90%] leading-4 text-[13px]">
            Yes, inform me on deals & new features. I can opt out of any time
          </Text>
        </View>
      </View>

      <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-12 gap-5">
        <CustomButton
          primary={true}
          secondary={false}
          title="Sign up"
          onPress={() => console.log("click button")}
        ></CustomButton>
        <CustomButton
          primary={false}
          secondary={true}
          title="Log in"
          onPress={() => router.replace("/login")}
        ></CustomButton>
      </View>
      <View className="w-full justify-center items-center bottom-2 absolute">
        <Text className="text-[11px]  mx-auto w-[80%] justify-center flex items-center text-center">
          By proceeding, you agree to our
          <Text className="font-bold"> Term of Use</Text> and confirm you have
          read our
          <Text className="font-bold"> Privacy and Cookie Statement</Text>
        </Text>
      </View>
    </View>
  );
};
export default Register;
