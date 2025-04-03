import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

interface BottomSheetBackgroundProps {
  style?: StyleProp<ViewStyle>; // Use StyleProp<ViewStyle> to match @gorhom/bottom-sheet
}

const BottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  return (
    <View
      style={[
        {
          backgroundColor: "white",
          borderRadius: 30,
          overflow: "hidden",
        },
        style,
      ]}
    />
  );
};

export default BottomSheetBackground;
