import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Map from "../../../components/Map/Map";
import { useLocalSearchParams } from "expo-router";
import { rescuerServices } from "../../../services/rescuer";
import { RescuerItem } from "../../../types/rescuerItem";
import ImageCustom from "../../../components/Image/Image";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { getCurrentLocation, LocationResult } from "../../../utils/location";
import { Camera } from "@rnmapbox/maps";
import Avatar from "../../../components/Image/Avatar";
const DetailSOS = () => {
  const { profile, userProfile } = useLocalSearchParams();
  const [listRescuer, setListRescuer] = useState<RescuerItem[]>([]);
  const parsedProfile = profile ? JSON.parse(profile as string) : null;
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const parsedUserProfile = userProfile
    ? JSON.parse(userProfile as string)
    : null;
  // console.log("parsedProfile", parsedProfile);

  useEffect(() => {
    const getListRescuer = async () => {
      try {
        const result = await rescuerServices.getRescuerBySOSId(
          Number(parsedProfile?.id),
          "ENROUTE"
        );
        setListRescuer(result.data || []);
      } catch (error: any) {
        console.log("Error wheb get List Rescuer", error);
      }
    };
    getListRescuer();
  }, []);
  const handleControl = async (
    targetLocation: LocationResult | null = null
  ) => {
    try {
      let location = targetLocation;

      if (!location) {
        location = await getCurrentLocation();
      }

      if (location && cameraRef.current) {
        const { latitude, longitude } = location;
        cameraRef.current.moveTo([longitude, latitude], 1000);
        setTimeout(() => {
          cameraRef.current?.zoomTo(14, 500);
        }, 1000);
      }
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1  w-full h-full justify-center items-center bg-white relative">
        <Map
          signal="normal"
          otherSOS={{
            user_id: parsedProfile.user_id,
            longitude: parsedProfile.longitude,
            latitude: parsedProfile.latitude,
          }}
          listRescuer={listRescuer}
          cameraRef={cameraRef}
        ></Map>
        <View className=" bg-[#EB4747] absolute top-12 rounded-[30px] opacity-90 px-7 py-3 flex justify-center items-center">
          <Text className="font-bold text-white ">Traffic Accident</Text>
        </View>
        <View className="w-[50px] h-[50px] absolute bottom-10 right-5 bg-[#EB4747] rounded-full flex justify-center items-center">
          <ImageCustom
            width={27}
            height={27}
            color="white"
            source="https://img.icons8.com/?size=100&id=2WHX382zjkkB&format=png&color=000000"
          />
        </View>
        <View
          className={`absolute right-5 ${
            isExpanded ? "w-[50px] h-[180px]" : "w-[30px] h-[135px]"
          } flex flex-col items-center gap-1 py-3 top-[100px] bg-[#FFDEDE] rounded-[90px]`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            className={`${
              isExpanded ? "w-[40] h-[40]" : "w-[24px] h-[24px]"
            } rounded-full bg-[#EB4747] flex justify-center items-center gap-2 flex-col`}
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=pvGJuQWtxCiV&format=png&color=000000"
              color="white"
              width={isExpanded ? 20 : 15}
              height={isExpanded ? 20 : 15}
            ></ImageCustom>
          </Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-col space-y-2 gap-1">
              {listRescuer.map((rescuer, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleControl({
                      latitude: parseFloat(rescuer.latitude),
                      longitude: parseFloat(rescuer.longitude),
                    });
                  }}
                >
                  <Avatar
                    key={index}
                    source={
                      rescuer.User.avatar_url ||
                      "https://via.placeholder.com/150"
                    }
                    width={isExpanded ? 40 : 24}
                    height={isExpanded ? 40 : 24}
                  ></Avatar>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
export default DetailSOS;
