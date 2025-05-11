import { Text, View, Image } from "react-native";
import React from "react";
import ImageCustom from "../../../components/Image/Image";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import CustomButton from "../../../components/Button/CustomButton";
import DonationItem from "../../../components/DonationItem/DonationItem";
const DonationDetail = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="flex w-full h-full bg-white pt-2 px-5 gap-5 pb-32 ">
        <View className="flex flex-col gap-5 relative ">
          <View className="w-[90%] pl-5">
            <Text className="font-bold text-[#404040] text-[18px]">
              Floods in the Central Region 2023 - Join hands to help people
            </Text>
          </View>
          <View className="flex flex-col w-full px-5 gap-2">
            <View className="flex flex-row gap-2 items-center">
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=12776&format=png&color=000000"
                width={20}
                height={20}
              ></ImageCustom>
              <Text className="text-[#666666] text-[12px] font-bold">
                Start time:
              </Text>
              <Text className="text-[#2D5B75] text-[12px] font-bold">
                October 2025
              </Text>
            </View>
            <View className="flex flex-row gap-2 items-center">
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=12776&format=png&color=000000"
                width={20}
                height={20}
              ></ImageCustom>
              <Text className="text-[#666666] text-[12px] font-bold">
                End time:
              </Text>
              <Text className="text-[#2D5B75] text-[12px] font-bold">
                {"  "}Ongoing
              </Text>
            </View>
            <View className="flex flex-row gap-2 items-center">
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=lnjvjfvXC9fa&format=png&color=000000"
                width={20}
                height={20}
              ></ImageCustom>
              <Text className="text-[#666666] text-[12px] font-bold">
                Address:
              </Text>
              <Text className="text-[#2D5B75] text-[12px] font-bold">
                {"   "}
                Quang Binh, Quang Tri, Thua Thien Hue
              </Text>
            </View>
          </View>
          <View className="w-full px-4">
            <Image
              className="w-full h-[200px] rounded-[20px] obeject-cover"
              source={require("../../../assets/images/flood.png")}
            ></Image>
          </View>
          <View className="flex flex-col w-full px-5 gap-2">
            <Text className="text-[#2D5B75] text-[12px] font-bold">
              Event summary:
            </Text>
            <View className="bg-[#d9eef9] w-full h-fit rounded-[30px] flex px-4 py-2">
              <Text className="text-[#404040] text-[13px] px-2  py-2">
                In October 2023, prolonged heavy rain due to the influence of
                tropical depression caused serious flooding in the Central
                provinces. Many areas were deeply flooded, traffic was cut off,
                thousands of households suffered from lack of food, clean water
                and safe housing.
              </Text>
            </View>
          </View>
          <View className="flex flex-col w-full  gap-2">
            <Text className="text-[#2D5B75] text-[12px] px-5 font-bold">
              List of supporters:
            </Text>
            <View className="flex flex-col w-full mb-32">
              <View className="flex flex-col w-full mb-32">
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="w-full absolute px-4 bottom-32">
        <CustomButton primary title="Donation" />
      </View>
    </GestureHandlerRootView>
  );
};
export default DonationDetail;
