import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { MenuItem } from "../../../components/Menu/MenuItem";
import { SettingsSection } from "../../../components/SettingSection/SettingSection";
import CustomButton from "../../../components/Button/CustomButton";
import { useAuth } from "../../../context/AuthContext";
import { router, useRouter } from "expo-router";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handlePress = () => {
    router.push("/(main)/profile/edit_profile");
  };
  const handleChangePassword = () => {
    router.push("/(auth)/change_password");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
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
      <ScrollView>
        <View className="items-center ">
          <Image
            source={require("../../../assets/images/ava.jpg")}
            className="w-32 h-32 rounded-full mb-3"
          />
          <Text className="text-xl font-semibold">Bạch Dương</Text>
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
        {/* <SettingsSection title="Tài khoản">
          <View className="flex-row justify-between py-2 px-5">
            <View className="flex flex-row gap-2  items-center w-full">
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=Iw5aeMT37fzK&format=png&color=000000"
                width={24}
                height={24}
                color="#404040"
              ></ImageCustom>
              <View className="flex flex-col">
                <Text className="text-lg">Số điện thoại:</Text>
                <Text className="font-bold text-[#404040] text-lg">
                  + 0914136585
                </Text>
              </View>
            </View>
          </View>
        </SettingsSection> */}
        <SettingsSection title="Group Settings">
          <MenuItem title="Manage Group" />
          <MenuItem title="Share Location" />
          <MenuItem title="Smart Notifications" />
        </SettingsSection>

        <SettingsSection title="General Settings">
          <MenuItem title="Change Password" onPress={handleChangePassword} />
          <MenuItem title="SOS History" />
          <MenuItem title="Settings" />
          <MenuItem title="Invite Friends" />
          <MenuItem title="FAQ" />
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
