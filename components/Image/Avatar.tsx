import { Image } from "react-native";
import React from "react";

interface imageProps {
  source?: any;
  width?: number;
  height?: number;
}
const Avatar = ({ source, width, height }: imageProps) => {
  return (
    <Image
      className=" rounded-full object-cover"
      source={require("../../assets/images/ava.jpg")}
      style={{ width: width, height: height }}
    />
  );
};
export default Avatar;
