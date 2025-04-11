import Geolocation from "@react-native-community/geolocation";
import { useEffect } from "react";
import { AppState, PermissionsAndroid } from "react-native";

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Access Permission",
        message: "The app needs access to your location to function properly.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Deny",
        buttonPositive: "Allow",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export function useWatchGPSStatus() {
  useEffect(() => {
    const checkGPSStatus = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("GPS OK", position.coords);
          // GPS đang bật
        },
        async (error) => {
          console.log("GPS error:", error);
          if (error.code === 2) {
            // code 2 = Location services disabled
            const granted = await requestLocationPermission();
            if (!granted) {
              Alert.alert(
                "GPS Required",
                "Please enable GPS to continue using this feature."
              );
            }
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    };

    checkGPSStatus(); // Check ngay khi vào app

    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkGPSStatus(); // Mỗi lần quay lại app thì kiểm tra lại
      }
    });

    const interval = setInterval(checkGPSStatus, 5000); // Check mỗi 5s

    return () => {
      clearInterval(interval);
      appStateListener.remove();
    };
  }, []);
}
