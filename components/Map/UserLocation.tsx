"use client";
import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

const UserLocation = () => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity1 = useSharedValue(1);
  const opacity2 = useSharedValue(1);

  useEffect(() => {
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );

    scale2.value = withRepeat(
      withSequence(
        withTiming(1.7, { duration: 900, easing: Easing.ease }),
        withTiming(1, { duration: 900, easing: Easing.ease })
      ),
      -1,
      true
    );

    opacity1.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );

    opacity2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 900, easing: Easing.ease }),
        withTiming(1, { duration: 900, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  return (
    <View style={styles.container}>
      {/* Vòng tròn ngoài tạo hiệu ứng mạnh hơn */}
      <Animated.View style={[styles.pulseCircle, pulseStyle2]} />
      <Animated.View style={[styles.pulseCircle, pulseStyle1]} />

      {/* Ảnh đại diện */}
      <Animated.Image
        source={require("../../assets/images/ava.jpg")}
        style={[styles.avatar, pulseStyle1]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(47, 128, 237, 0.3)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default UserLocation;
