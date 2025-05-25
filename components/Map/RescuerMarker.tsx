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
import { Profile } from "../../types/Profile";
interface RippleMarkerProps {
  id: string;
  coordinate: [number, number];
  type?: string;
  zoomLevel: number;
  userIDSOS?: number;
  avatarUrl?: string | null;
  name?: string;
  phone?: string;

  onPress?: () => void;
}

const RescuerMarker = ({
  id,
  coordinate,
  type,
  zoomLevel,
  userIDSOS,
  avatarUrl,
  phone,
  onPress,
}: RippleMarkerProps) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;

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
          if (onPress) {
            onPress();
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
              backgroundColor: "rgba(0, 0, 255, 0.4)",
            },
          ]}
        />
        <View style={styles.centerDot}>
          <Avatar source={avatarUrl!} width={50} height={50}></Avatar>
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  centerDot: {
    width: 55,
    height: 55,
    borderRadius: 25,
    backgroundColor: "#80C4E9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default RescuerMarker;
