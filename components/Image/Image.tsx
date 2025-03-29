import { Image } from "react-native";
interface imageProps {
  source: any;
  width: number;
  height: number;
  color: string;
}
const ImageCustom = ({ source, width, height, color }: imageProps) => {
  return (
    <Image
      source={{ uri: source }}
      style={{ width: width, height: height, tintColor: color }}
    ></Image>
  );
};
export default ImageCustom;
