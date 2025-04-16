import React, { useRef, useEffect } from "react";
import { View, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import ImageCustom from "../Image/Image";

interface SlideToCancelProps {
  onCancel: () => void;
}

const SlideToCancel = ({ onCancel }: SlideToCancelProps) => {
  const translateX = useSharedValue(0);
  const viewRef = useRef<View>(null);
  const [buttonWidth, setButtonWidth] = React.useState(250); // Initial default value

  // Measure the actual width after layout
  useEffect(() => {
    viewRef.current?.measure((x, y, width) => {
      setButtonWidth(width);
    });
  }, []);

  const maxSwipe = -1 * (buttonWidth - 80); // Swipe threshold

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = Math.max(Math.min(event.translationX, 0), maxSwipe);
      translateX.value = newValue;
    })
    .onEnd(() => {
      if (translateX.value <= maxSwipe * 0.8) {
        runOnJS(onCancel)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 100 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      ref={viewRef}
      className="absolute bottom-5 w-[80%] mt-5"
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setButtonWidth(width);
      }}
    >
      <View className="w-full h-[60px] bg-[#80C4E9] rounded-[40px] flex items-center justify-center relative">
        <Text className="text-white text-lg italic font-bold">
          Slide to Cancel
        </Text>

        <GestureDetector gesture={gesture}>
          <Animated.View
            className="w-[50px] h-[50px] bg-white rounded-full border-[#80C4E9] flex items-center justify-center absolute right-3"
            style={animatedStyle}
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=85459&format=png&color=000000"
              width={24}
              height={24}
              color="#80C4E9"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

export default SlideToCancel;
