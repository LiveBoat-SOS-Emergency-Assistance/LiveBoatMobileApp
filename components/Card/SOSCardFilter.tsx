// import { GestureResponderEvent, Pressable, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import ImageCustom from "../Image/Image";
// import { userServices } from "../../services/user";
// import axios from "axios";
// import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
// import { router } from "expo-router";
// interface cardProps {
//   data: any;
// }
// const SOSCardFilter = ({ data }: cardProps) => {
//   const [user, setUser] = useState<any>(null);
//   const [locationName, setLocationName] = useState<string | null>(null);
//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         if (data) {
//           const result = await userServices.getUserByID(data.user_id);
//           // console.log(result.data);
//           setUser(result.data);
//         }
//       } catch (error: any) {
//         console.error("Error at SOSCardFilter", error);
//       }
//     };
//     if (data) {
//       getUser();
//     }
//   }, [data]);

//   useEffect(() => {
//     const getLocationName = async () => {
//       if (data.latitude && data.longitude) {
//         try {
//           // Mapbox Reverse Geocoding API
//           const response = await axios.get(
//             `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.longitude},${data.latitude}.json?access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//           );

//           // Check if results are available and set the location name
//           if (response.data.features && response.data.features.length > 0) {
//             const location = response.data.features[0].place_name;
//             setLocationName(location);
//           }
//         } catch (error) {
//           console.error("Error fetching location name", error);
//         }
//       }
//     };

//     getLocationName();
//   }, [data.latitude, data.longitude]);

//   const handlePress = () => {
//     if (data) {
//       router.push({
//         pathname: "/(tabs)/history/ProfileSOS",
//         params: { id: data.id },
//       });
//     }
//   };
//   return (
//     <Pressable onPress={handlePress} className="w-full bg-white ">
//       <View
//         style={{
//           shadowColor: "#80C4E9",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.3,
//           shadowRadius: 4,
//           elevation: 5,
//         }}
//         className="w-full bg-white rounded-[10px] border-gray-200 border py-2 px-5 flex flex-row justify-start items-start"
//       >
//         <View className="flex flex-row gap-5  justify-center items-center">
//           <ImageCustom
//             source="https://img.icons8.com/?size=100&id=37084&format=png&color=000000"
//             width={50}
//             height={50}
//           ></ImageCustom>
//           <View className="flex flex-col gap-1">
//             <Text className="text-[#404040] font-bold text-[12px]">
//               {data?.name != null ? data.name : `SOS-${data.id}`}
//             </Text>
//             <View className="flex flex-row">
//               <Text className="text-[#404040] text-[8px]">
//                 {user?.name || "Unknown name"}
//               </Text>
//               <Text className="text-[#404040] text-[8px]">
//                 {" - "}
//                 {user?.User.phone}
//               </Text>
//             </View>
//             <View className="flex flex-row">
//               <ImageCustom
//                 width={15}
//                 height={15}
//                 source="https://img.icons8.com/?size=100&id=r9lfc22rXPaO&format=png&color=000000"
//               ></ImageCustom>
//               <Text className="text-[#404040] text-[8px]">
//                 {locationName
//                   ? locationName.length > 50
//                     ? locationName.slice(0, 50) + "..."
//                     : locationName
//                   : "Unknown location..."}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Pressable>
//   );
// };
// export default SOSCardFilter;
import { Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../Image/Image";
import { userServices } from "../../services/user";
import axios from "axios";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import { router } from "expo-router";
import Avatar from "../Image/Avatar";

interface cardProps {
  data: any;
}

const SOSCardFilter = ({ data }: cardProps) => {
  const [user, setUser] = useState<any>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (data) {
          const result = await userServices.getUserByID(data.user_id);
          setUser(result.data);
        }
      } catch (error: any) {
        console.error("Error at SOSCardFilter", error);
      }
    };
    if (data) {
      getUser();
    }
  }, [data]);

  useEffect(() => {
    const getLocationName = async () => {
      if (data.latitude && data.longitude) {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.longitude},${data.latitude}.json?access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );

          if (response.data.features && response.data.features.length > 0) {
            const location = response.data.features[0].place_name;
            setLocationName(location);
          }
        } catch (error) {
          console.error("Error fetching location name", error);
        }
      }
    };

    getLocationName();
  }, [data.latitude, data.longitude]);

  const handlePress = () => {
    if (data) {
      router.push({
        pathname: "/(tabs)/history/ProfileSOS",
        params: { id: data.id },
      });
    }
  };

  // ✅ Format time ago function
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const sosTime = new Date(timestamp);
    const diffInMs = now.getTime() - sosTime.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;

    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // ✅ Get emergency type icon
  const getEmergencyIcon = (name: string) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("water") || lowerName.includes("drowning"))
      return "🌊";
    if (lowerName.includes("fire")) return "🔥";
    if (lowerName.includes("medical") || lowerName.includes("health"))
      return "🏥";
    if (lowerName.includes("accident")) return "🚗";
    if (lowerName.includes("lost")) return "🧭";
    return "🚨";
  };

  return (
    <Pressable onPress={handlePress} className="w-full mb-3">
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {/* ✅ Header with priority indicator */}
        <View className="bg-gradient-to-r from-red-500 to-red-600 px-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse" />
              <Text className="text-white font-bold text-sm">EMERGENCY</Text>
            </View>
            <Text className="text-white/90 text-xs">
              {getTimeAgo(data.created_at || new Date().toISOString())}
            </Text>
          </View>
        </View>

        {/* ✅ Main content */}
        <View className="px-4 pb-4">
          <View className="flex-row items-start space-x-4 gap-2">
            {/* ✅ Emergency icon */}
            <View
              className="w-14 h-14 bg-red-100 rounded-full items-center justify-center"
              style={{
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-2xl">{getEmergencyIcon(data?.name)}</Text>
            </View>

            {/* ✅ Content */}
            <View className="flex-1">
              {/* ✅ Title */}
              <Text className="text-gray-900 font-bold text-base mb-1">
                {data?.name || `Emergency #${data.id}`}
              </Text>

              {/* ✅ User info */}
              <View className="flex-row items-center mb-2">
                <Avatar
                  source={user?.User?.avatar_url}
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <Text className="text-gray-600 text-sm mr-1">
                  {user?.name || "Unknown"}
                </Text>
                {user?.User?.phone && (
                  <>
                    <Text className="text-gray-400 text-sm mr-1">•</Text>
                    <Text className="text-gray-500 text-xs">
                      {user.User.phone}
                    </Text>
                  </>
                )}
              </View>

              {/* ✅ Location */}
              <View className="flex-row items-start mb-3">
                <ImageCustom
                  width={16}
                  height={16}
                  source="https://img.icons8.com/?size=100&id=7880&format=png&color=6b7280"
                  className="mr-2 mt-0.5"
                />
                <Text className="text-gray-600 text-sm flex-1 leading-5">
                  {locationName
                    ? locationName.length > 60
                      ? locationName.slice(0, 60) + "..."
                      : locationName
                    : "Fetching location..."}
                </Text>
              </View>

              {/* ✅ Status indicators */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-3 gap-2">
                  {/* Distance indicator */}
                  <View className="flex-row items-center">
                    <ImageCustom
                      width={14}
                      height={14}
                      source="https://img.icons8.com/?size=100&id=85018&format=png&color=059669"
                      className="mr-1"
                    />
                    <Text className="text-green-600 text-xs font-medium">
                      Nearby
                    </Text>
                  </View>

                  {/* Responders count */}
                  <View className="flex-row items-center">
                    <ImageCustom
                      width={14}
                      height={14}
                      source="https://img.icons8.com/?size=100&id=86&format=png&color=3b82f6"
                      className="mr-1"
                    />
                    <Text className="text-blue-600 text-xs font-medium">
                      {data.reported_count || 0} helping
                    </Text>
                  </View>
                </View>

                {/* ✅ Action button */}
                <View className="bg-blue-500 px-3 py-1.5 rounded-lg">
                  <Text className="text-white text-xs font-semibold">
                    View Details
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ✅ Footer with additional info */}
        {data.description && (
          <View className="px-4 pb-4">
            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-700 text-sm italic">
                "
                {data.description.length > 100
                  ? data.description.slice(0, 100) + "..."
                  : data.description}
                "
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default SOSCardFilter;
