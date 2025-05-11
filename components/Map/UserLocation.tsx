import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Image } from "react-native";
import { Easing } from "react-native";
import { useAuth } from "../../context/AuthContext";
import MapboxGL from "@rnmapbox/maps";

interface BreathingAvatarProps {
  id?: string;
  size?: number;
  coordinate: [number, number];
  avatarUrl?: string | null;
  userType?: "SENDER" | "HELPER" | "NORMAL";
}

const UserLocation = ({
  id,
  size = 60,
  coordinate,
  avatarUrl,
  userType = "NORMAL",
}: BreathingAvatarProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const { profile } = useAuth();

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

  return (
    <MapboxGL.MarkerView
      coordinate={coordinate}
      id={id}
      allowOverlap={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={[styles.container, { width: size * 2, height: size * 2 }]}>
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
      </View>
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
