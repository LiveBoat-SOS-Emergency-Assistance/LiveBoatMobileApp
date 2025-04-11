import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL, {
  MapView,
  Camera,
  PointAnnotation,
  ShapeSource,
  LineLayer,
} from "@rnmapbox/maps";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import UserSOS from "./UserSOS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserLocation from "./UserLocation";
import { getCurrentLocation } from "../../utils/location";
MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);
interface SOS {
  accuracy: string;
  created_at: string;
  credibility: number;
  description: string;
  group_id: string;
  id: string;
  latitude: string;
  location_updated_at: string;
  longitude: string;
  name: string;
  reported_count: number;
  status: string;
  user_id: string;
}
interface SOSItem {
  SOS: SOS;
  accepted_at: string;
  accuracy: string;
  id: string;
  latitude: string;
  location_updated_at: string;
  longitude: string;
  sos_id: string;
  status: string;
  user_id: string;
}
interface mapProps {
  signal?: string;
  sos?: SOSItem;
}
const Map = ({ signal, sos }: mapProps) => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sosLocation, setSOSLocation] = useState<SOSItem | null>(null);
  const [route, setRoute] = useState<any>(null); // State to store route geometry
  // console.log("helo", sos);
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        if (loc) {
          setLocation([loc.longitude, loc.latitude]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (sos) {
      setSOSLocation(sos);
    }
  }, [sos]);
  useEffect(() => {
    const fetchRoute = async () => {
      if (location && sosLocation) {
        const origin = location; // [longitude, latitude]
        const destination = [
          parseFloat(sosLocation.SOS.longitude),
          parseFloat(sosLocation.SOS.latitude),
        ];

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log("Directions API Response:", data);
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry); // Store the route geometry
          }
        } catch (error) {
          console.log("Error fetching route:", error);
        }
      }
    };

    fetchRoute();
  }, [location, sosLocation]);
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
            {sosLocation && (
              <PointAnnotation
                id="sos-location"
                coordinate={[
                  parseFloat(sosLocation.SOS.longitude),
                  parseFloat(sosLocation.SOS.latitude),
                ]}
              >
                <View className="flex-1 justify-center items-center">
                  <UserSOS />
                </View>
              </PointAnnotation>
            )}
            {route && (
              <MapboxGL.ShapeSource id="routeSource" shape={route}>
                <MapboxGL.LineLayer
                  id="routeLayer"
                  style={{ lineColor: "#FF0000", lineWidth: 1 }}
                />
              </MapboxGL.ShapeSource>
            )}
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
