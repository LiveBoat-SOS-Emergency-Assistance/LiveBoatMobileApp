import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import ImageCustom from "../Image/Image";
import Input from "../Input/Input";
import { charityServices } from "../../services/charity";
import { router } from "expo-router";

interface CustomDialogProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  charityId?: number;
}

const ModalDonation: React.FC<CustomDialogProps> = ({
  title = "Notification",
  message = "",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  charityId,
}) => {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateAmount = (amount: string) => {
    return /^\d+$/.test(amount) && parseInt(amount, 10) > 0;
  };
  const handleDonation = async () => {
    if (!validateAmount(amount)) {
      setAmountError("Please enter a valid amount");
      return;
    }
    setAmountError("");
    try {
      console.log("charityId", charityId);
      const result = await charityServices.create_donation({
        charity_id: Number(charityId),
        amount: amount,
      });
      console.log(result.data);
      router.push({
        pathname: "(tabs)/donation/Donate",
        params: { item: JSON.stringify(result.data) },
      });
      onConfirm();
      setAmountError("");
    } catch (error: any) {
      console.error("Error when getting current SOS:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      setAmountError("Amount must be between 10,000 and 499,000,000.");
    }
  };
  return (
    <Modal transparent={true}>
      <View
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 1000 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-11/12 flex flex-col gap-6 bg-white rounded-2xl pt-8 pb-5 px-5 relative">
              <View className="gap-1">
                <Text className="text-lg font-normal text-center ">
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCancel}
                className="absolute top-4 right-3"
              >
                <ImageCustom
                  className=""
                  width={15}
                  height={15}
                  source="https://img.icons8.com/?size=100&id=83981&format=png&color=000000"
                ></ImageCustom>
              </TouchableOpacity>
              <View className="flex flex-col gap-3 mb-6">
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <ImageCustom
                      source="https://img.icons8.com/?size=100&id=18962&format=png&color=000000"
                      width={20}
                      height={20}
                    ></ImageCustom>
                    <Text className="text-[#404040] font-bold">Amount:</Text>
                  </View>
                  {/* <Input
                    errorPassword={amountError}
                    value={amount}
                    onChangeText={setAmount}
                    type="amount"
                    keyboardType="number-pad"
                    placeholder="200.000 VNĐ"
                    className="w-full"
                  ></Input> */}
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: amountError ? "#EF4444" : "#d1d5db",
                      borderRadius: 6,
                      padding: 10,
                      width: "100%",
                      fontSize: 16,
                      marginTop: 4,
                      color: "#222",
                    }}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="number-pad"
                    placeholder="200.000 VNĐ"
                    placeholderTextColor="#aaa"
                  />
                  {amountError ? (
                    <Text style={{ color: "#EF4444", fontSize: 12 }}>
                      {amountError}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View className="flex-row justify-between rounded-lg">
                <TouchableOpacity
                  onPress={handleDonation}
                  activeOpacity={0.8}
                  className="flex-1 py-3 rounded-xl ml-2 w-full bg-red-400"
                >
                  <Text className="text-center text-[#fff] font-medium">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-full justify-center items-center flex">
                <View className="flex flex-row px-3 py-1 justify-center items-center bg-gray-100 rounded-[30px] gap-2 w-fit">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=znpDNZWhQe6p&format=png&color=000000"
                    width={20}
                    height={20}
                  ></ImageCustom>
                  <Text className="text-[12px]">Secure Payment</Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        {/* </TouchableWithoutFeedback> */}
      </View>
    </Modal>
  );
};

export default ModalDonation;
