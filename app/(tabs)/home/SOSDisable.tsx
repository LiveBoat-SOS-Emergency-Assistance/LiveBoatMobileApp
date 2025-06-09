import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { sosService } from "../../../services/sos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../../components/Button/CustomButton";
import Toast from "react-native-toast-message";
import { useSocket } from "../../../hooks/useLiveLocation";
import { useSocketContext } from "../../../context/SocketContext";
interface SocketEvents {
  TOSERVER_SOS_FINISHED: string;
  TOCLIENT_SOS_FINISHED: string;
}
export default function SOSDisable() {
  const [loading, setLoading] = useState(false);
  const { socket, setOtherUserMarkers, setUserInfo } = useSocketContext();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  console.log("SOSDisable 20, userId", userId);
  const SOCKET_EVENTS: SocketEvents = {
    TOSERVER_SOS_FINISHED: "TOSERVER_SOS_FINISHED",
    TOCLIENT_SOS_FINISHED: "TOCLIENT_SOS_FINISHED",
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const longitude = await AsyncStorage.getItem("longitudeSOS");
      const latitude = await AsyncStorage.getItem("latitudeSOS");
      const accuracy = await AsyncStorage.getItem("accuracySOS");
      const sosId = await AsyncStorage.getItem("sosId");
      console.log("socket emit", userId);
      const userType = "NORMAL";
      setUserInfo(userType);
      console.log("SOSDisable 30, sosId userId", sosId, userId);
      socket?.current?.emit(SOCKET_EVENTS.TOSERVER_SOS_FINISHED, { userId });

      await sosService.sos_edit(sosId!, {
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy,
        status: "CANCELED",
      });
      await AsyncStorage.multiRemove([
        "longitudeSOS",
        "latitudeSOS",
        "accuracySOS",
        "sosId",
      ]);
      Toast.show({
        type: "info",
        text1: "Notification",
        text2: "Your sos signal has been cancelled!",
        position: "top",
        visibilityTime: 2000,
      });

      setOtherUserMarkers({});
      router.replace("/(tabs)/home");
      socket.current?.disconnect();
      socket.current?.connect();
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
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
      <CustomButton
        isLoading={loading}
        onPress={handleOk}
        title="OK"
        third
      ></CustomButton>
    </View>
  );
}
