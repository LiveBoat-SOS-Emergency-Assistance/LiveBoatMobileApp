import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { router } from "expo-router";

export default function SOSAlert() {
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      router.push("/(tabs)/home/sos_map");
      console.log("Emergency contacts notified!");
    }
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
          Cảnh báo SOS trong {countdown} giây
        </Text>
        <Text className="text-white opacity-90 text-center mt-1">
          Liên hệ khẩn cấp của bạn sẽ được thông báo.
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
