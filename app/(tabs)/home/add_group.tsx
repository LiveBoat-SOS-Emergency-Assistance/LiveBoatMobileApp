import { Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import Input from "../../../components/Input/Input";
import Toast from "react-native-toast-message";
import { groupServices } from "../../../services/group";
import { router } from "expo-router";
import CustomButton from "../../../components/Button/CustomButton";
const add_group = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAdd = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: "Please enter a squad name",
      });
      return;
    }
    try {
      setLoading(true);
      const result = await groupServices.createGroup({ name: name });
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "Add squad successfully",
      });
      setLoading(false);
      router.back();
    } catch (error: any) {
      console.error("Error adding group:", error);
      setLoading(false);
    }
  };
  return (
    <View className="w-full h-screen pt-6 bg-white">
      <View className="flex flex-row justify-center items-center relative gap-2 w-full">
        <Text className="font-bold text-[#404040] text-[15px] ">
          Add support group to
        </Text>
        <Text className="font-bold text-[#EB4747] text-[15px]">SOS</Text>
        {/* <Pressable>
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
            width={20}
            height={20}
            color="#4A9FCE"
          ></ImageCustom>
        </Pressable> */}
      </View>
      <View className="flex flex-col justify-start gap-4 w-full px-3">
        <Text className="text-[#4A9FCE] text-[10px] font-bold">
          Squad name:
        </Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Enter name squad"
        ></Input>
        <View className="flex flex-col gap-2">
          <View className="flex flex-row">
            <ImageCustom
              width={15}
              height={15}
              source="https://img.icons8.com/?size=100&id=114436&format=png&color=000000"
            ></ImageCustom>
            <Text className="text-[10px] font-bold text-[#404040]">
              Team members will receive:
            </Text>
          </View>
          <View className="flex flex-row">
            <ImageCustom
              width={15}
              height={15}
              source="https://img.icons8.com/?size=100&id=jHQbIMnZor2r&format=png&color=000000"
            ></ImageCustom>
            <Text className="text-[10px] text-[#404040]">
              Instant SOS notification.
            </Text>
          </View>
          <View className="flex flex-row">
            <ImageCustom
              width={15}
              height={15}
              source="https://img.icons8.com/?size=100&id=jHQbIMnZor2r&format=png&color=000000"
            ></ImageCustom>
            <Text className="text-[10px] text-[#404040]">
              Your current location.
            </Text>
          </View>
        </View>
        <View className="w-full flex  justify-end">
          <CustomButton
            primary
            onPress={handleAdd}
            title="Add"
            // className="flex justify-center items-center px-3 py-2 flex-row gap-2 bg-[#EB4747] rounded-[30px]"
          >
            {/* <ImageCustom
              source="https://img.icons8.com/?size=100&id=r4ZoJ0KDic77&format=png&color=000000"
              width={24}
              height={24}
              color="white"
            ></ImageCustom> */}
            {/* <Text className="text-white font-bold text-[10px]">Add</Text> */}
          </CustomButton>
        </View>
      </View>
    </View>
  );
};
export default add_group;
