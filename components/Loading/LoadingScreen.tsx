import React from "react";
import { Image } from "react-native";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Đang tải...",
}) => {
  return (
    <View style={styles.container}>
      {/* <Image
        width={100}
        height={100}
        style={{ width: 100, height: 100, marginBottom: 16 }}
        source={require("../../assets/images/liveboatappicon.png")}
      ></Image> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
});

export default LoadingScreen;
