import React from "react";
import { View, StyleSheet, Image } from "react-native";

const UserSOS = () => {
  return <View className="w-[50px] h-[50px] bg-[#EB4747] rounded-full relative">
    <View className="w-[30px] h-[30px] bg-[#ef8585] rounded-full absolute"></View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2, // Make the container circular
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#EB4747",
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2, // Make the image circular
    objectFit: "cover", // Ensures the image covers the circle
  },
});

export default UserSOS;
