import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, Image } from "react-native";
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
}

const RescuerMarker = ({
  id,
  coordinate,
  type,
  zoomLevel,
  userIDSOS,
}: RippleMarkerProps) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const [sosProfile, setSOSProfile] = useState<Profile | null>(null);
  const { profile } = useAuth();
  // console.log(userIDSOS);

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
    <MapboxGL.MarkerView coordinate={coordinate} id={id}>
      <View style={styles.container}>
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
        <View style={styles.centerDot}></View>
      </View>
    </MapboxGL.MarkerView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 85,
  },
  centerDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default RescuerMarker;
