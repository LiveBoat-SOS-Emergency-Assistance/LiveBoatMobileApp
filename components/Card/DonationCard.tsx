import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
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
interface DonationItemProps {
  onPress?: () => void;
  charity?: Charity;
}
export default function DonationCard({ onPress, charity }: DonationItemProps) {
  const imageUri = charity?.extra_data.image
    ? { uri: charity.extra_data.image?.pic1 }
    : require("../../assets/images/emergency.jpg");
  return (
    <TouchableOpacity
      key={charity?.id}
      onPress={onPress}
      activeOpacity={0.8}
      className="w-[100px] h-[150px] gap-2 flex-col  bg-white rounded-[5px] py-1 flex justify-center items-center "
    >
      <Image
        style={{
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        className="w-full h-4/5 rounded-[5px] object-cover"
        source={imageUri}
      ></Image>
      <Text className="text-[#404040] text-[12px] w-[90%] h-1/5 text-center">
        {charity?.title || "Charity Title"}
      </Text>
    </TouchableOpacity>
  );
}
