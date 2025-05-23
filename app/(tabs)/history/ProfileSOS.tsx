import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Map from "../../../components/Map/Map";
import ImageCustom from "../../../components/Image/Image";
import { ScrollView } from "react-native";
import Information from "../../../components/Information/Information";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { sosService } from "../../../services/sos";
import { rescuerServices } from "../../../services/rescuer";
import CustomButton from "../../../components/Button/CustomButton";
import { getCurrentLocation } from "../../../utils/location";
import { userServices } from "../../../services/user";
import Avatar from "../../../components/Image/Avatar";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RescuerItem } from "../../../types/rescuerItem";
import * as mediaSoupModule from "../../../mediaSoup/index";
import { getChatSocket, getMediaSoupSocket } from "../../../utils/socket";
import { initializeChatModule } from "../../../sockets/ChatModule";
import { useAuth } from "../../../context/AuthContext";

interface SOSProfile {
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
  has_livestream: boolean;
}
interface UserProfile {
  name: string;
  address: string;
  gender: string;
  birthday: Date;
  blood_type: string;
  height: number;
  weight: number;
  User: {
    phone: string;
    email: string;
    avatar_url: string;
  };
}
const ProfileSOS = () => {
  const { id } = useLocalSearchParams();
  const [profileSOS, setProfileSOS] = useState<SOSProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [checkHelping, setCheckHelping] = useState(true);
  const [currentMyRescuer, setCurrentMyRescuer] = useState<RescuerItem | null>(
    null
  );
  const { profile } = useAuth();
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
    accuracy?: number;
  } | null>(null);
  const chatSocket = getChatSocket();
  const mediaSoupSocket = getMediaSoupSocket();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getMyRescuerCurrent = async () => {
      try {
        const result = await rescuerServices.getSOSCurrent();
        if (result && result.data && result.data.sos_id === id) {
          setCheckHelping(true);
          setCurrentMyRescuer(result.data);
        } else {
          setCheckHelping(false);
          setCurrentMyRescuer(null);
        }
      } catch (error: any) {
        console.log("Error", error);
        setCheckHelping(false);
        setCurrentMyRescuer(null);
      }
    };
    getMyRescuerCurrent();
  }, [id]);
  useEffect(() => {
    const getProfileSOS = async () => {
      const result = await sosService.getSOSById(Number(id));
      const resultUserProfile = await userServices.getUserByID(
        Number(result.data.user_id)
      );
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation({
          longitude: loc.longitude,
          latitude: loc.latitude,
          accuracy: loc.accuracy,
        });
      }
      setProfileSOS(result.data);
      setUserProfile(resultUserProfile.data);
    };
    if (id) {
      getProfileSOS();
    }
  }, []);
  const handleGiveSupport = async () => {
    try {
      const result = await rescuerServices.postRescuer(Number(id), location);
      if (result) {
        Toast.show({
          type: "success",
          text1: "Help on the way!",
          text2: "Thank you for responding to the SOS. Stay safe!",
        });
        await AsyncStorage.setItem("SOSID", id.toString());
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Notification!",
        text2: "You are already assisting another SOS request.",
      });
      console.log("Error", error.response?.data);
    }
  };
  const handleCancelSOS = async () => {
    try {
      // console.log(currentSOS.SOS);
      if (profileSOS) {
        const result = await rescuerServices.updateRescuer({
          longitude: profileSOS.longitude,
          latitude: profileSOS.latitude,
          accuracy: profileSOS.accuracy,
          status: "CANCELED",
        });
      }

      Toast.show({
        type: "success",
        text1: "SOS Cancelled",
        text2: "You have canceled your request for emergency assistance.",
      });
      setCheckHelping(false);
    } catch (error: any) {
      console.log("Error", error.response?.data);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error when cancel support!",
      });
    }
  };

  const consumeOnly = (): Promise<any> => {
    console.log("Consume only call");
    return mediaSoupModule.joinRoom({
      isConsumeOnly: true,
      userId: profile?.id,
      sosId: id,
    });
  };
  const initialize = async () => {
    try {
      setLoading(true);
      const fetchedGroupId = await sosService.getGroupBySOSID(Number(id));
      // console.log("Fetched group ID:", fetchedGroupId.data);
      // setGroupId(fetchedGroupId.data);

      if (chatSocket && fetchedGroupId) {
        console.log("Chat Socket at sos", chatSocket.id);
        initializeChatModule({
          chatSocket,
          groupId: fetchedGroupId.data,
        });
      }
      console.log("before mediaSoupSocket");
      if (mediaSoupSocket) {
        mediaSoupModule.initializeMediaSoupModule();
      }
      consumeOnly();

      setLoading(false);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };
  const handleJoinLiveStream = async () => {
    initialize();
    if (!loading) {
      router.push({
        pathname: "/(tabs)/home/PreLive",
        params: {
          sosId: id,
          userProfile: JSON.stringify(userProfile),
        },
      });
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="w-full bg-white"
      >
        {/* Map Section */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/history/DetailSOS",
              params: {
                profile: JSON.stringify(profile),
                userProfile: JSON.stringify(userProfile),
              },
            })
          }
          className="w-full h-[200px] bg-red-300"
        >
          <Map />
        </Pressable>

        {/* Profile Section */}
        <View className="w-full relative flex flex-col items-center py-4">
          <View className="absolute top-[-20px] px-7 w-full flex flex-row justify-between items-center">
            <View className="flex flex-col gap-2 items-center justify-start">
              <View className="relative">
                <Avatar
                  source={userProfile?.User.avatar_url}
                  width={90}
                  height={90}
                ></Avatar>
                <View className="bg-[#EB4747] absolute bottom-0 right-2 w-8 h-8 rounded-full justify-center items-center flex">
                  <ImageCustom
                    width={18}
                    height={18}
                    color="white"
                    source="https://img.icons8.com/?size=100&id=d7iUgF8ZrDaO&format=png&color=000000"
                  />
                </View>
              </View>
              <Text className="text-[#404040] font-bold text-[20px]">
                {userProfile?.name === "Chưa điền" || !userProfile?.name
                  ? "Unknown name"
                  : userProfile?.name}
              </Text>
            </View>
            <View className="flex flex-row gap-2 h-[30px]">
              {profileSOS?.has_livestream === true && (
                <TouchableOpacity
                  onPress={handleJoinLiveStream}
                  className="w-fit px-3 py-2 bg-white border rounded-[20px] border-red-400 flex justify-center items-center"
                >
                  <Text className="text-[11px] text-red-400 font-bold">
                    Join Live Stream
                  </Text>
                </TouchableOpacity>
              )}
              {checkHelping && currentMyRescuer && (
                <TouchableOpacity
                  onPress={handleCancelSOS}
                  className="w-fit px-3 py-2 bg-red-400 flex justify-center rounded-[20px] items-center"
                >
                  <Text className="text-[11px] text-white font-bold">
                    No Help
                  </Text>
                </TouchableOpacity>
              )}
              {!checkHelping && !currentMyRescuer && (
                <TouchableOpacity
                  onPress={handleGiveSupport}
                  className="w-fit px-3 py-2 bg-red-400 flex justify-center rounded-[20px] items-center"
                >
                  <Text className="text-[11px] text-white font-bold">Help</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content Section */}
          <View className="flex flex-col mt-[110px] w-full justify-center items-center gap-4">
            <View className="w-[90%] h-fit bg-red-300 shadow-md rounded-[20px] px-5 py-4">
              <View className="flex flex-row gap-2 items-center">
                <Text className="text-white font-bold">Name:</Text>
                <Text className="text-white text-[13px]">{profile?.name}</Text>
              </View>
              <Text className="text-white font-bold">Description:</Text>
              <Text className="text-white text-[13px]">
                {profileSOS?.description}
              </Text>
            </View>
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
              className="w-[90%] bg-white border-gray-200 shadow-md rounded-[20px] px-5 py-4 gap-2"
            >
              <Text className="text-[#EB4747] font-bold">
                Personal information:
              </Text>
              <View className="flex flex-row justify-between">
                <View className="flex flex-col justify-start gap-2">
                  <Information
                    title="Date of birth:"
                    content={
                      userProfile?.birthday
                        ? userProfile.birthday.toString()
                        : "N/A"
                    }
                    icon="https://img.icons8.com/?size=100&id=43503&format=png&color=000000"
                  />
                  <Information
                    title="Phone number:"
                    content={userProfile?.User.phone}
                    icon="https://img.icons8.com/?size=100&id=9730&format=png&color=000000"
                  />
                </View>
                <View className="flex flex-col justify-start gap-2">
                  <Information
                    title="Gender:"
                    content={userProfile?.gender || "N/A"}
                    icon="https://img.icons8.com/?size=100&id=11780&format=png&color=000000"
                  />
                  <Information
                    title="Email:"
                    content={userProfile?.User.email}
                    icon="https://img.icons8.com/?size=100&id=85467&format=png&color=000000"
                  />
                </View>
              </View>
              <View className="flex justify-start">
                <Information
                  title="Address:"
                  content={userProfile?.address || "N/A"}
                  icon="https://img.icons8.com/?size=100&id=86457&format=png&color=000000"
                />
              </View>
            </View>

            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
              className="w-[90%] bg-white border-gray-200 shadow-md rounded-[20px] px-5 py-4 gap-2"
            >
              <Text className="text-[#EB4747] font-bold">
                Medical information
              </Text>
              <View className="flex flex-col justify-start gap-2">
                <Information
                  title="Blood type:"
                  content="A+"
                  icon="https://img.icons8.com/?size=100&id=92345&format=png&color=000000"
                />
                <Information
                  title="Allergy:"
                  content="Medicine..."
                  icon="https://img.icons8.com/?size=100&id=7bTFxD2ikcbM&format=png&color=000000"
                />
                <Information
                  title="Medical history:"
                  content="Heart, blood pressure, diabetes,..."
                  icon="https://img.icons8.com/?size=100&id=5BkXi8DP6q2o&format=png&color=000000"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSOS;
