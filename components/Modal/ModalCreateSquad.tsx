import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import Input from "../Input/Input";
import ImageCustom from "../Image/Image";
import CustomButton from "../Button/CustomButton";
import { groupServices } from "../../services/group";
import Toast from "react-native-toast-message";
interface modalProps {
  onClose: () => void;
  onRefresh?: () => void;
}

const ModalCreateSquad = ({ onClose, onRefresh }: modalProps) => {
  // console.log("Click");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAdd = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a squad name",
      });
      return;
    }
    try {
      setLoading(true);
      const result = await groupServices.createGroup({ name: name });
      onRefresh?.();
      Toast.show({
        type: "success",
        text1: "Successful",
        text2: "Add squad successfully",
      });
      setLoading(false);
      onClose();
    } catch (error: any) {
      console.error("Error adding group:", error);
      setLoading(false);
    }
  };
  return (
    <Modal
      visible={true}
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
            className="w-[90%] h-fit py-5 px-3 gap-2 relative bg-white justify-center items-center rounded-[20px]"
          >
            <View className="flex flex-row justify-center items-center relative gap-2 w-full">
              <Text className="font-bold text-[#404040] text-[15px] ">
                Add support group to
              </Text>
              <Text className="font-bold text-[#EB4747] text-[15px]">SOS</Text>
              <Pressable className="absolute right-2" onPress={onClose}>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
                  width={14}
                  height={14}
                  color="#4A9FCE"
                ></ImageCustom>
              </Pressable>
            </View>
            <View className="flex flex-col justify-start gap-4 w-full px-3">
              <Text className="text-[#4A9FCE] text-[10px] font-bold">
                Squad name:
              </Text>
              <View className="w-full justify-center flex items-center">
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name squad"
                  width="100%"
                ></Input>
              </View>
              <View className="flex flex-col gap-3 pt-5">
                <View className="flex flex-row gap-2 items-center">
                  <ImageCustom
                    width={15}
                    height={15}
                    source="https://img.icons8.com/?size=100&id=114436&format=png&color=000000"
                  ></ImageCustom>
                  <Text className="text-[10px] font-bold text-[#404040]">
                    Team members will receive:
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center">
                  <ImageCustom
                    width={15}
                    height={15}
                    source="https://img.icons8.com/?size=100&id=jHQbIMnZor2r&format=png&color=000000"
                  ></ImageCustom>
                  <Text className="text-[10px] text-[#404040]">
                    Instant SOS notification.
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center">
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
              <View className="w-full   flex items-end justify-end">
                <TouchableOpacity
                  onPress={handleAdd}
                  className="flex w-2/5 justify-center items-center px-2 py-2 flex-row gap-2 bg-[#EB4747] rounded-[30px]"
                >
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=r4ZoJ0KDic77&format=png&color=000000"
                    width={24}
                    height={24}
                    color="white"
                  ></ImageCustom>
                  <Text className="text-white font-bold text-[10px]">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default ModalCreateSquad;
