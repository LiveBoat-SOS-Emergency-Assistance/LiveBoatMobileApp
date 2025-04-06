import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { router } from "expo-router";
import { sosService } from "../../../services/sos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../../components/Button/CustomButton";

export default function SOSDiable() {
  const handleOk = async () => {
    try {
      const longitude = await AsyncStorage.getItem("longitudeSOS");
      const latitude = await AsyncStorage.getItem("latitudeSOS");
      const accuracy = await AsyncStorage.getItem("accuracySOS");
      const sosId = await AsyncStorage.getItem("sosId");

      await sosService.sos_edit(sosId!, {
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
        status: "CANCEl",
      });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-5 relative">
      <View className="items-center mb-12">
        <AlertTriangle color="#404040" size={48} />
        <Text className="text-[#404040] text-2xl font-bold mt-2">
          SOS Disabled
        </Text>
        <Text className="text-gray-400 opacity-90 text-center mt-1">
          Emergency contacts have been notified that you no longer require
          assistance
        </Text>
      </View>
      <CustomButton onPress={handleOk} title="OK" third></CustomButton>
      {/* <TouchableOpacity
        onPress={handleOk}
        className="bg-[#80C4E9] py-4 px-10 rounded-full w-full items-center absolute bottom-[150px]"
      >
        <Text className="text-white font-bold text-lg">OK</Text>
      </TouchableOpacity> */}
    </View>
  );
}
