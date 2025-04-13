import { Image } from "react-native";
import React from "react";

interface imageProps {
  source?: string;
  className?: string;
  width?: number;
  height?: number;
}
const Avatar = ({
  source,
  width = 100,
  height = 100,
  className,
}: imageProps) => {
  const imageSource = source
    ? { uri: source }
    : require("../../assets/images/ava1.png");

  return (
    <Image
      className={`rounded-full object-cover${className}`}
      source={imageSource}
      style={{ width: width, height: height }}
    />
  );
};
export default Avatar;
