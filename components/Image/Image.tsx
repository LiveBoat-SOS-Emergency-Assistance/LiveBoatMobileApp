import { Image } from "react-native";
import React from "react";
interface imageProps {
  source: any;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const ImageCustom = ({ source, width, height, color, className }: imageProps) => {
  return (
    <Image
      source={{ uri: source }}
      style={{ width: width, height: height, tintColor: color }}
      className={className}
    ></Image>
  );
};
export default ImageCustom;
