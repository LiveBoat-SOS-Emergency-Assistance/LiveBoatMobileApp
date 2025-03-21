import { View, Image } from "react-native";
import tw from "twrnc";
import ImageCustom from "./Image";

const Logo = () => {
  return (
    <View
      style={tw.style(
        "w-[60px] h-[60px] bg-[#ed5a5a] rounded-[90px] flex justify-center items-center"
      )}
    >
      <ImageCustom
        source="https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png"
        width={30}
        height={30}
        color="#ffffff"
      ></ImageCustom>
    </View>
  );
};

export default Logo;
