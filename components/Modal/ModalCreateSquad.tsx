import {
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import Input from "../Input/Input";
import ImageCustom from "../Image/Image";
import { groupServices } from "../../services/group";
import Toast from "react-native-toast-message";

interface modalProps {
  onClose: () => void;
  onRefresh?: () => void;
}

const ModalCreateSquad = ({ onClose, onRefresh }: modalProps) => {
  const [name, setName] = useState("");
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
        text2: "Squad created successfully",
      });
      setLoading(false);
      onClose();
    } catch (error: any) {
      console.error("Error adding group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create squad",
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
              {/* Header */}
              <View className="relative mb-6">
                <Text className="text-xl font-bold text-gray-800 text-center">
                  Create New Squad
                </Text>
                <Text className="text-sm text-gray-500 text-center mt-1">
                  Add support group to{" "}
                  <Text className="font-bold text-red-500">SOS</Text>
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="absolute -top-2 right-2 bg-gray-100 rounded-full p-2"
                >
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
                    width={16}
                    height={16}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Squad Name Input */}
              <View className="mb-6">
                <Text className="text-blue-600 text-sm font-semibold mb-3">
                  Squad Name
                </Text>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter squad name"
                  width="100%"
                />
              </View>

              {/* Benefits Section */}
              <View className="mb-8">
                <View className="flex-row items-center mb-4">
                  <View className="bg-blue-100 rounded-full p-2 mr-3">
                    <ImageCustom
                      width={16}
                      height={16}
                      source="https://img.icons8.com/?size=100&id=114436&format=png&color=000000"
                      color="#3b82f6"
                    />
                  </View>
                  <Text className="text-sm font-semibold text-gray-700">
                    Team members will receive:
                  </Text>
                </View>

                <View className="bg-blue-50 rounded-2xl p-4 space-y-3">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 rounded-full p-1.5 mr-3">
                      <ImageCustom
                        width={12}
                        height={12}
                        source="https://img.icons8.com/?size=100&id=82461&format=png&color=000000"
                        color="#10b981"
                      />
                    </View>
                    <Text className="text-sm text-gray-600 flex-1">
                      Instant SOS notifications
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-green-100 rounded-full p-1.5 mr-3">
                      <ImageCustom
                        width={12}
                        height={12}
                        source="https://img.icons8.com/?size=100&id=12599&format=png&color=000000"
                        color="#10b981"
                      />
                    </View>
                    <Text className="text-sm text-gray-600 flex-1">
                      Real-time location sharing
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-gray-100 rounded-2xl py-4 items-center"
                >
                  <Text className="text-gray-600 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAdd}
                  disabled={loading}
                  className={`flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2 ${
                    loading ? "bg-gray-300" : "bg-red-500"
                  }`}
                >
                  {loading ? (
                    <Text className="text-white font-semibold">
                      Creating...
                    </Text>
                  ) : (
                    <>
                      <Text className="text-white font-semibold">Create</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalCreateSquad;
