import { Image } from "react-native";
import React from "react";
interface imageProps {
  source: string | any;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const ImageCustom = ({
  source,
  width,
  height,
  color,
  className,
}: imageProps) => {
  const isUri = typeof source === "string";
  return (
    <Image
      source={isUri ? { uri: source } : source}
      style={{ width: width, height: height, tintColor: color }}
      className={className}
    ></Image>
  );
};
export default ImageCustom;
