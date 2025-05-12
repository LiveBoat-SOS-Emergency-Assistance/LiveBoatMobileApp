import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Marker {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  userType: "SENDER" | "HELPER" | "NORMAL";
  avatarUrl: string;
}
const PopupCallout = ({ marker }: { marker: Marker }) => {
  return (
    <View style={styles.calloutContainer}>
      <Text style={styles.calloutTitle}>User ID: {marker.userId}</Text>
      <Text style={styles.calloutSubtitle}>Type: {marker.userType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: "gray",
  },
});

export default PopupCallout;
