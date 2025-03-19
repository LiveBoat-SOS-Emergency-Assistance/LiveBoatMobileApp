import { GestureResponderEvent, Pressable, Text } from "react-native";
import tw from "twrnc";

interface ButtonProps {
  primary: boolean;
  secondary: boolean;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton = ({ primary, secondary, title, onPress }: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        "w-[100%] h-14 rounded-full justify-center items-center shadow-md text-[18px]",
        primary ? "bg-[#eb4747]" : "bg-gray-400",
        secondary ? "bg-white border border-[#D9D9D9]" :""
      )}
    >
      <Text style={tw.style(" font-bold text-lg",  primary && "text-white", secondary && "text-[#404040]")}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
