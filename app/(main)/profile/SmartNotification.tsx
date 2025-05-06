import { Alert, Switch, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
import { getApp, getApps, initializeApp } from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";

const SmartNotification = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const ensureFirebaseApp = () => {
    if (getApps().length === 0) {
      throw new Error(
        "Firebase app has not been initialized. Make sure native setup is correct."
      );
    }
    return getApp();
  };
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await checkNotifications();
      if (status === "granted") {
        try {
          const app = ensureFirebaseApp();
          const messaging = getMessaging(app);
          const token = await messaging.getToken();
          console.log("FCM Token:", token);
          setIsEnabled(true);
        } catch (error) {
          console.error("Failed to get token:", error);
        }
      }
    };

    checkPermission();
  }, []);
  const toggleSwitch = async () => {
    if (!isEnabled) {
      const { status } = await requestNotifications(["alert", "sound"]);
      if (status === "granted") {
        try {
          const app = ensureFirebaseApp();
          const messaging = getMessaging(app);
          const token = await messaging.getToken();
          console.log("FCM Token:", token);
          Alert.alert("Notifications Enabled!");
          setIsEnabled(true);
        } catch (error) {
          console.error("Error getting token:", error);
          Alert.alert("Failed to enable notifications");
        }
      } else {
        Alert.alert("You need to grant notification permissions");
      }
    } else {
      Alert.alert("Notifications Disabled");
      setIsEnabled(false);
    }
  };

  return (
    <View className="flex-1  bg-white px-4">
      <Text className="text-xl font-bold mb-4">Smart Notification</Text>
      <View className="flex-row items-center">
        <Text className="text-base mr-2">Turn on notifications</Text>
        <Switch
          trackColor={{ false: "#ccc", true: "#4ade80" }}
          thumbColor={isEnabled ? "#10b981" : "#f4f3f4"}
          ios_backgroundColor="#ccc"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};
export default SmartNotification;
