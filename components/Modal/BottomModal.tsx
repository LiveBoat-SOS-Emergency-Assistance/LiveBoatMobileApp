import { MotiView } from "moti";
import { ReactNode, useState, useEffect } from "react";
import React from "react";
import { View, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
interface BottomModalProps {
  children: ReactNode;
  onClose?: () => void;
  initialExpanded?: boolean;
  collapsedHeight?: number;
  expandedHeight?: number;
  color?: string;
}
const BottomModal = ({
  children,
  initialExpanded = false,
  collapsedHeight = 27,
  expandedHeight = 65,
  color = "#FFD9D9",
}: BottomModalProps) => {
  const initialHeight = initialExpanded ? expandedHeight : collapsedHeight;
  const height = useSharedValue(initialHeight);
  const isExpanded = useSharedValue(initialExpanded);

  const windowHeight = useSharedValue(Dimensions.get("window").height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      windowHeight.value = window.height;
    });

    return () => subscription.remove();
  }, []);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      if (event.translationY < -20 && !isExpanded.value) {
        height.value = withSpring(expandedHeight, { damping: 15 });
        isExpanded.value = true;
      } else if (event.translationY > 20 && isExpanded.value) {
        height.value = withSpring(collapsedHeight, { damping: 15 });
        isExpanded.value = false;
      }
    },
    onEnd: () => {},
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: `${height.value}%`,
      bottom: 0,
    };
  });

  return (
    <View className="absolute inset-0 flex justify-center items-end">
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: color,
              padding: 16,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            animatedStyle,
          ]}
        >
          <View className="w-full items-center pb-4">
            <View className="w-10 h-1 bg-[#EB4747] rounded-full" />
          </View>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            {children}
          </MotiView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default BottomModal;
