import { Tabs, useSegments } from "expo-router";
import { View, Image, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import SOSButton from "../../components/Button/SOSButton";
export default function BottomNavigation() {
  const segments = useSegments();
  const hiddenScreens = ["SOSAlert", "SOSMap", "SOSDisable", "DetailSOS"];
  const isHiddenScreen = hiddenScreens.some((screen) =>
    segments.includes(screen)
  );
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Listeners to detect when keyboard is shown or hidden
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: keyboardVisible || isHiddenScreen ? "none" : "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingTop: 9,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{
                  uri: focused
                    ? "https://img.icons8.com/?size=100&id=1iF9PyJ2Thzo&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=i6fZC6wuprSu&format=png&color=000000",
                }}
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="donation"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Image
              source={{
                uri: focused
                  ? "https://img.icons8.com/?size=100&id=dZwO2-lkM3J9&format=png&color=000000"
                  : "https://img.icons8.com/?size=100&id=zmfk43iZi7vp&format=png&color=000000",
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sos"
        options={{
          tabBarButton: () => <SOSButton />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Image
              source={{
                uri: focused
                  ? "https://img.icons8.com/?size=100&id=vQspTGjsVYyP&format=png&color=000000"
                  : "https://img.icons8.com/?size=100&id=QCWNw21jG46E&format=png&color=000000",
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Image
              source={{
                uri: focused
                  ? "https://img.icons8.com/?size=100&id=vbXKYp7uRqsa&format=png&color=000000"
                  : "https://img.icons8.com/?size=100&id=S4vnVXrf0zlO&format=png&color=000000",
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
