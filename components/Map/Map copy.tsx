// import React, { useEffect, useState } from "react";
// import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
// import MapboxGL from "@rnmapbox/maps";
// import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
// import Animated, {
//   configureReanimatedLogger,
//   ReanimatedLogLevel,
//   useSharedValue,
//   withRepeat,
//   withSequence,
//   withTiming,
// } from "react-native-reanimated";

// MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);
// MapboxGL.setTelemetryEnabled(false);

// const Map = () => {
//   const [location, setLocation] = useState<[number, number] | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [iconSize, setIconSize] = useState(1); // State lưu iconSize

//   // Tạo giá trị animation
//   const scale = useSharedValue(1);
//   configureReanimatedLogger({
//     level: ReanimatedLogLevel.warn,
//     strict: true, // Reanimated runs in strict mode by default
//   });
//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.warn("Quyền truy cập vị trí bị từ chối!");
//           return;
//         }
//       }
//       getCurrentLocation();
//     };

//     const getCurrentLocation = async () => {
//       try {
//         const userLocation =
//           await MapboxGL.locationManager.getLastKnownLocation();
//         if (userLocation) {
//           setLocation([
//             userLocation.coords.longitude,
//             userLocation.coords.latitude,
//           ]);
//         }
//       } catch (error) {
//         console.error("Lỗi lấy vị trí:", error);
//       }
//     };

//     requestLocationPermission();

//     // Animate scale value
//     scale.value = withRepeat(
//       withSequence(
//         withTiming(1.5, { duration: 1000 }),
//         withTiming(1, { duration: 1000 })
//       ),
//       -1,
//       true // Reverse animation
//     );
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIconSize(0.03 * scale.value);
//     }, 100);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapboxGL.MapView
//         style={styles.map}
//         styleURL="mapbox://styles/mapbox/streets-v12"
//         onDidFinishLoadingMap={() => setMapLoaded(true)}
//         scaleBarEnabled={false}
//       >
//         <MapboxGL.Images
//           images={{ userIcon: require("../../assets/images/ava.jpg") }}
//         />

//         {mapLoaded && location && (
//           <>
//             <MapboxGL.Camera zoomLevel={14} centerCoordinate={location} />

//             <MapboxGL.ShapeSource
//               id="user-location-source"
//               shape={{
//                 type: "Feature",
//                 geometry: { type: "Point", coordinates: location },
//                 properties: {},
//               }}
//             >
//               <MapboxGL.SymbolLayer
//                 id="user-location-marker"
//                 style={{
//                   iconImage: "userIcon",
//                   iconSize: iconSize,
//                   iconAllowOverlap: true,
//                   iconIgnorePlacement: true,
//                   iconAnchor: "center",
//                   iconOffset: [0, -10],
//                   // iconBorderRadius: 25,
//                 }}
//               />
//             </MapboxGL.ShapeSource>
//           </>
//         )}
//       </MapboxGL.MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     height: "100%",
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default Map;
