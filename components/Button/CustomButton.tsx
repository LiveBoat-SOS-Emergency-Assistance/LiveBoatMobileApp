import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  Text,
} from "react-native";
import tw from "twrnc";

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  third?: boolean;
  title: string;
  isLoading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const CustomButton = ({
  primary,
  secondary,
  third,
  title,
  isLoading,
  onPress,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        "w-[100%] h-14 rounded-full justify-center items-center shadow-md text-[18px]",
        primary ? "bg-[#ed5a5a]" : "bg-gray-400",
        secondary ? "bg-white border border-[#D9D9D9]" : "",
        third ? "bg-[#80C4E9]" : ""
      )}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text
          style={tw.style(
            " font-bold text-lg",
            (primary || third) && "text-white",
            secondary && "text-[#404040]"
          )}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;
