import React, { useEffect, useRef, useState } from "react";
import {
  View,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
  Text,
  Linking,
  Alert,
} from "react-native";
import MapboxGL, { MapView, Camera } from "@rnmapbox/maps";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import UserLocation from "./UserLocation";
import { getCurrentLocation } from "../../utils/location";
import RippleMarker from "./RippleMarker";
import { RescuerItem } from "../../types/rescuerItem";
// import { SOSItem } from "../../types/sosItem";
import { useAuth } from "../../context/AuthContext";
import RescuerMarker from "./RescuerMarker";
import MarkerPopup from "./MarkerPopup";
import { m } from "framer-motion";
import { SOSProfile } from "../../types/sosItem";
import { userServices } from "../../services/user";
import { Profile } from "../../types/Profile";
MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

interface Marker {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  userType: "SENDER" | "HELPER" | "NORMAL";
  avatarUrl: string;
  name?: string;
  phone?: string;
  status?: string;
  User?: {
    id: number;
    avatar_url?: string;
    phone?: string;
  };
  isOnline?: boolean;
}

interface mapProps {
  signal?: string;
  sos?: SOSProfile;
  checkSOS?: boolean;
  cameraRef?: React.RefObject<Camera>;
  listRescuer?: RescuerItem[];
  otherSOS?: {
    user_id: string;
    longitude: string;
    latitude: string;
  };
  otherUserMarkers?: Record<number, Marker>;
  checkRoute?: boolean;
  idSender?: string;
}
const Map = ({
  signal,
  sos,
  cameraRef,
  checkSOS,
  listRescuer,
  otherSOS,
  otherUserMarkers,
  checkRoute = false,
  idSender = "",
}: mapProps) => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sosLocation, setSOSLocation] = useState<SOSProfile | null>(null);
  const [route, setRoute] = useState<any>(null);
  const { profile } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [sosSender, setSOSSender] = useState<Profile | null>(null);
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
          parseFloat(sosLocation.longitude),
          parseFloat(sosLocation.latitude),
        ];
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]}%2C${origin[1]}%3B${destination[0]}%2C${destination[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry);
          }
          // console.log("Route data:", data);
          // console.log("Route fetched successfully:", data);
        } catch (error) {
          console.log("Error fetching route:", error);
        }
      }
    };
    if (location && sosLocation && checkSOS) {
      console.log("checkSOS", checkSOS, checkRoute);
      fetchRoute();
    }
  }, [location, sosLocation, checkRoute]);

  // ✅ THÊM: Popup handlers
  const handleMarkerPress = (marker: Marker) => {
    console.log("Marker pressed:", marker);
    setSelectedMarker(marker);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMarker(null);
  };

  const handleCallUser = () => {
    if (selectedMarker?.phone) {
      Linking.openURL(`tel:${selectedMarker.phone}`);
    } else {
      Alert.alert(
        "No phone number",
        "This user doesn't have a phone number available"
      );
    }
  };
  const getSOSSender = async () => {
    try {
      const result = await userServices.getUserByID(Number(idSender));
      setSOSSender(result.data);
    } catch (error: any) {
      console.error("Error getting SOS sender:", error);
    }
  };
  useEffect(() => {
    if (idSender) {
      getSOSSender();
    }
  }, [idSender]);
  const handleMessageUser = () => {
    // Navigate to chat screen or open messaging functionality
    Alert.alert("Message", "Opening chat functionality...");
    // You can add navigation logic here
  };

  const handleGetDirections = () => {
    if (selectedMarker && location) {
      const url = `https://maps.google.com/maps?q=${selectedMarker.latitude},${selectedMarker.longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Could not open map directions");
      });
    }
  };

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
              zoomLevel={signal === "sos" ? 15 : 14}
              centerCoordinate={location}
              animationDuration={500}
            />
            {signal === "sos" ? (
              <RippleMarker
                key="my-sos-marker"
                // key={profile?.User?.id}
                id={profile?.User?.id}
                coordinate={location}
                onPress={() => {
                  if (profile?.User) {
                    handleMarkerPress({
                      userId: Number(profile.User.id),
                      latitude: location[1],
                      longitude: location[0],
                      accuracy: 10,
                      userType: "SENDER",
                      avatarUrl: profile.User.avatar_url || "",
                      name: profile.name || `User ${profile.User.id}`,
                      phone: profile.User.phone || "",
                      status: "My SOS Signal",
                    });
                  }
                }}
              />
            ) : (
              <UserLocation
                key="my-location-marker"
                // key={profile?.User?.id}
                coordinate={location}
                avatarUrl={profile?.User?.avatar_url}
                onPress={() =>
                  handleMarkerPress({
                    userId: Number(profile?.User?.id),
                    latitude: location[1],
                    longitude: location[0],
                    accuracy: 10,
                    userType: "NORMAL",
                    avatarUrl: profile?.User?.avatar_url || "",
                    name: profile?.name || `User ${profile?.User?.id}`,
                    phone: profile?.User?.phone || "",
                    status: "My Location",
                  })
                }
              />
            )}
            {/* When I support others this is the user's location */}
            {sosLocation && checkSOS && !otherUserMarkers && (
              <RippleMarker
                key={sosLocation.user_id}
                id="ripple-marker"
                userIDSOS={Number(sosLocation.user_id)}
                coordinate={[
                  parseFloat(sosLocation.longitude),
                  parseFloat(sosLocation.latitude),
                ]}
                onPress={() => {
                  console.log("SOS Location pressed:", sosLocation);
                  // Handle marker press for SOS location
                  handleMarkerPress({
                    userId: Number(sosLocation.user_id),
                    latitude: parseFloat(sosLocation.latitude),
                    longitude: parseFloat(sosLocation.longitude),
                    accuracy: 10,
                    userType: "SENDER",
                    avatarUrl: "",
                    name: `SOS ${sosLocation.name}`,
                    phone: "",
                    status: "SOS Signal",
                  });
                }}
              />
            )}
            {route && checkSOS && (
              <MapboxGL.ShapeSource id="routeSource" shape={route}>
                <MapboxGL.LineLayer
                  id="routeLayer"
                  style={{ lineColor: "rgb(48,125,247)", lineWidth: 4 }}
                />
              </MapboxGL.ShapeSource>
            )}
            {otherUserMarkers &&
              Object.values(otherUserMarkers).map((marker) => {
                // const uniqueKey = `${marker.userId}-${marker.latitude}-${marker.longitude}`; // Tạo key duy nhất
                if (marker.userType === "NORMAL") {
                  return (
                    <UserLocation
                      key={`user-location-${marker?.userId}`}
                      coordinate={[marker?.longitude, marker?.latitude]}
                      avatarUrl={marker?.avatarUrl}
                      userType={marker?.userType}
                      size={50}
                      onPress={() => handleMarkerPress(marker)}
                      userData={{
                        userId: marker?.userId,
                        name: marker?.name,
                        phone: marker?.phone,
                        accuracy: marker?.accuracy,
                      }}
                    />
                  );
                } else if (marker.userType === "HELPER") {
                  return (
                    <RescuerMarker
                      key={`rescuer-marker-${marker?.userId}`}
                      coordinate={[marker?.longitude, marker?.latitude]}
                      id={String(marker?.userId)}
                      type={marker?.userType}
                      zoomLevel={11}
                      avatarUrl={marker?.avatarUrl || marker.User?.avatar_url}
                      name={marker?.name}
                      onPress={() =>
                        handleMarkerPress({
                          userId: Number(marker?.userId),
                          latitude: marker?.latitude,
                          longitude: marker?.longitude,
                          accuracy: 10,
                          userType: "HELPER",
                          avatarUrl:
                            marker.avatarUrl || marker.User?.avatar_url || "",
                          name: marker.name || `User ${marker.userId}`,
                          phone: marker.User?.phone || marker?.phone || "",
                          status: "Rescue",
                        })
                      }
                    />
                  );
                } else if (marker.userType === "SENDER") {
                  return (
                    <RippleMarker
                      marker={marker}
                      key={`sos-marker-${marker?.userId || sosSender?.user_id}`}
                      id={String(marker.userId || sosSender?.user_id)}
                      coordinate={[marker.longitude, marker.latitude]}
                      userIDSOS={marker.userId || Number(sosSender?.user_id)}
                      isOnline={marker.isOnline}
                      onPress={() => {
                        console.log(
                          "SOS Marker pressed 319:",
                          marker.longitude,
                          marker.latitude
                        );
                        handleMarkerPress({
                          userId: Number(marker?.userId || sosSender?.user_id),
                          latitude: Number(marker.latitude),
                          longitude: Number(marker.longitude),
                          accuracy: Number(marker.accuracy) || 10,
                          userType: "SENDER",
                          avatarUrl:
                            sosSender?.User?.avatar_url ||
                            marker.avatarUrl ||
                            "",
                          name: `${
                            marker.name || sosSender?.name || `${marker.userId}`
                          }`,
                          phone: sosSender?.User?.phone,
                          status: "SOS Signal",
                        });
                      }}
                    ></RippleMarker>
                  );
                }
                return null;
              })}
            {/* When I support others, and this is my path to the SOS signal */}

            {/* My location */}
            {otherSOS && (
              <RippleMarker
                id={`ripple-marker-${otherSOS.user_id}-${otherSOS.longitude}-${otherSOS.latitude}`}
                userIDSOS={Number(otherSOS.user_id)}
                coordinate={[
                  parseFloat(otherSOS.longitude),
                  parseFloat(otherSOS.latitude),
                ]}
                onPress={() =>
                  handleMarkerPress({
                    userId: Number(otherSOS.user_id),
                    latitude: parseFloat(otherSOS.latitude),
                    longitude: parseFloat(otherSOS.longitude),
                    accuracy: 10,
                    userType: "SENDER",
                    avatarUrl: "",
                    name: `SOS User ${otherSOS.user_id}`,
                    phone: "",
                    status: "SOS Signal",
                  })
                }
              />
            )}
          </>
        )}
      </MapView>

      {/* ✅ ADD: Marker Popup */}
      <MarkerPopup
        visible={showPopup}
        marker={selectedMarker}
        onClose={handleClosePopup}
        onCall={handleCallUser}
        onMessage={handleMessageUser}
        onGetDirections={handleGetDirections}
      />
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
