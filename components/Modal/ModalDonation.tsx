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
    <Modal transparent={true} animationType="fade">
      <View
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 1000 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-[90%] bg-white rounded-3xl px-6 pt-8 pb-6 relative shadow-lg">
              {/* Close button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCancel}
                className="absolute top-4 right-4 z-10"
              >
                <ImageCustom
                  width={20}
                  height={20}
                  source="https://img.icons8.com/ios-glyphs/30/000000/macos-close.png"
                />
              </TouchableOpacity>
              {/* Title */}
              <Text className="text-xl font-bold text-center text-[#EB4747] mb-2 tracking-wide">
                {title}
              </Text>
              {/* Message */}
              {!!message && (
                <Text className="text-center text-gray-600 mb-4 text-base">
                  {message}
                </Text>
              )}
              {/* Amount input */}
              <View className="flex flex-col gap-2 mb-4">
                <View className="flex flex-row items-center gap-2 mb-1">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=18962&format=png&color=000000"
                    width={20}
                    height={20}
                  />
                  <Text className="text-[#404040] font-semibold text-base">
                    Amount
                  </Text>
                </View>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: amountError ? "#EF4444" : "#d1d5db",
                    borderRadius: 10,
                    padding: 12,
                    width: "100%",
                    fontSize: 16,
                    color: "#222",
                    backgroundColor: "#f9fafb",
                  }}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="number-pad"
                  placeholder="200.000 VNĐ"
                  placeholderTextColor="#aaa"
                />
                {amountError ? (
                  <Text
                    style={{ color: "#EF4444", fontSize: 13, marginTop: 2 }}
                  >
                    {amountError}
                  </Text>
                ) : null}
              </View>
              {/* Confirm button */}
              <TouchableOpacity
                onPress={handleDonation}
                activeOpacity={0.8}
                className="py-3 rounded-xl w-full bg-[#EB4747] mb-3"
                style={{
                  shadowColor: "#EB4747",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-center text-white font-bold text-base tracking-wide">
                  {confirmText}
                </Text>
              </TouchableOpacity>
              {/* Secure payment info */}
              <View className="w-full flex flex-row justify-center items-center mt-2">
                <View className="flex flex-row px-3 py-1 justify-center items-center bg-gray-100 rounded-2xl gap-2">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=znpDNZWhQe6p&format=png&color=000000"
                    width={18}
                    height={18}
                  />
                  <Text className="text-[12px] text-gray-500">
                    Secure Payment
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ModalDonation;
