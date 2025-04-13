import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, Image } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Image/Avatar";
import { userServices } from "../../services/user";
import { Profile } from "../../types/Profile";
interface RippleMarkerProps {
  id: string;
  coordinate: [number, number];
  type?: string;
  userIDSOS?: number;
}

const RippleMarker = ({
  id,
  coordinate,
  type,
  userIDSOS,
}: RippleMarkerProps) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const [sosProfile, setSOSProfile] = useState<Profile | null>(null);
  const { profile } = useAuth();
  // console.log(userIDSOS);
  useEffect(() => {
    const getSOSProfile = async () => {
      try {
        if (!userIDSOS) return null;
        const result = await userServices.getUserByID(userIDSOS);
        setSOSProfile(result.data);
      } catch (error: any) {
        console.log(error);
      }
    };
    getSOSProfile();
  }, [userIDSOS]);
  useEffect(() => {
    const createRipple = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rippleScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createRipple();
  }, []);
  return (
    <MapboxGL.MarkerView coordinate={coordinate} id={id}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <View style={styles.centerDot}>
          {id === "my-sos-marker" && (
            <Avatar
              source={profile?.User.avatar_url}
              width={50}
              height={50}
            ></Avatar>
          )}
          {userIDSOS && (
            <Avatar
              source={sosProfile?.User.avatar_url}
              width={50}
              height={50}
            ></Avatar>
          )}
        </View>
      </View>
    </MapboxGL.MarkerView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255, 0, 0, 0.4)",
  },
  centerDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default RippleMarker;
