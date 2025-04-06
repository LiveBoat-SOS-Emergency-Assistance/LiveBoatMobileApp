import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { router } from "expo-router";
import MapboxGL, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";
import { sos } from "../../../utils/request";
import { sosService } from "../../../services/sos";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function SOSAlert() {
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [location, setLocation] = useState<[number, number, number] | null>(
    null
  );
  const getCurrentLocation = async () => {
    try {
      const userLocation =
        await MapboxGL.locationManager.getLastKnownLocation();
      if (userLocation) {
        const { longitude, latitude, accuracy } = userLocation.coords;

        if (longitude && latitude && accuracy !== undefined) {
          setLocation([longitude, latitude, accuracy]);
          console.log("SOS location:", [longitude, latitude, accuracy]);
          const result = await sosService.sos_create({
            longitude: longitude,
            latitude: latitude,
            accuracy: accuracy,
          });
          console.log("SOS result:", result);
          const sosId = result.data.id;
          await AsyncStorage.setItem("sosId", sosId);
          await AsyncStorage.setItem("longitudeSOS", longitude.toString());
          await AsyncStorage.setItem("latitudeSOS", latitude.toString());
          await AsyncStorage.setItem("accuracySOS", accuracy.toString());

          router.push("/(tabs)/home/sos_map");
        } else {
          console.error("Location data is missing.");
        }
      }
    } catch (error) {
      console.error("Lỗi lấy vị trí:", error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const startSOSProcess = async () => {
      if (isActive && countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (countdown === 0) {
        try {
          await getCurrentLocation();
        } catch (error: any) {
          console.log(error.message);
        }
      }
    };

    startSOSProcess();
    return () => clearTimeout(timer);
  }, [countdown, isActive]);

  const handleCancel = () => {
    setIsActive(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#EB4747] justify-center items-center p-5 relative">
      <View className="items-center mb-12">
        <AlertTriangle color="white" size={48} />
        <Text className="text-white text-2xl font-bold mt-2">
          SOS Alert in {countdown} seconds
        </Text>
        <Text className="text-white opacity-90 text-center mt-1">
          Your emergency contacts will be notified.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleCancel}
        className="bg-white py-4 px-10 rounded-full w-full items-center absolute bottom-[150px]"
      >
        <Text className="text-[#EB4747] font-bold text-lg">CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
}
