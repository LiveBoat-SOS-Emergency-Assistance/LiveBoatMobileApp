import { Tabs, useSegments } from "expo-router";
import { View, Image } from "react-native";
import React from "react";
import SOSButton from "../../components/Button/SOSButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
export default function BottomNavigation() {
  const segments = useSegments();
  const hiddenScreens = ["sos_alert", "sos_map"];
  const isHiddenScreen = hiddenScreens.some((screen) =>
    segments.includes(screen)
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: isHiddenScreen ? "none" : "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
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
          tabBarIcon: ({ focused }) => (
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
          tabBarIcon: ({ focused }) => (
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
          tabBarIcon: ({ focused }) => (
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
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
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
