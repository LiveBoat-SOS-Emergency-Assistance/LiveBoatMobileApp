import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../Image/Image";
import { userServices } from "../../services/user";
import axios from "axios";
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import { router } from "expo-router";
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
          // console.log(result.data);
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
          // Mapbox Reverse Geocoding API
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.longitude},${data.latitude}.json?access_token=${EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );

          // Check if results are available and set the location name
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
  return (
    <Pressable onPress={handlePress} className="w-full bg-white ">
      <View
        style={{
          shadowColor: "#80C4E9",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
        className="w-full bg-white rounded-[10px] border-gray-200 border py-2 px-5 flex flex-row justify-start items-start"
      >
        <View className="flex flex-row gap-5  justify-center items-center">
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=ptFAnHq1YxDk&format=png&color=000000"
            width={70}
            height={70}
          ></ImageCustom>
          <View className="flex flex-col gap-1">
            <Text className="text-[#404040] font-bold text-[12px]">
              {data?.name != null ? data.name : `SOS-${data.id}`}
            </Text>
            <View className="flex flex-row">
              <Text className="text-[#404040] text-[8px]">
                {user?.name || "Unknown name"}
              </Text>
              <Text className="text-[#404040] text-[8px]">
                {" - "}
                {user?.User.phone}
              </Text>
            </View>
            <View className="flex flex-row">
              <ImageCustom
                width={15}
                height={15}
                source="https://img.icons8.com/?size=100&id=r9lfc22rXPaO&format=png&color=000000"
              ></ImageCustom>
              <Text className="text-[#404040] text-[8px]">
                {locationName
                  ? locationName.length > 50
                    ? locationName.slice(0, 50) + "..."
                    : locationName
                  : "Unknown location..."}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default SOSCardFilter;
