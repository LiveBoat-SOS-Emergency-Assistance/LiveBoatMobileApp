// filepath: d:\DATN\LiveBoatMobileApp\app\(main)\profile\ShareLocation.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Platform,
  PermissionsAndroid,
  AppState,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { getCurrentLocation, LocationResult } from "../../../utils/location";
import ImageCustom from "../../../components/Image/Image";

const ShareLocation = () => {
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationResult | null>(
    null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Debug log to see state changes
  console.log(
    "ShareLocation render - hasLocationPermission:",
    hasLocationPermission
  );

  useEffect(() => {
    checkLocationPermission();

    // Listen for app state changes to recheck permission when returning from settings
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        // Small delay to ensure settings changes are reflected
        setTimeout(checkLocationPermission, 500);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription?.remove();
    };
  }, []);

  // Monitor hasLocationPermission changes
  useEffect(() => {
    console.log(
      "hasLocationPermission state changed to:",
      hasLocationPermission
    );
  }, [hasLocationPermission]);
  const checkLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log("Location permission status:", granted);
      console.log(
        "Current hasLocationPermission state:",
        hasLocationPermission
      );
      setHasLocationPermission(granted);
      setIsLocationSharing(granted);
      console.log("After setState - should be:", granted);
    } else {
      // For iOS, assume permission is available (would need to implement proper check)
      setHasLocationPermission(true);
    }
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs access to your location for emergency services.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        console.log("Permission request result:", granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
          console.log("Permission granted, state should update to true");
          Alert.alert("Success", "Location permission granted!");
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            "Permission Required",
            "Location permission is required for emergency services. Please enable it in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        } else {
          Alert.alert("Permission Denied", "Location permission was denied.");
        }
      } catch (error) {
        console.warn("Permission request error:", error);
      }
    }
  };
  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      // Check permission first
      await checkLocationPermission();

      if (!hasLocationPermission) {
        Alert.alert(
          "Permission Required",
          "Please grant location permission first to enable location sharing.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Grant Permission",
              onPress: requestLocationPermission,
            },
          ]
        );
        return;
      }

      // Enable location sharing
      setIsGettingLocation(true);
      try {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          setIsLocationSharing(true);
          Alert.alert(
            "Location Sharing Enabled",
            "Your location is now being shared with authorized rescue teams."
          );
        } else {
          Alert.alert(
            "Location Error",
            "Could not get your current location. Please check your GPS settings."
          );
        }
      } catch (error) {
        Alert.alert(
          "Permission Required",
          "Location permission is required to share your location for safety purposes."
        );
      } finally {
        setIsGettingLocation(false);
      }
    } else {
      // Disable location sharing
      setIsLocationSharing(false);
      setCurrentLocation(null);
      Alert.alert(
        "Location Sharing Disabled",
        "Your location is no longer being shared."
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: 40 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
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
          Share Location
        </Text>
        <View className="w-9" />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 py-6">
        {/* Location Sharing Toggle Card */}
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: "#80C4E9" + "20" }}
                >
                  <Text className="text-xl">📍</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Location Sharing
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {isLocationSharing
                      ? "Currently sharing your location"
                      : "Enable to share location with rescue teams"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isLocationSharing}
                onValueChange={handleLocationToggle}
                thumbColor={isLocationSharing ? "#80C4E9" : "#f4f3f4"}
                trackColor={{ false: "#e5e7eb", true: "#80C4E9" + "40" }}
                disabled={isGettingLocation || !hasLocationPermission}
              />
            </View>

            {/* Status indicator */}
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  isLocationSharing ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <Text className="text-sm text-gray-600">
                {isGettingLocation
                  ? "Getting location..."
                  : isLocationSharing
                  ? "Active - Location being shared"
                  : "Inactive"}
              </Text>
            </View>

            {/* Current location display */}
            {currentLocation && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-sm text-gray-600 mb-2">
                  Current Position:
                </Text>
                <View className="bg-gray-50 p-3 rounded-lg">
                  <Text className="text-sm font-mono text-gray-700">
                    Lat: {currentLocation.latitude.toFixed(6)}
                  </Text>
                  <Text className="text-sm font-mono text-gray-700">
                    Lng: {currentLocation.longitude.toFixed(6)}
                  </Text>
                  {currentLocation.accuracy && (
                    <Text className="text-xs text-gray-500 mt-1">
                      Accuracy: ±{currentLocation.accuracy.toFixed(0)}m
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Device Permission Card */}
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{
                  backgroundColor: hasLocationPermission
                    ? "#10b981" + "20"
                    : "#f59e0b" + "20",
                }}
              >
                <ImageCustom
                  width={24}
                  height={24}
                  source={
                    hasLocationPermission
                      ? "https://img.icons8.com/?size=100&id=85&format=png&color=10b981"
                      : "https://img.icons8.com/?size=100&id=85&format=png&color=f59e0b"
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Device Permission
                </Text>
                <Text className="text-sm text-gray-500">
                  Location access for emergency services
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  hasLocationPermission
                    ? "bg-green-100 border-green-200"
                    : "bg-orange-100 border-orange-200"
                } border`}
              >
                <Text
                  className={`text-xs font-medium ${
                    hasLocationPermission ? "text-green-700" : "text-orange-700"
                  }`}
                >
                  {hasLocationPermission ? "✅ Granted" : "⚠️ Required"}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-600 mb-3">
              {hasLocationPermission
                ? "✅ Your device has granted location access. Location sharing is available."
                : "⚠️ Location permission is required to share your position during emergencies. Please grant permission to continue."}
            </Text>
            {!hasLocationPermission && (
              <View className="space-y-2">
                <TouchableOpacity
                  onPress={requestLocationPermission}
                  className="py-3 rounded-lg"
                  style={{ backgroundColor: "#80C4E9" }}
                >
                  <Text className="text-white text-center font-medium">
                    Request Permission
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={checkLocationPermission}
                  className="bg-gray-500 py-2 rounded-lg"
                >
                  <Text className="text-white text-center font-medium text-sm">
                    Recheck Permission
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Information Card */}
        <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <View className="flex-row items-start">
            <ImageCustom
              width={20}
              height={20}
              source="https://img.icons8.com/?size=100&id=85&format=png&color=3b82f6"
              className="mr-3 mt-0.5"
            />
            <View className="flex-1">
              <Text className="font-medium text-blue-800 mb-1">
                How it works
              </Text>
              <Text className="text-sm text-blue-700">
                When enabled, your location will be shared with authorized
                rescue teams and emergency services to help provide assistance
                when needed. You can disable this at any time.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShareLocation;
