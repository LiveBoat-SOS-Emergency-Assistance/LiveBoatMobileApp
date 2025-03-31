import { Image } from "react-native";
import React from "react";
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
