import React, { useEffect, useRef, useState } from "react";
import {
  View,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import MapboxGL, { MapView, Camera } from "@rnmapbox/maps";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import UserLocation from "./UserLocation";
import { getCurrentLocation } from "../../utils/location";
import RippleMarker from "./RippleMarker";
import { RescuerItem } from "../../types/rescuerItem";
import { SOSItem } from "../../types/sosItem";
import { useAuth } from "../../context/AuthContext";
import RescuerMarker from "./RescuerMarker";
MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

interface mapProps {
  signal?: string;
  sos?: SOSItem;
  checkSOS?: boolean;
  cameraRef?: React.RefObject<Camera>;
  listRescuer?: RescuerItem[];
  otherSOS?: {
    user_id: string;
    longitude: string;
    latitude: string;
  };
}
const Map = ({
  signal,
  sos,
  cameraRef,
  checkSOS,
  listRescuer,
  otherSOS,
}: mapProps) => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sosLocation, setSOSLocation] = useState<SOSItem | null>(null);
  const [route, setRoute] = useState<any>(null);
  const { profile } = useAuth();
  const [selectedRescuer, setSelectedRescuer] = useState<RescuerItem | null>(
    null
  );

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

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry);
          }
        } catch (error) {
          console.log("Error fetching route:", error);
        }
      }
    };
    if (location && sosLocation) {
      fetchRoute();
    }
  }, [location, sosLocation]);
  // console.log("listRescuer", listRescuer)
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
              zoomLevel={11}
              centerCoordinate={location}
              animationDuration={500}
            />

            {/* When I support others this is the user's location */}
            {sosLocation && checkSOS && (
              <RippleMarker
                id="ripple-marker"
                userIDSOS={Number(sosLocation.SOS.user_id)}
                coordinate={[
                  parseFloat(sosLocation.SOS.longitude),
                  parseFloat(sosLocation.SOS.latitude),
                ]}
              />
            )}

            {/* When I support others, and this is my path to the SOS signal */}
            {route && checkSOS && (
              <MapboxGL.ShapeSource id="routeSource" shape={route}>
                <MapboxGL.LineLayer
                  id="routeLayer"
                  style={{ lineColor: "rgb(48,125,247)", lineWidth: 4 }}
                />
              </MapboxGL.ShapeSource>
            )}
            {/* List Rescuer is supporting me */}
            {listRescuer &&
              listRescuer
                .filter(
                  (rescuer) =>
                    rescuer.longitude !== otherSOS?.longitude ||
                    rescuer.latitude !== otherSOS?.latitude
                )
                .map((rescuer) => (
                  <MapboxGL.PointAnnotation
                    id={`rescuer-marker-${rescuer.id}`}
                    key={rescuer.id}
                    coordinate={[
                      parseFloat(rescuer.longitude),
                      parseFloat(rescuer.latitude),
                    ]}
                    // onSelected={() => {
                    //   if (selectedRescuer?.id === rescuer.id) {
                    //     setSelectedRescuer(null);
                    //   } else {
                    //     setSelectedRescuer(rescuer);
                    //   }
                    // }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {selectedRescuer?.id === rescuer.id && (
                        <View style={{ marginBottom: 4 }}>
                          <View style={styles.popupBoard}>
                            <Text>{rescuer.User.phone}</Text>
                          </View>
                        </View>
                      )}
                      <View style={styles.rescuerMarker} />
                    </View>
                  </MapboxGL.PointAnnotation>
                ))}

            {/* My location */}
            {signal === "sos" ? (
              <RippleMarker id="my-sos-marker" coordinate={location} />
            ) : (
              <UserLocation
                coordinate={location}
                avatarUrl={profile?.User?.avatar_url}
              />
            )}
            {otherSOS && (
              <RippleMarker
                id={`ripple-marker-${otherSOS.user_id}-${otherSOS.longitude}-${otherSOS.latitude}`}
                userIDSOS={Number(otherSOS.user_id)}
                coordinate={[
                  parseFloat(otherSOS.longitude),
                  parseFloat(otherSOS.latitude),
                ]}
              />
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
  rescuerMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "blue", // You can change the color
    borderWidth: 2,
    borderColor: "white",
  },
  popupBoard: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -75 }],
    width: 100,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    zIndex: 1,
  },
  popupContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  phone: {
    fontSize: 12,
    color: "gray",
  },
});

export default Map;
