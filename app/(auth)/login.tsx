import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Input from "../../components/Input/Input";
import CustomButton from "../../components/Button/CustomButton";
import { router } from "expo-router";
const Login = () => {
  return (
    <View className="bg-white w-full h-full flex flex-col pt-10 relative">
      <View className="flex gap-3 w-full flex-row items-center px-2  justify-center pb-5">
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
          Hey there, welcome back
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
          <Input isPassword={true} placeholder="Password"></Input>
        </View>
      </View>
      <Pressable className="w-full justify-center flex items-center pt-10">
        <Text className="font-bold underline w-[90%] ">Forgot password?</Text>
      </Pressable>
      <View className="flex flex-col mx-auto w-[90%] justify-center items-center pt-10 gap-5">
        <CustomButton
          primary={true}
          secondary={false}
          title="Log in"
          onPress={() => console.log("click button")}
        ></CustomButton>
        <CustomButton
          primary={false}
          secondary={true}
          title="Sign up"
          onPress={() => router.replace("/register")}
        ></CustomButton>
      </View>
      {/* <View className="w-full justify-center items-center bottom-2 absolute">
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
export default Login;
