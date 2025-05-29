import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { MenuItem } from "../../../components/Menu/MenuItem";
import { SettingsSection } from "../../../components/SettingSection/SettingSection";
import CustomButton from "../../../components/Button/CustomButton";
import { useAuth } from "../../../context/AuthContext";
import { router, useRouter } from "expo-router";
import Avatar from "../../../components/Image/Avatar";
import messaging from "@react-native-firebase/messaging";
export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { logout, profile } = useAuth();
  const router = useRouter();
  const handlePress = () => {
    router.push("/(main)/profile/edit_profile");
  };
  const handleChangePassword = () => {
    router.push("/(auth)/change_password");
  };
  const handleSmartNotification = () => {
    router.push("/(main)/profile/SmartNotification");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      messaging().deleteToken();

      await logout();
      setLoading(false);
      router.replace("/");
    } catch (error: any) {
      console.error(error.response);
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <View className="w-full mt-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row w-[30px] items-center gap-2  px-5"
        >
          <ImageCustom
            width={25}
            height={25}
            source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View className="items-center ">
          {/* <Image
            source={require("../../../assets/images/ava.jpg")}
            className="w-32 h-32 rounded-full mb-3"
          /> */}
          <Avatar
            source={profile?.User.avatar_url}
            width={128}
            height={128}
          ></Avatar>
          <Text className="text-xl font-semibold">{profile?.name}</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center bg-[#80C4E9] px-5 py-2 rounded-[30px] mt-2"
          >
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=86376&format=png&color=000000"
              width={18}
              height={18}
              color="#ffffff"
            ></ImageCustom>
            <Text className="ml-1 text-white font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <SettingsSection title="Group Settings">
          <MenuItem
            title="Manage Group"
            onPress={() => router.push("/(main)/profile/ManageGroup")}
          />
          {/* <MenuItem
            title="Share Location"
            onPress={() => router.push("/(main)/profile/ShareLocation")}
          /> */}
          <MenuItem
            title="Smart Notifications"
            onPress={handleSmartNotification}
          />
        </SettingsSection>

        <SettingsSection title="General Settings">
          <MenuItem title="Change Password" onPress={handleChangePassword} />
          <MenuItem
            title="SOS History"
            onPress={() => router.push("/(main)/profile/SOSHistory")}
          />
          <MenuItem
            title="Privacy Policy"
            onPress={() => router.push("/(main)/profile/PrivacyPolicy")}
          />
          <MenuItem
            title="Term of Service"
            onPress={() => router.push("/(main)/profile/TermOfService")}
          />
          <MenuItem
            title="FAQ"
            onPress={() => router.push("/(main)/profile/FAQ")}
          />
        </SettingsSection>
        <View className="px-8 mb-[80px] mt-5">
          <CustomButton
            primary={true}
            isLoading={loading}
            title="Logout"
            onPress={handleLogout}
          ></CustomButton>
        </View>
      </ScrollView>
    </View>
  );
}
