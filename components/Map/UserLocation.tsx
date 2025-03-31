"use client";

import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Image } from "react-native";
import React from "react";

const UserLocation = () => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Start breathing animation when component mounts
  useEffect(() => {
    const breathingAnimation = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Repeat animation
        breathingAnimation();
      });
    };

    breathingAnimation();

    return () => {
      // Clean up animations when component unmounts
      pulseAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [pulseAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      {/* Outer pulsing effect */}
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Avatar image with breathing effect */}
      <Animated.Image
        source={require("../../assets/images/ava.jpg")}
        style={[styles.avatar, { transform: [{ scale: pulseAnim }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(47, 128, 237, 0.3)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default UserLocation;
