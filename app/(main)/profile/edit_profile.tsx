import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCustom from "../../../components/Image/Image";
import Input from "../../../components/Input/Input";
import { SettingsSection } from "../../../components/SettingSection/SettingSection";
import { MenuItem } from "../../../components/Menu/MenuItem";
import { Icon } from "../../../components/Icon/Icon";
import React, { useEffect, useRef, useState } from "react";
import CustomButton from "../../../components/Button/CustomButton";
import { launchImageLibrary } from "react-native-image-picker";
import { userServices } from "../../../services/user";
import Avatar from "../../../components/Image/Avatar";
import { uploadFileToGCS } from "../../../utils/uploadAvatar";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../../context/AuthContext";
import { Profile } from "../../../types/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const [text, setText] = useState("");
  const { profile, setProfile } = useAuth();
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [imageUri, setImageUri] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedValue, setSelectedValue] = useState<Record<string, string>>(
    {}
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // useEffect(() => {
  //   if (myProfile?.User?.avatar_url) {
  //     setImageUri(myProfile.User.avatar_url);
  //   }
  // }, [myProfile]);
  const openImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      const pickedImage = result.assets[0];

      const file = {
        uri: pickedImage.uri!,
        type: pickedImage.type || "image/jpeg",
        name: pickedImage.fileName || `photo_${Date.now()}.jpg`,
      };

      const uploadResult = await uploadFileToGCS(file);

      if (uploadResult.success && uploadResult.fileUrl) {
        setImageUri(uploadResult.fileUrl);
      } else {
        console.error("Upload failed");
      }
    }
  };
  const handleConfirmAvatar = async () => {
    if (profile && imageUri) {
      const success = await userServices.updateImage({ avatarUrl: imageUri });
      if (success) {
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Updated Image Successful",
        });
        const updatedProfile = {
          ...profile,
          User: {
            ...profile.User,
            avatar_url: imageUri,
          },
        };
        setProfile(updatedProfile);
        await AsyncStorage.setItem("profile", JSON.stringify(updatedProfile));
      } else {
        alert("❌ Failed to update avatar");
      }
    }
  };
  const scrollToValueIndex = (value: string, options: string[]) => {
    const index = options.indexOf(value);
    if (index !== -1 && scrollViewRef.current) {
      const itemHeight = 48;
      const yPosition = index * itemHeight;
      scrollViewRef.current.scrollTo({ y: yPosition, animated: true });
    }
  };
  useEffect(() => {
    const getProfile = async () => {
      try {
        setMyProfile(profile);
        setImageUri(profile?.User.avatar_url);
      } catch (error: any) {
        console.error("error of profile", error);
      }
    };
    getProfile();
  }, []);
  const handleOpenDialog = (field: string) => {
    if (field === "Date of Birth") {
      setShowDatePicker(true);
    } else {
      setSelectedField(field);
      setDialogVisible(true);

      // Scroll to the currently selected value when dialog opens
      const currentValue = selectedValue[field];
      if (currentValue) {
        setTimeout(() => {
          scrollToValueIndex(currentValue, getOptions(field));
        }, 100);
      }
    }
  };

  const handleSelectValue = (value: string) => {
    setSelectedValue((prev) => ({
      ...prev,
      [selectedField]: value,
    }));
    setDialogVisible(false);
  };

  const getOptions = (field: string): string[] => {
    if (field === "Height") {
      const heights: string[] = [];
      for (let cm = 120; cm <= 200; cm++) {
        const meters = (cm / 100).toFixed(2).replace(".", "m");
        heights.push(meters);
      }
      return heights;
    }
    if (field === "Weight") {
      const weights: string[] = [];
      for (let kg = 30; kg <= 100; kg++) {
        weights.push(`${kg}kg`);
      }
      return weights;
    }
    if (field === "Blood Type") {
      return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    }
    return [];
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {dialogVisible && (
        <View className="absolute inset-0 top-0 bg-black/50 z-50 items-center justify-center">
          <View className="bg-white rounded-lg p-5 w-4/5 max-h-[60%]">
            <Text className="text-lg font-bold mb-4 text-center">
              Select {selectedField}
            </Text>

            {selectedField === "Date of Birth" ? (
              <DateTimePicker
                value={selectedDate || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (event.type === "set" && date) {
                    console.log("click");
                    setSelectedDate(date);
                    handleSelectValue(date.toISOString().split("T")[0]);
                    setDialogVisible(false);
                  } else {
                    setDialogVisible(false);
                  }
                }}
              />
            ) : (
              <ScrollView ref={scrollViewRef}>
                {getOptions(selectedField).map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelectValue(option)}
                    className="p-3 border-b border-gray-200"
                  >
                    <Text className="text-base text-center">{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={() => setDialogVisible(false)}
              className="mt-4 self-end"
            >
              <Text className="text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
        <TouchableOpacity onPress={openImagePicker}>
          <View className="relative w-28 h-28 flex">
            <Avatar
              source={imageUri || undefined}
              width={100}
              height={100}
              className="mb-3"
            ></Avatar>
            <View className="absolute bottom-0 right-2 bg-white w-6 h-6 rounded-full flex justify-center items-center">
              <ImageCustom
                width={24}
                height={24}
                color="#EB4747"
                source="https://img.icons8.com/?size=100&id=84061&format=png&color=000000"
              ></ImageCustom>
            </View>
          </View>
        </TouchableOpacity>
        <View className="w-full pt-5 flex flex-col gap-8 justify-center">
          <View className=" w-[100%] justify-center items-center gap-2">
            <Text className="text-gray-500 font-semibold justify-start items-start text-start w-[90%]">
              Full name
            </Text>
            <Input value={myProfile?.name}></Input>
          </View>
          <View className=" w-[100%] justify-center items-center gap-3 relative">
            <Text className="text-gray-500 font-semibold justify-start items-start text-start w-[90%]">
              Contact Information
            </Text>
            <View className="flex flex-row w-[90%] border h-[50px] rounded-[5px] gap-2 border-[#D9D9D9] px-2 items-center">
              <ImageCustom
                color="#d9d9d9"
                width={24}
                height={24}
                source="https://img.icons8.com/?size=100&id=12580&format=png&color=000000"
              ></ImageCustom>
              <Text className="">{myProfile?.User.email || ""}</Text>
              <Text className="text-[9px] text-green-500">Verified</Text>
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
              <Text className="">+ {myProfile?.User.phone || ""}</Text>
              <View className="absolute right-2">
                <Icon path="M9 6L15 12L9 18" />
              </View>
            </View>
          </View>
          <SettingsSection title="Personal Information">
            <MenuItem title="Address" />
            <MenuItem
              title="Date of Birth"
              value={selectedValue["Date of Birth"] || ""}
              onPress={() => handleOpenDialog("Date of Birth")}
            />
            <MenuItem
              title="Height"
              onPress={() => handleOpenDialog("Height")}
              value={selectedValue["Height"]}
            />
            <MenuItem
              title="Weight"
              onPress={() => handleOpenDialog("Weight")}
              value={selectedValue["Weight"]}
            />
            <MenuItem
              title="Blood Type"
              onPress={() => handleOpenDialog("Blood Type")}
              value={selectedValue["Blood Type"]}
            />
            <TextInput
              placeholder="Allergies"
              className="w-full h-[100px] border items-start border-[#d9d9d9] rounded-[5px] justify-start mt-3 p-2"
              onChangeText={(text) => setText(text)}
              value={text}
              numberOfLines={4}
              multiline={true}
              textAlignVertical="top"
            ></TextInput>
          </SettingsSection>
          <View className="w-[90%] mx-auto">
            <CustomButton
              onPress={handleConfirmAvatar}
              third
              isLoading={loading}
              title="Save"
            ></CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfile;
