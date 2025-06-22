import { Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../Image/Image";
import { userServices } from "../../services/user";
import axios from "axios";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import { router } from "expo-router";
import Avatar from "../Image/Avatar";
import { SOSType, SOSTypeDisplay } from "../../types/sosType";

interface cardProps {
  data: any;
}

const SOSCardFilter = ({ data }: cardProps) => {
  const [user, setUser] = useState<any>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  // console.log("SOSCardFilter rendered with data:", data);
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
  // ✅ Get emergency type icon from category
  const getEmergencyIcon = (category: string) => {
    switch (category) {
      case SOSType.DANGER:
        return "🚨";
      case SOSType.MEDICAL:
        return "🏥";
      case SOSType.VEHICLE:
        return "🚗";
      case SOSType.DISASTER:
        return "🔥";
      case SOSType.THREATENED:
        return "⚠️";
      case SOSType.LOST:
        return "🧭";
      case SOSType.UNSAFE:
        return "�";
      case SOSType.UNSPECIFIED:
      default:
        return "❓";
    }
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
              <Text className="text-2xl">
                {getEmergencyIcon(data?.extra_data?.category || data?.category)}
              </Text>
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
                    
                    <Text className="text-green-600 text-xs font-medium">
                      {
                        SOSTypeDisplay[
                          data.extra_data?.category || SOSType.UNSPECIFIED
                        ]
                      }
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
                      {data.SOSRescuers.length || 0} helping
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
