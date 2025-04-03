import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ImageCustom from "../../../components/Image/Image";
import Input from "../../../components/Input/Input";
import { SettingsSection } from "../../../components/SettingSection/SettingSection";
import { MenuItem } from "../../../components/Menu/MenuItem";
import { Icon } from "../../../components/Icon/Icon";
import React, { useState } from "react";
import CustomButton from "../../../components/Button/CustomButton";

const edit_profile = () => {
  const [text, setText] = useState("");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: 100,
          paddingHorizontal: 10,
          backgroundColor: "white",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-28 h-28 flex">
          <Image
            source={require("../../../assets/images/ava.jpg")}
            className="w-28 h-28 rounded-full mb-3"
          />
          <ImageCustom
            width={24}
            height={24}
            color="#EB4747"
            className="absolute bottom-0 right-2"
            source="https://img.icons8.com/?size=100&id=84061&format=png&color=000000"
          ></ImageCustom>
        </View>
        <View className="w-full pt-5 flex flex-col gap-8 justify-center">
          <View className=" w-[100%] justify-center items-center gap-2">
            <Text className="text-gray-500 font-semibold justify-start items-start text-start w-[90%]">
              Họ và tên
            </Text>
            <Input value="Bach Duong"></Input>
          </View>
          <View className=" w-[100%] justify-center items-center gap-3 relative">
            <Text className="text-gray-500 font-semibold justify-start items-start text-start w-[90%]">
              Thông tin liên hệ
            </Text>
            <View className="flex flex-row w-[90%] border h-[50px] rounded-[5px] gap-2 border-[#D9D9D9] px-2 items-center">
              <ImageCustom
                color="#d9d9d9"
                width={24}
                height={24}
                source="https://img.icons8.com/?size=100&id=12580&format=png&color=000000"
              ></ImageCustom>
              <Text className="">bachduongvan0402@gmail.com</Text>
              <Text className="text-[9px] text-green-500">Đã xác thực</Text>
              <View className="absolute right-2">
                <Icon path="M9 6L15 12L9 18" />
              </View>
            </View>
            <View className="flex flex-row w-[90%] border h-[54px] rounded-[5px] gap-2 border-[#D9D9D9] px-2 items-center">
              <ImageCustom
                color="#d9d9d9"
                width={24}
                height={24}
                source="https://img.icons8.com/?size=100&id=Iw5aeMT37fzK&format=png&color=000000"
              ></ImageCustom>
              <Text className="">+ 0914365258</Text>
              <View className="absolute right-2">
                <Icon path="M9 6L15 12L9 18" />
              </View>
            </View>
          </View>
          <SettingsSection title="Thông tin cá nhân">
            <MenuItem title="Địa chỉ" />
            <MenuItem title="Ngày sinh" />
            <MenuItem title="Chiều cao" />
            <MenuItem title="Cân nặng" />
            <MenuItem title="Nhóm máu" />
            <TextInput
              placeholder="Dị ứng"
              className="w-full h-[100px] border items-start border-[#d9d9d9] rounded-[5px] justify-start mt-3 p-2"
              onChangeText={(text) => setText(text)}
              value={text}
              numberOfLines={4}
              multiline={true}
              textAlignVertical="top"
            ></TextInput>
          </SettingsSection>
          <View className="w-[90%] mx-auto">
            <CustomButton third title="Lưu"></CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default edit_profile;
