import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";

interface MarkerPopupProps {
  visible: boolean;
  marker: {
    userId: number;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    userType: "SENDER" | "HELPER" | "NORMAL";
    avatarUrl: string;
    name?: string;
    phone?: string;
    status?: string;
  } | null;
  onClose: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  onGetDirections?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MarkerPopup: React.FC<MarkerPopupProps> = ({
  visible,
  marker,
  onClose,
  onCall,
  onMessage,
  onGetDirections,
}) => {
  if (!visible || !marker) return null;
  console.log("MarkerPopup rendered with marker:", marker);
  const getStatusColor = (userType: string) => {
    switch (userType) {
      case "SENDER":
        return "#EF4444"; // Red for SOS
      case "HELPER":
        return "#10B981"; // Green for Helper
      case "NORMAL":
        return "#6B7280"; // Gray for Normal
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (userType: string) => {
    switch (userType) {
      case "SENDER":
        return "SOS Signal";
      case "HELPER":
        return "Rescuer";
      case "NORMAL":
        return "User";
      default:
        return "Unknown";
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.popupContainer}>
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Avatar
                  source={marker.avatarUrl}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {marker.name || `User ${marker.userId}`}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(marker.userType) },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {getStatusText(marker.userType)}
                    </Text>
                  </View>
                  {marker.phone && (
                    <Text style={styles.phoneText}>{marker.phone}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=83149&format=png&color=000000"
                  width={20}
                  height={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Location Info */}
            <View style={styles.locationInfo}>
              <View style={styles.coordinateItem}>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=13800&format=png&color=000000"
                  width={16}
                  height={16}
                  color="#6B7280"
                />
                <Text style={styles.coordinateText}>
                  {typeof marker.latitude === "number" &&
                  !isNaN(marker.latitude)
                    ? marker.latitude.toFixed(6)
                    : "N/A"}
                  ,{" "}
                  {typeof marker.longitude === "number" &&
                  !isNaN(marker.longitude)
                    ? marker.longitude.toFixed(6)
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.coordinateItem}>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=85471&format=png&color=000000"
                  width={16}
                  height={16}
                  color="#6B7280"
                />
                <Text style={styles.coordinateText}>
                  Accuracy: ±{marker.accuracy || 0}m
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {onCall && (
                <TouchableOpacity style={styles.actionButton} onPress={onCall}>
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=9730&format=png&color=000000"
                    width={20}
                    height={20}
                    color="#10B981"
                  />
                  <Text style={[styles.actionText, { color: "#10B981" }]}>
                    Call
                  </Text>
                </TouchableOpacity>
              )}
              {onMessage && marker.userType === "SENDER" && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onMessage}
                >
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=85500&format=png&color=000000"
                    width={20}
                    height={20}
                    color="#3B82F6"
                  />
                  <Text style={[styles.actionText, { color: "#3B82F6" }]}>
                    Help
                  </Text>
                </TouchableOpacity>
              )}
              {onGetDirections && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onGetDirections}
                >
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=7880&format=png&color=000000"
                    width={20}
                    height={20}
                    color="#8B5CF6"
                  />
                  <Text style={[styles.actionText, { color: "#8B5CF6" }]}>
                    Directions
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    elevation: 999999, // Thêm elevation cho Android
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0,0.4)",
    zIndex: -1, // Đảm bảo backdrop nằm dưới popup
  },
  popupContainer: {
    width: screenWidth * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 1000, // Elevation cao cho Android
    zIndex: 1, // zIndex cho popup container
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  blurContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  phoneText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  locationInfo: {
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  coordinateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  coordinateText: {
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 8,
    fontFamily: "monospace",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    minWidth: 70,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default MarkerPopup;
