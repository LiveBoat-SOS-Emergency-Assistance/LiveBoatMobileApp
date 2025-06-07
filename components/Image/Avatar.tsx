import { Image, ImageSourcePropType, ImageStyle } from "react-native";
import React from "react";

interface imageProps {
  source?: ImageSourcePropType | string;
  className?: string;
  width?: number;
  height?: number;
  style?: ImageStyle;
}

const Avatar = ({
  source,
  width = 100,
  height = 100,
  className,
  style = {},
}: imageProps) => {
  const imageSource =
    typeof source === "string"
      ? { uri: source }
      : source || require("../../assets/images/ava1.png");

  return (
    <Image
      className={`rounded-full object-cover ${className ?? ""}`}
      source={imageSource}
      style={[{ width, height }, style]}
    />
  );
};

export default Avatar;
