import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import React from "react";
const OTPCountdown = () => {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOTP = () => {
    if (canResend) {
      setCountdown(30);
      setCanResend(false);
    }
  };

  return (
    <View className="flex flex-row gap-1 items-center">
      <Text className="text-[#404040] text-[12px]">
        {canResend ? "You can resend the code!" : "Resend code after:"}
      </Text>
      <Pressable onPress={handleResendOTP} disabled={!canResend}>
        <Text
          className={`text-[14px] font-bold ${
            canResend ? "text-[#639dbc]" : "text-[#80C4E9]"
          }`}
        >
          {canResend
            ? "Resend Code"
            : `00:${countdown.toString().padStart(2, "0")}`}
        </Text>
      </Pressable>
    </View>
  );
};

export default OTPCountdown;
