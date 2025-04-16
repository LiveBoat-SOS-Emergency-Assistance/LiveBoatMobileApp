import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Input from "../Input/Input";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { getCurrentLocation, LocationResult } from "../../utils/location";
import { sosService } from "../../services/sos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface CustomDialogProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const DialogEditSOS: React.FC<CustomDialogProps> = ({
  title = "Notification",
  message = "",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationResult | null>(
    null
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      } else {
        console.warn("Unable to get current location");
      }
    };

    fetchLocation();
  }, []);

  const handleConfirm = async () => {
    try {
      const sosId = await AsyncStorage.getItem("sosId");
      if (currentLocation) {
        const result = await sosService.updateSOS(Number(sosId), {
          name: name,
          description: description,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          status: "ONGOING",
        });
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Updated SOS successfully",
        });
        onConfirm();
      } else {
        console.warn("Current location is not available");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View className="absolute top-0 left-0 z-50 w-full h-full">
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white rounded-2xl p-6">
            <Text className="text-lg font-semibold text-center mb-4">
              {title}
            </Text>
            <View className="flex flex-col gap-3 mb-6">
              <View className="flex flex-col gap-1">
                <Text className="text-[#404040] font-bold">Name:</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Name of emergency"
                  className="border py-2 border-gray-300 rounded-md px-2 text-sm"
                ></TextInput>
              </View>
              <View className="flex flex-col gap-1">
                <Text className="text-[#404040] font-bold">Description:</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your emergency"
                  className="w-full h-[100px] border items-start border-[#d9d9d9] rounded-[5px] justify-start mt-3 p-2 text-sm"
                  numberOfLines={4}
                  multiline={true}
                  textAlignVertical="top"
                ></TextInput>
              </View>
            </View>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 bg-gray-300 py-3 rounded-xl mr-2"
              >
                <Text className="text-center font-medium">{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="flex-1 bg-red-500 py-3 rounded-xl ml-2"
              >
                <Text className="text-center text-white font-medium">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
};

export default DialogEditSOS;
