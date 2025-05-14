import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
interface Charity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
interface DonationItemProps {
  onPress?: () => void;
  charity: Charity;
}
export default function DonationCard({ onPress }: DonationItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-[100px] h-[131px] gap-2 flex-col  bg-white rounded-[5px] py-1 flex justify-center items-center "
    >
      <Image
        style={{
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        className="w-full h-4/5 rounded-[5px] object-cover"
        source={require("../../assets/images/flood.png")}
      ></Image>
      <Text className="text-[#404040] text-[12px] w-[90%] text-center">
        Floods in the central region of Vietnam
      </Text>
    </TouchableOpacity>
  );
}
