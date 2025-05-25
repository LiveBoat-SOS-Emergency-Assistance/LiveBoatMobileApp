import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";

export type LocationResult = {
  longitude: number;
  latitude: number;
  accuracy?: number;
};

// Helper: check if location service (GPS) is enabled (Android only)
const isLocationServiceEnabled = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return true;
  try {
    const { LocationManager } = NativeModules;
    if (LocationManager && LocationManager.isLocationEnabled) {
      return await LocationManager.isLocationEnabled();
    }
    // Fallback: try to get location, if error, assume disabled
    return true;
  } catch {
    return true;
  }
};

export const getCurrentLocation = async (): Promise<LocationResult | null> => {
  try {
    if (Platform.OS === "android") {
      // 1. Check permission
      let granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      while (!granted) {
        await new Promise((resolve) => {
          Alert.alert(
            "Location Permission Required",
            "This app needs access to your location. Please enable location permission in Settings.",
            [
              { text: "Cancel", style: "cancel", onPress: resolve },
              {
                text: "Open Settings",
                onPress: async () => {
                  await Linking.openSettings();
                  resolve(undefined);
                },
              },
            ],
            { cancelable: false }
          );
        });
        granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
      // 2. Check if location service (GPS) is enabled
      let enabled = await isLocationServiceEnabled();
      while (!enabled) {
        await new Promise((resolve) => {
          Alert.alert(
            "Location Service Disabled",
            "Please enable Location (GPS) in your device settings to use this feature.",
            [
              { text: "Cancel", style: "cancel", onPress: resolve },
              {
                text: "Open Settings",
                onPress: async () => {
                  await Linking.openSettings();
                  resolve(undefined);
                },
              },
            ],
            { cancelable: false }
          );
        });
        enabled = await isLocationServiceEnabled();
      }
    }

    let userLocation = await MapboxGL.locationManager.getLastKnownLocation();

    while (!userLocation) {
      if (Platform.OS === "android") {
        let granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (!granted) {
          await new Promise((resolve) => {
            Alert.alert(
              "Location Permission Required",
              "This app needs access to your location. Please enable location permission in Settings.",
              [
                { text: "Cancel", style: "cancel", onPress: resolve },
                {
                  text: "Open Settings",
                  onPress: async () => {
                    await Linking.openSettings();
                    resolve(undefined);
                  },
                },
              ],
              { cancelable: false }
            );
          });
          granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (!granted) return null;
        }
      }

      await MapboxGL.locationManager.start();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      userLocation = await MapboxGL.locationManager.getLastKnownLocation();
      await MapboxGL.locationManager.stop();

      if (!userLocation) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    if (userLocation) {
      return {
        longitude: userLocation.coords.longitude,
        latitude: userLocation.coords.latitude,
        accuracy: userLocation.coords.accuracy ?? 0,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};
