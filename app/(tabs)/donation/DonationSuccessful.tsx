import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ImageCustom from "../../../components/Image/Image";
import { router } from "expo-router";
const DonationSuccessful = () => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View className="flex-1 bg-white w-full items-center justify-center flex flex-col gap-7">
      <ImageCustom
        width={screenWidth * 0.7}
        height={screenWidth * 0.7}
        className=" rounded-full"
        source={require("../../../assets/images/donatesuccess.png")}
      ></ImageCustom>
      <View className="flex flex-col gap-2">
        <Text className=" text-[26px] font-bold text-red-400">
          Thank You for Your Donation!
        </Text>
        <Text className="text-[#404040] text-sm italic">
          Your support helps us continue making a meaningful impact.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.replace("(tabs)/donation")}
        className="bg-[#eb4747] px-10 py-2 rounded-full flex justify-center items-center"
      >
        <Text className="text-white">Back</Text>
      </TouchableOpacity>
    </View>
  );
};
export default DonationSuccessful;
