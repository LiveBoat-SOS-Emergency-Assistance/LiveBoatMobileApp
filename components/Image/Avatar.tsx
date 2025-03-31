import { Image } from "react-native";
import React from "react";
const Avatar = (source: string) => {
  return <Image source={{ uri: "${source}" }}></Image>;
};
export default Avatar;
