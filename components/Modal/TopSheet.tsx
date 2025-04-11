import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";

export interface TopSheetRef {
  open: () => void;
  close: () => void;
}

interface TopSheetProps {
  children: React.ReactNode;
}

const { width, height } = Dimensions.get("window");

const TopSheet = forwardRef<TopSheetRef, TopSheetProps>(({ children }, ref) => {
  const translateY = useRef(new Animated.Value(-height)).current;
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    close: () => {
      Animated.timing(translateY, {
        toValue: -height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    },
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          Animated.timing(translateY, {
            toValue: -height,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
          });
        }}
      />
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }], height: height / 3 },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: width,
    backgroundColor: "white",
    paddingVertical: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
});

export default TopSheet;
