import { AlertTriangle } from "lucide-react-native";
import { Pressable, View, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import React from "react";
const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Tạo mảng chứa các giá trị animation cho nhiều sóng
  const waves = Array.from({ length: 3 }).map(() => ({
    scale: useRef(new Animated.Value(1)).current,
    opacity: useRef(new Animated.Value(0.5)).current,
  }));

  // Tham chiếu để dừng animation
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startWaveAnimation = () => {
    const animations = waves.map((wave, index) =>
      Animated.sequence([
        Animated.delay(index * 500),
        Animated.parallel([
          Animated.timing(wave.scale, {
            toValue: 5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(wave.opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(wave.scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(wave.opacity, {
          toValue: 0.5,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animationRef.current = Animated.loop(Animated.stagger(500, animations));
    animationRef.current.start();
  };

  const stopWaveAnimation = () => {
    animationRef.current?.stop();
    waves.forEach((wave) => {
      wave.scale.setValue(1);
      wave.opacity.setValue(0.5);
    });
  };

  const handlePressIn = () => {
    setIsPressed(true);
    startWaveAnimation();

    const newTimer = setTimeout(() => {
      router.push("/(tabs)/home/sos_alert");
    }, 3000);
    setTimer(newTimer);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    stopWaveAnimation();
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 25,
        alignSelf: "center",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFDEDE",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Hiệu ứng nhiều sóng tỏa ra */}
      {isPressed &&
        waves.map((wave, index) => (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#FF8B8B",
              transform: [{ scale: wave.scale }],
              opacity: wave.opacity,
            }}
          />
        ))}

      {/* Nút chính */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#EB4747",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
        }}
      >
        <AlertTriangle size={32} color="white" />
      </Pressable>
    </View>
  );
};

export default SOSButton;
