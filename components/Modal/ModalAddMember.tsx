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
  squadId?: string;
}

const ModalAddMember = ({ onClose, onRefresh, squadId }: modalProps) => {
  // console.log("Click");
  const [name, setName] = useState("");
  const getMember = async () => {
    try {
    } catch (error: any) {}
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
              <Text className="font-bold text-[#404040] text-[18px] ">
                My family
              </Text>

              <Pressable className="absolute right-2" onPress={onClose}>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
                  width={14}
                  height={14}
                  color="#4A9FCE"
                ></ImageCustom>
              </Pressable>
            </View>
            <View className="flex flex-col justify-start gap-4 w-full px-3 pt-5">
              <View className="flex flex-row gap-5 w-full justify-center items-center">
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                  className="w-[90%] justify-center flex items-center flex-row "
                >
                  <Input
                    value={name}
                    onChangeText={setName}
                    placeholder=""
                    width="100%"
                    className="rounded-[30px]"
                  ></Input>
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
                    width={30}
                    height={30}
                    color="#80C4E9"
                    className="absolute right-3 top-3"
                  ></ImageCustom>
                </View>
                <Pressable className="w-[10%] flex justify-center items-center pb-14 ">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=UkLBG0sZoWV0&format=png&color=000000"
                    width={30}
                    height={30}
                    color="#80C4E9"
                    className="absolute right-3 top-3"
                  ></ImageCustom>
                </Pressable>
              </View>
              <View className="flex flex-col gap-3 w-full">
                <Text className="text-[#404040] font-bold text-[15px]">
                  Member:
                </Text>
                <View className="flex flex-col min-h-16"></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default ModalAddMember;
