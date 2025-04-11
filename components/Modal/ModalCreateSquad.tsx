import { Modal, Pressable, Text, View } from "react-native";
import React from "react";
import Avatar from "../Image/Avatar";
import Input from "../Input/Input";
import ImageCustom from "../Image/Image";
interface modalProps {
  onClose: () => void;
}

const ModalCreateSquad = ({ onClose }: modalProps) => {
  console.log("Click");
  return (
    <Modal
      visible={true}
      transparent={false}
      statusBarTranslucent
      onRequestClose={onClose}
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className="fixed inset-0 flex w-full h-screen justify-center items-center text-center z-1000"
      >
        <View className="w-[90%] ">
          <View className="flex flex-row justify-center items-center relative gap-2">
            <Text className="font-bold text-[#404040] text-[15px] ">
              Add support group to
            </Text>
            <Text className="font-bold text-[#EB4747] text-[15px]">SOS</Text>
            <Pressable onPress={onClose}>
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
                width={20}
                height={20}
                color="#4A9FCE"
              ></ImageCustom>
            </Pressable>
          </View>
          <View className="flex flex-col justify-start gap-4">
            <Text className="text-[#4A9FCE] text-[10px] font-bold">
              Squad name:
            </Text>
            <Input placeholder="Enter name squad"></Input>
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
              <Pressable className="flex justify-center items-center px-3 py-2">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=r4ZoJ0KDic77&format=png&color=000000"
                  width={24}
                  height={24}
                  color="white"
                ></ImageCustom>
                <Text className="text-white font-bold text-[10px]">Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ModalCreateSquad;
