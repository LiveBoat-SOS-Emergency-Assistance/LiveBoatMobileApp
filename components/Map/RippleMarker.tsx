import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Image/Avatar";
import { userServices } from "../../services/user";
import { Profile } from "../../types/Profile";
interface RippleMarkerProps {
  id?: string;
  coordinate: [number, number];
  type?: string;
  isRescuer?: boolean;
  onPress?: () => void;
  isOnline?: boolean;
  marker?: any;
  avatarUrl?: string;
}

const RippleMarker = ({
  id,
  coordinate,
  type,
  isRescuer,
  onPress,
  isOnline = true,
  marker,
  avatarUrl,
}: RippleMarkerProps) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const [sosProfile, setSOSProfile] = useState<Profile | null>(null);
  const { profile } = useAuth();
  console.log("RippleMarker 41, isONline", isOnline);
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
  useEffect(() => {
    const createRipple = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rippleScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createRipple();
  }, []);
  return (
    <MapboxGL.MarkerView coordinate={coordinate} id={id} allowOverlap={true}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          console.log("RippleMarker pressed!", id);
          if (onPress) {
            console.log("Calling onPress callback");
            onPress();
          } else {
            console.log("No onPress callback provided");
          }
        }}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
              backgroundColor: isRescuer
                ? "rgba(0, 0, 255, 0.4)"
                : !isRescuer && isOnline
                ? "rgba(255, 0, 0, 0.4)"
                : "rgba(200, 200, 200, 1)",
            },
          ]}
        />
        <View
          style={[
            styles.centerDot,
            {
              backgroundColor: isOnline ? "red" : "#808080",
            },
          ]}
        >
          {
            id === sosProfile?.id && sosProfile?.User?.avatar_url && (
              <Avatar
                source={sosProfile.User.avatar_url}
                width={50}
                height={50}
                style={{
                  opacity: isOnline ? 1 : 0.5,
                }}
              />
            )
            /* {userIDSOS && (
            <Avatar
              source={sosProfile?.User?.avatar_url}
              width={50}
              height={50}
              style={{
                opacity: isOnline ? 1 : 0.5,
              }}
            ></Avatar>
          )} */
          }
          {/* {userIDSOS && sosProfile?.User?.avatar_url ? (
            <Avatar
              source={sosProfile.User.avatar_url}
              width={50}
              height={50}
              style={{
                opacity: isOnline ? 1 : 0.5,
              }}
            />
          ) : (
            <Avatar
              source={require("../../assets/images/ava1.png")}
              width={50}
              height={50}
              style={{
                opacity: isOnline ? 1 : 0.5,
              }}
            />
          )} */}
        </View>
      </TouchableOpacity>
    </MapboxGL.MarkerView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  centerDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default RippleMarker;
