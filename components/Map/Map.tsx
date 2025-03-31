import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import UserLocation from "./UserLocation";

MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false); // Tắt telemetry để tránh lỗi không mong muốn

const Map = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Kiểm tra khi Mapbox đã sẵn sàng

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Quyền truy cập vị trí bị từ chối!");
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
        console.error("Lỗi lấy vị trí:", error);
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
              <UserLocation />
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
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 16,
    height: 16,
    backgroundColor: "blue",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default Map;
