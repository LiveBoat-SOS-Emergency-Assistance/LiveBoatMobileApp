import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Video, MessageSquare, X } from "lucide-react-native";
import Map from "../../../components/Map/Map";
import ImageCustom from "../../../components/Image/Image";

export default function SOSMap() {
  const [sosActive, setSosActive] = useState(true);

  const handleDisableSOS = () => {
    setSosActive(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 bg-[#EB4747] py-8 items-center z-10 rounded-b-[30px]">
        <Text className="text-white text-lg font-bold pt-3">SOS Activated</Text>
      </View>
      <Map />

      {/* Action Buttons */}
      <View className="absolute top-[100px] gap-5 left-0 right-0 flex-row justify-center space-x-4">
        <TouchableOpacity className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full">
          <Video color="white" size={24} />
          <Text className="text-white ml-2">Live Stream</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full">
          {/* <MessageSquare color="white" size={24} /> */}
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=d7iUgF8ZrDaO&format=png&color=000000"
            width={24}
            height={24}
            color="#ffffff"
          ></ImageCustom>
          <Text className="text-white ml-2">Group Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View className="absolute bg-white border-t-[#ddd] bottom-0 py-5 left-0 right-0 flex-row justify-around px-5  items-center">
        <Text className="text-lg font-bold text-gray-400">Are you OK?</Text>
        <TouchableOpacity
          onPress={handleDisableSOS}
          className="flex-row items-center bg-[#EB4747] px-4 py-2 rounded-full"
        >
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=AqDEb8mCIrk9&format=png&color=000000"
            width={24}
            height={24}
            color="#ffffff"
          ></ImageCustom>
          <Text className="text-white ml-2 font-bold">Disable SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
