import React, { useEffect, useRef, useState } from "react";
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
import RippleMarker from "./RippleMarker";
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
  cameraRef?: React.RefObject<Camera>;
}
const Map = ({ signal, sos, cameraRef }: mapProps) => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sosLocation, setSOSLocation] = useState<SOSItem | null>(null);
  const [route, setRoute] = useState<any>(null); // State to store route geometry

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
        const origin = location;
        const destination = [
          parseFloat(sosLocation.SOS.longitude),
          parseFloat(sosLocation.SOS.latitude),
        ];
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]}%2C${origin[1]}%3B${destination[0]}%2C${destination[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
        // const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          // console.log("Directions API Response:", data);
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
        zoomEnabled={true}
      >
        {mapLoaded && location && (
          <>
            <Camera
              ref={cameraRef}
              zoomLevel={10}
              centerCoordinate={location}
              animationDuration={500}
            />
            {signal === "sos" ? (
              <RippleMarker id="my-sos-marker" coordinate={location} />
            ) : (
              <UserLocation coordinate={location} />
            )}
            {sosLocation && (
              <RippleMarker
                id="ripple-marker"
                userIDSOS={Number(sosLocation.SOS.user_id)}
                coordinate={[
                  parseFloat(sosLocation.SOS.longitude),
                  parseFloat(sosLocation.SOS.latitude),
                ]}
              />
            )}
            {route && (
              <MapboxGL.ShapeSource id="routeSource" shape={route}>
                <MapboxGL.LineLayer
                  id="routeLayer"
                  style={{ lineColor: "rgb(120,174,237)", lineWidth: 4 }}
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
