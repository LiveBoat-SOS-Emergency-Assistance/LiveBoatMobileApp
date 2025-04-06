import React from "react";
import { View, StyleSheet, Image } from "react-native";

const UserSOS = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={require("../../assets/images/ava.jpg")}
      />
    </View>
  );
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
