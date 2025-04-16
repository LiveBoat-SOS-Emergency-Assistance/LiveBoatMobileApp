import { Pressable, Text, View } from "react-native";
import React from "react";
import ImageCustom from "../Image/Image";
const AddressSOSCard = () => {
  return (
    <View className="w-full h-fit rounded-[10px] bg-[#f4f4f4] px-4 py-4 flex flex-col gap-2">
      <View className="flex flex-row justify-between items-center w-full">
        <Text className="text-[#a7a6a6] font-bold text-[13px]">
          Enclave Building
        </Text>
        <Text className="text-[#80C4E9] font-bold text-[10px]">0.1 km</Text>
      </View>
      <Text className="text-[#404040] text-[12px] font-bold">
        216-218 Nguyễn Phước Lan, Hoà Xuân, Cẩm Lệ, Đà Nẵng
      </Text>
      <Pressable
        className="px-2 w-[105px] py-2 bg-[#80C4E9] rounded-[5px] flex flex-row gap-1 items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <ImageCustom
          source="https://img.icons8.com/?size=100&id=100004&format=png&color=000000"
          color="white"
          width={20}
          height={20}
        ></ImageCustom>
        <Text className="text-white text-[10px] font-bold">Take me there</Text>
      </Pressable>
    </View>
  );
};
export default AddressSOSCard;
