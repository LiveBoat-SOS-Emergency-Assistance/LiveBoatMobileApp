import {
  View,
  Text,
  Pressable,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Avatar from "../../../components/Image/Avatar";
import { useAuth } from "../../../context/AuthContext";
import DonationCard from "../../../components/Card/DonationCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageCustom from "../../../components/Image/Image";
import DonationItem from "../../../components/DonationItem/DonationItem";
import { router, useRouter } from "expo-router";
import { charityServices } from "../../../services/charity";
export default function Donation() {
  const { profile } = useAuth();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 3;
  const [listCharity, setListCharity] = useState([]);
  const [listDonation, setListDonation] = useState([]);
  const router = useRouter();
  const visibleWidth = cardWidth * 2.5;
  const data = [
    { id: "1", title: "Item One" },
    { id: "2", title: "Item Two" },
    { id: "3", title: "Item Three" },
  ];

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const result = await charityServices.get_all_charity(3, 0, "ACTIVE");
        // console.log(result.data);
        setListCharity(result.data);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchCharity();
  }, []);
  const handleNavidateToDetail = (item: any) => {
    router.push({
      // pathname: "(tabs)/donation/DonationSuccessful",
      pathname: "(tabs)/donation/DonationDetail",
      params: { item: JSON.stringify(item) },
    });
  };
  const fetchDonation = async () => {
    try {
      const result = await charityServices.get_all_donation_by_charityID();
      // console.log(result.data[0]);
      setListDonation(result.data);
      // setListCharity(result.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDonation();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <View className="flex flex-col gap-10 w-full h-full bg-white">
          <View className="flex flex-row px-5 justify-between">
            <Text className="text-[28px] text-[#404040] font-bold w-[70%]">
              Donation year of history
            </Text>
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Pressable>
                <Avatar
                  source={profile?.User?.avatar_url}
                  width={65}
                  height={65}
                ></Avatar>
              </Pressable>
            </View>
          </View>
          <View className="flex flex-row w-full px-5 mt-0 gap-4 justify-start items-center">
            {listCharity.map((item: any, index: number) => {
              return (
                <DonationCard
                  key={index}
                  charity={item}
                  onPress={() => handleNavidateToDetail(item)}
                />
              );
            })}
            <View className="h-[100px] flex justify-center items-center pb-8">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/donation/SupportDiary")}
              >
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=wgYy0nz8B9SS&format=png&color=000000"
                  width={20}
                  height={20}
                ></ImageCustom>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-row w-full justify-between px-6 ">
            <View className="flex flex-col gap-2">
              <View className="flex gap-3 flex-row justify-start items-center">
                <Text className="text-[#404040] opacity-90 font-bold text-[13px]">
                  Total donations:
                </Text>
                <Text className="text-[#2D5B75] font-bold text-[15px]">
                  +5.752.250 VNĐ
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-[#404040] text-[10px]">
                  Your kindness saves lives –
                </Text>
                <Text className="text-[#EB4747] font-bold italic text-[12px]">
                  Donate now!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/donation/SupportDiary")}
              activeOpacity={0.8}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
              className="bg-[#EB4747] px-5 py-2 flex justify-center items-center rounded-[10px]"
            >
              <Text className="text-white font-bold  ">Donation</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-col gap-5">
            <View className="flex flex-row w-full justify-center gap-3  px-7">
              <TextInput
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                placeholder="Enter phone number..."
                className="w-[70%] py-3 bg-white rounded-[10px] text-[14px] border border-[#D9D9D9] shadow-md px-5"
              ></TextInput>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                className="flex gap-2 w-[30%] flex-row bg-[#80C4E9] justify-center items-center rounded-[10px]"
              >
                <Text className="font-bold text-white">Search</Text>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
                  width={20}
                  height={20}
                  color="white"
                ></ImageCustom>
              </TouchableOpacity>
            </View>
            {/* <View className="flex flex-col w-full gap-2 ">
              <DonationItem></DonationItem>
              <DonationItem></DonationItem>
              <DonationItem></DonationItem>
            </View> */}
            <ScrollView>
              <View className="flex flex-col gap-2 px-5">
                {listDonation.map((item: any, index: number) => {
                  return (
                    <DonationItem
                      key={index}
                      item={item}
                      // onPress={() => handleNavidateToDetail(item)}
                    ></DonationItem>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
