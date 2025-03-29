import React, { useRef, useState } from "react";
import { View, TextInput } from "react-native";

interface PinProps {
  onComplete: (pin: string) => void;
}

const PinInput = ({ onComplete }: PinProps) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    let newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.join("").length === 4) {
      onComplete(newPin.join(""));
    }
  };

  return (
    <View className="flex-row justify-center  gap-3 pt-10">
      {pin.map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-[64px] h-[64px] border border-[#D9D9D9] outline-none text-center  text-2xl rounded-[5px]"
          keyboardType="number-pad"
          maxLength={1}
          value={pin[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && !pin[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </View>
  );
};

export default PinInput;
