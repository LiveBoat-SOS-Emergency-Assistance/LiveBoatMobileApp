import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import MapboxGL from "@rnmapbox/maps";
export type LocationResult = {
  longitude: number;
  latitude: number;
  accuracy?: number;
};

export const getCurrentLocation = async (): Promise<LocationResult | null> => {
  try {
    if (Platform.OS === "android") {
      let granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      while (!granted) {
        const requestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
          granted = true;
          break;
        }

        console.warn("Location permission denied!");

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

        // After alert, check permission again
        granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    }

    // Try getting user location
    const userLocation = await MapboxGL.locationManager.getLastKnownLocation();
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
