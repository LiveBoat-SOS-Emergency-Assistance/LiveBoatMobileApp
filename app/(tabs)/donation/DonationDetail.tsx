import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import DonationItem from "../../../components/DonationItem/DonationItem";
import { router, useLocalSearchParams } from "expo-router";
import ModalDonation from "../../../components/Modal/ModalDonation";
import { charityServices } from "../../../services/charity";

interface Charity {
  id: string;
  title: string;
  description: string;
  goal_amount: string;
  status: string;
  createdAt: string;
  extra_data: {
    focus: string;
    region: string;
    image?: {
      pic1: string;
    };
  };
}
const DonationDetail = () => {
  const { item } = useLocalSearchParams();
  const charity = typeof item === "string" ? JSON.parse(item) : null;
  const [visible, setVisible] = useState(false);
  const [openModalDonation, setOpenModalDonation] = useState(false);
  const [listDonation, setListDonation] = useState<any>([]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchDonation = async () => {
    try {
      const result = await charityServices.get_all_donation_by_charityID(
        charity?.id,
        "SUCCESS"
      );
      // console.log(result.data[0]);
      setListDonation(result.data);
      // setListCharity(result.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "white",
        width: "100%",
        position: "relative",
      }}
    >
      {visible && (
        <ModalDonation
          charityId={charity?.id}
          title="Make a donation"
          message="Your support helps us achieve our goals and bring positive change"
          confirmText="Donate now"
          cancelText="Cancel"
          onConfirm={() => {
            console.log("Confirmed");
            setOpenModalDonation(true);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        />
      )}

      <ScrollView className="flex w-full h-full bg-white pt-2 px-5 gap-5 pb-32 ">
        <View className="flex flex-col gap-5 relative ">
          <View className="w-[90%] pl-5">
            <Text className="font-bold text-[#404040] text-[18px]">
              {charity?.title}
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
                {charity?.created_at ? formatDate(charity.created_at) : "N/A"}
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
                {charity?.status === "ACTIVE" ? "  Ongoing" : "  Closed"}
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
                {"  "} {charity?.extra_data?.region || "N/A"}
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
                {charity?.description || "No description available."}
              </Text>
            </View>
          </View>
          <View className="flex flex-col w-full  gap-2">
            <Text className="text-[#2D5B75] text-[12px] px-5 font-bold">
              List of supporters:
            </Text>
            <View className="flex flex-col w-full mb-32">
              <View className="flex flex-col w-full mb-32">
                {/* <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem>
                <DonationItem></DonationItem> */}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
          // router.push("(tabs)/donation/Donate");
        }}
        activeOpacity={0.8}
        className="absolute bottom-24 right-5"
      >
        <Animatable.View
          animation="rubberBand"
          iterationCount="infinite"
          duration={1500}
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#EB4747",
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <ImageCustom
            width={25}
            height={25}
            color="#fff"
            source="https://img.icons8.com/?size=100&id=wYrEPj8MXvDY&format=png&color=000000"
          ></ImageCustom>
        </Animatable.View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};
export default DonationDetail;
