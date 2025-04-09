import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
interface InputProps extends TextInputProps {
  placeholder?: string;
  type?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  errorPassword?: string;
  keyboardType?: any;
}

const Input = ({
  type,
  placeholder,
  value,
  onChangeText,
  error,
  errorPassword,
  keyboardType,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View className="w-[90%]">
      <View
        className={`w-full border h-[48px] rounded-[5px] px-4 outline-none flex relative justify-center ${
          error
            ? "border-red-500"
            : focused
            ? "border-blue-500"
            : "border-[#D9D9D9]"
        }`}
      >
        <TextInput
          value={value}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          // keyboardType={type === "email" ? "email-address" : "default"}
          placeholder={placeholder}
          secureTextEntry={type === "password" && !isPasswordVisible}
          // autoCapitalize={type === "email" ? "none" : "sentences"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {type === "password" && (
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-2"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <Eye width={20} height={20} stroke="#555" />
            ) : (
              <EyeOff width={20} height={20} stroke="#555" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && type === "email" && (
        <Text className="text-red-500 text-[12px] w-[90%] justify-start text-start pt-1">
          Email không hợp lệ
        </Text>
      )}
      {error && type === "phone" && (
        <Text className="text-red-500 text-[12px] w-[90%] justify-start text-start pt-1">
          Số điện thoại không hợp lệ
        </Text>
      )}
      {type === "password" && errorPassword && (
        <Text className="text-red-500 text-[12px] w-[90%] justify-start text-start pt-1">
          {errorPassword}
        </Text>
      )}
    </View>
  );
};

export default Input;
