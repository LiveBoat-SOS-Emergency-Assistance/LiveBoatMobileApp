import {
  Alert,
  Switch,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
import { getApp, getApps, initializeApp } from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";

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
          Alert.alert(
            "🎉 Success!",
            "Notifications enabled successfully. You'll receive important rescue and safety updates.",
            [{ text: "Great!", style: "default" }]
          );
          setIsEnabled(true);
        } catch (error) {
          console.error("Error getting token:", error);
          Alert.alert(
            "🚫 Error",
            "Unable to enable notifications. Please try again later.",
            [{ text: "Got it", style: "default" }]
          );
        }
      } else {
        Alert.alert(
          "🔔 Permission Required",
          "To receive emergency rescue notifications, please allow the app to send notifications.",
          [
            { text: "Maybe Later", style: "cancel" },
            { text: "Open Settings", style: "default" },
          ]
        );
      }
    } else {
      Alert.alert(
        "🚫 Disable Notifications",
        "Are you sure you want to disable notifications? You might miss important emergency alerts.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => setIsEnabled(false),
          },
        ]
      );
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <View className="flex-row items-center pt-10 justify-between px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ImageCustom
            width={20}
            height={20}
            source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          Notifications
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View className="mx-4 mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Icon and Title */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <ImageCustom
                width={40}
                height={40}
                source="https://img.icons8.com/?size=100&id=87&format=png&color=3b82f6"
              />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Smart Notifications
            </Text>
            <Text className="text-gray-500 text-center leading-6">
              Stay updated with important alerts, emergency notifications, and
              rescue updates
            </Text>
          </View>

          {/* Main Toggle */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  Push Notifications
                </Text>
                <Text className="text-sm text-gray-500">
                  Receive alerts and updates instantly
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#e5e7eb"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
              />
            </View>
          </View>

          {/* Status Indicator */}
          <View
            className={`flex-row items-center justify-center p-3 rounded-xl ${
              isEnabled ? "bg-green-50" : "bg-orange-50"
            }`}
          >
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                isEnabled ? "bg-green-500" : "bg-orange-500"
              }`}
            />
            <Text
              className={`text-sm font-medium ${
                isEnabled ? "text-green-700" : "text-orange-700"
              }`}
            >
              {isEnabled
                ? "Notifications are enabled"
                : "Notifications are disabled"}
            </Text>
          </View>
        </View>

        {/* Features List */}
        <View className="mx-4 mt-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            What you'll receive:
          </Text>

          <View className="space-y-7 gap-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                <ImageCustom
                  width={20}
                  height={20}
                  source="https://img.icons8.com/?size=100&id=63308&format=png&color=ef4444"
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Emergency Alerts
                </Text>
                <Text className="text-sm text-gray-500">
                  Critical safety notifications
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <ImageCustom
                  width={20}
                  height={20}
                  source="https://img.icons8.com/?size=100&id=85500&format=png&color=3b82f6"
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Rescue Updates
                </Text>
                <Text className="text-sm text-gray-500">
                  Live rescue operation status
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <ImageCustom
                  width={20}
                  height={20}
                  source="https://img.icons8.com/?size=100&id=132&format=png&color=22c55e"
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Safety Tips</Text>
                <Text className="text-sm text-gray-500">
                  Weather and safety advisories
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <ImageCustom
                  width={20}
                  height={20}
                  source="https://img.icons8.com/?size=100&id=85467&format=png&color=8b5cf6"
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Community Updates
                </Text>
                <Text className="text-sm text-gray-500">
                  Squad and team notifications
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Privacy Note */}
        <View className="mx-4 mt-4 mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <View className="flex-row items-start">
            <ImageCustom
              width={16}
              height={16}
              source="https://img.icons8.com/?size=100&id=63112&format=png&color=3b82f6"
              className="mt-1 mr-2"
            />
            <View className="flex-1">
              <Text className="text-sm font-medium text-blue-800 mb-1">
                Privacy Protected
              </Text>
              <Text className="text-xs text-blue-600 leading-4">
                Your notification preferences are secure and you can change them
                anytime in your device settings.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SmartNotification;
