import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { TextInput } from "react-native-gesture-handler";
import ImageCustom from "../../../components/Image/Image";
import Dropdown from "../../../components/Dropdown/Dropdown";
import CustomButton from "../../../components/Button/CustomButton";
import DonationCard from "../../../components/Card/DonationCard";
import { router } from "expo-router";
import { charityServices } from "../../../services/charity";
const SupportDiary = () => {
  const [listCharity, setListCharity] = useState([]);
  const fetchCharity = async () => {
    try {
      const result = await charityServices.get_all_charity(4, 0, "ACTIVE");
      console.log(result.data);
      setListCharity(result.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCharity();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="bg-white w-full h-full pt-32 flex flex-col gap-4 relative ">
        {/* <View className=" w-full justify-center items-center ">
          <Text className="text-[28px] text-[#404040] font-bold ">
            Support diary
          </Text>
        </View> */}
        <View className="flex flex-row w-full px-3 gap-2 ">
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
            className="w-[40%] h-[40px] relative rounded-[20px]"
          >
            <TextInput
              placeholder="Search..."
              className="w-full  py-3 bg-white rounded-[20px] text-[14px] border border-[#D9D9D9] shadow-md px-5"
            ></TextInput>
            <ImageCustom
              width={25}
              height={25}
              color="#80C4E9"
              className="absolute right-2 top-2"
              source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
            ></ImageCustom>
          </View>
          <View className="w-[28%] h-[40px]">
            <Dropdown
              items={[
                { label: "Ongoing", value: "ongoing" },
                { label: "Closed", value: "closed" },
              ]}
            />
          </View>
          <View className="w-[28%] h-[40px]">
            <Dropdown
              items={[
                { label: "Da Nang", value: "danang" },
                { label: "Hue", value: "hue" },
              ]}
              variant="primary"
            />
          </View>
        </View>

        <ScrollView
          className="mt-10 pl-8"
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View className="flex-row flex-wrap  gap-y-4">
            {listCharity.map((charity, index) => (
              <View key={index} className="w-[32%]">
                <DonationCard
                  charity={charity}
                  onPress={() => {
                    router.push({
                      pathname: "(tabs)/donation/DonationDetail",
                      params: { item: JSON.stringify(charity) },
                    });
                  }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
export default SupportDiary;
