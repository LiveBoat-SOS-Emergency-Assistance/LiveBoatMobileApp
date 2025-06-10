import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { Easing } from "react-native";
import { useAuth } from "../../context/AuthContext";
import MapboxGL from "@rnmapbox/maps";
import { userServices } from "../../services/user";
import { Profile } from "../../types/Profile";

interface BreathingAvatarProps {
  id?: string;
  size?: number;
  coordinate: [number, number];
  avatarUrl?: string | null;
  userType?: "SENDER" | "HELPER" | "NORMAL";
  onPress?: () => void;
  userData?: {
    userId: number;
    name?: string;
    phone?: string;
    accuracy?: number;
  };
  marker?: any;
}

const UserLocation = ({
  id,
  size = 50,
  coordinate,
  avatarUrl,
  userType = "NORMAL",
  onPress,
  userData,
  marker,
}: BreathingAvatarProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const { profile } = useAuth();
  const [profileUser, setSOSProfile] = React.useState<Profile | null>(null);

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    breathingAnimation.start();

    // Cleanup on unmount
    return () => {
      breathingAnimation.stop();
    };
  }, []);
  const getSOSProfile = async () => {
    try {
      // ✅ More robust validation
      if (!id) {
        console.log("No ID provided, skipping profile fetch");
        return;
      }

      const numericId = Number(id);
      if (isNaN(numericId) || numericId <= 0) {
        return;
      }
      const result = await userServices.getUserByID(numericId);

      if (result?.data) {
        setSOSProfile(result.data);
      } else {
        setSOSProfile(null);
      }
    } catch (error: any) {
      console.error("❌ Error fetching profile for ID:", id);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setSOSProfile(null); // ✅ Set null on error
    }
  };
  useEffect(() => {
    if (id) {
      getSOSProfile();
    }
  }, []);
  return (
    <MapboxGL.MarkerView
      coordinate={coordinate}
      id={id}
      allowOverlap={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.container, { width: size * 2, height: size * 2 }]}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
        onLongPress={() => {
          Vibration.vibrate(100);
          console.log("Marker long pressed");
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            opacity,
          }}
        >
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../assets/images/ava1.png")
            }
            style={[
              styles.avatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            resizeMode="cover"
            onError={() => console.log("Image failed to load")}
          />
        </Animated.View>
      </TouchableOpacity>
    </MapboxGL.MarkerView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default UserLocation;
