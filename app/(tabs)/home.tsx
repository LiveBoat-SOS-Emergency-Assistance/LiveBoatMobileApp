import { View, Text, StyleSheet, Image, Button, Pressable } from "react-native";
import { FONTS, COLORS } from "../../constants/theme";
import { useRouter } from "expo-router";
import CustomButton from "../../components/Button/CustomButton";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
export default function home() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <View
        style={tw.style(
          "flex-1 justify-center items-center w-full  flex flex-col relative gap-3 bg-white "
        )}
      >
        <View className="absolute top-7 flex flex-col justify-center items-center gap-3">
          <Image
            source={require("../../assets/images/imageHomepage.png")}
            style={{ width: 320, height: 350 }}
            className="object-cover "
          ></Image>
          <View
            style={tw.style(
              "w-[80px] h-[80px] bg-[#ed5a5a] rounded-[90px] flex justify-center items-center"
            )}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png",
              }}
              style={{ width: 40, height: 40, tintColor: "#ffffff" }}
            />
          </View>

          <View
            style={tw.style("flex flex-col w-full justify-center items-center")}
          >
            <Text
              className="font-extrabold text-[25px]  text-[#404040]"
              style={{ fontFamily: FONTS.PoppinsBold }}
            >
              Khẩn cấp?
            </Text>
            <Text
              className="font-extrabold text-[25px] text-[#404040]"
              style={{ fontFamily: FONTS.PoppinsBold }}
            >
              Luôn có chúng tôi bên bạn!
            </Text>
          </View>
          <View className="flex flex-col gap-4 w-full justify-center items-center pt-8">
            <CustomButton
              primary={true}
              secondary={false}
              title="Tạo tài khoản"
              onPress={() => router.push("/register")}
            ></CustomButton>
            <Pressable
              // onPress={() => router.push("/register")}
              onPress={() => router.push("/forgot_password")}
              className="bg-white py-3 flex items-center w-[100%] rounded-[30px] border-[#d9d9d9] border shadow-md flex-row justify-center gap-3"
            >
              <Image
                source={require("../../assets/images/gg.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text className="text-[#404040] font-bold text-[18px]">
                Tiếp tục với Google
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="underline text-[#404040]">
                Đã có tài khoản? Đăng nhập
              </Text>
            </Pressable>
          </View>
        </View>
        <Text className="text-[11px] bottom-2  absolute w-[80%] justify-center flex items-center text-center">
          Bằng cách tiếp tục, bạn đồng ý với
          <Text className="font-bold"> Điều khoản sử dụng </Text>và xác nhận đã
          đọc
          <Text className="font-bold">
            {" "}
            Chính sách quyền riêng tư & Cookie.
          </Text>
        </Text>
      </View>
    </>
  );
}
