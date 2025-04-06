import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import UserSOS from "./UserSOS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserLocation from "./UserLocation";

MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

const Map = ({ signal }: { signal?: string }) => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Location permission denied!");
          return;
        }
      }
      getCurrentLocation();
    };

    const getCurrentLocation = async () => {
      try {
        const userLocation =
          await MapboxGL.locationManager.getLastKnownLocation();
        if (userLocation) {
          setLocation([
            userLocation.coords.longitude,
            userLocation.coords.latitude,
          ]);
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        onDidFinishLoadingMap={() => setMapLoaded(true)}
        scaleBarEnabled={false}
      >
        {mapLoaded && location && (
          <>
            <Camera zoomLevel={14} centerCoordinate={location} />
            <PointAnnotation id="current-location" coordinate={location}>
              <View className="flex-1 justify-center items-center">
                {/* <UserSOS></UserSOS> */}
                {signal === "sos" ? <UserSOS /> : <UserLocation></UserLocation>}
              </View>
            </PointAnnotation>
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 0,
  },
  map: {
    flex: 1,
  },
});

export default Map;
