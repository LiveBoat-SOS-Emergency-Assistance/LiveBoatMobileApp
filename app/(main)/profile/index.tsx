import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { MenuItem } from "../../../components/Menu/MenuItem";
import { SettingsSection } from "../../../components/SettingSection/SettingSection";
import CustomButton from "../../../components/Button/CustomButton";
import { useAuth } from "../../(auth)/AuthContext";
import { router } from "expo-router";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
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
          <TouchableOpacity className="flex-row items-center bg-[#80C4E9] px-5 py-2 rounded-[30px] mt-2">
            <ImageCustom
              source="https://img.icons8.com/?size=100&id=86376&format=png&color=000000"
              width={18}
              height={18}
              color="#ffffff"
            ></ImageCustom>
            <Text className="ml-1 text-white font-bold">Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <SettingsSection title="Cài đặt Nhóm">
          <MenuItem title="Quản lý Nhóm" />
          <MenuItem title="Chia sẻ Vị trí" />
          <MenuItem title="Thông báo Thông minh" />
        </SettingsSection>

        <SettingsSection title="Cài đặt Chung">
          <MenuItem
            title="Liên hệ Khẩn cấp"
            subtitle="Chia sẻ hoạt động và cảnh báo liên hệ khẩn cấp nếu bạn kích hoạt chế độ SOS."
          />
          <MenuItem
            title="Đổi Mã PIN"
            subtitle="Bạn cần nhập mã PIN này để tắt chế độ SOS."
          />
          <MenuItem title="Nâng cấp lên Premium" />
          <MenuItem title="Cài đặt" />
          <MenuItem title="Giới thiệu bạn bè" />
          <MenuItem title="Câu hỏi thường gặp (FAQ)" />
        </SettingsSection>

        <View className="px-8 mb-[80px] mt-5">
          <CustomButton
            primary={true}
            isLoading={loading}
            title="Đăng xuất"
            onPress={handleLogout}
          ></CustomButton>
        </View>
      </ScrollView>
    </View>
  );
}
