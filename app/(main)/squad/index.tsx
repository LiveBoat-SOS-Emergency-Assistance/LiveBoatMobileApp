import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { groupServices } from "../../../services/group";
import MemberGroup from "../../../components/Card/MemberGroup";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
const SquadDetail = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [listMember, setListMember] = useState<
    { id: number; [key: string]: any }[]
  >([]);

  const [nameGroup, setNameGroup] = useState(name);
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useAuth();
  const getMember = async () => {
    try {
      const result = await groupServices.getMemberByIdGroup(Number(id));
      if (result) {
        setListMember(result.data);
        const isAdminMember = result.data.some(
          (member: any) =>
            member.User.id === profile?.User.id && member.role === "ADMIN"
        );

        setIsAdmin(isAdminMember);
      }
    } catch (error: any) {
      console.error("Error get member", error);
    }
  };
  useEffect(() => {
    if (id) {
      getMember();
    }
  }, []);
  const handleLeave = async (memberId: number) => {
    try {
      const result = await groupServices.leaveGroup(Number(id));
      if (result) {
        router.back();
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Leave group successfully",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: errorMessage,
      });
    }
  };
  const handleDel = async (memberId: number) => {
    try {
      const result = await groupServices.kickGroup(Number(id), {
        userId: memberId,
      });
      if (result) {
        setListMember((prev) =>
          prev.filter((item) => item.User.id !== memberId)
        );
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Delete member successfully",
        });
      }
    } catch (error: any) {
      console.error("Error leave group", error);
    }
  };
  const handleEdit = async () => {
    try {
      const result = await groupServices.updateGroups(Number(id), {
        name: nameGroup,
      });
      if (result) {
        setIsEditing(false);
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Update group successfully",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: errorMessage,
      });
    }
  };

  const handeleDeleteGroup = async () => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await groupServices.deleteGroup(Number(id));
              if (result) {
                Toast.show({
                  type: "success",
                  text1: "Notification",
                  text2: "Delete group successfully",
                });
                router.back();
              }
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.error || "An unexpected error occurred";
              Toast.show({
                type: "error",
                text1: "Notification",
                text2: errorMessage,
              });
            }
          },
        },
      ]
    );
  };
  const handleAddMember = async () => {
    try {
      // Regular expression to validate phone numbers (e.g., 10-15 digits)
      const phoneRegex = /^[0-9]{10,15}$/;

      if (!phone) {
        Toast.show({
          type: "error",
          text1: "Notification",
          text2: "Please enter a phone number",
        });
        return;
      }

      if (!phoneRegex.test(phone)) {
        Toast.show({
          type: "error",
          text1: "Notification",
          text2: "Invalid phone number. Please enter a valid phone number.",
        });
        return;
      }

      const result = await groupServices.inviteMember(Number(id), {
        phone: phone,
      });

      if (result) {
        setPhone("");
        getMember();
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "The invite is sent successfully",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: errorMessage,
      });
    }
  };
  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      {/* Header */}
      <View className="bg-white pt-12 pb-5 px-5 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-100 rounded-xl p-2.5"
          >
            <ImageCustom
              width={20}
              height={20}
              color="#64748b"
              source="https://img.icons8.com/?size=100&id=39786&format=png&color=000000"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800 flex-1 text-center mx-4">
            Squad Details
          </Text>
          <View className="w-10" />
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Group Name Section */}
        <View className="bg-white m-5 rounded-2xl p-5 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-slate-800">Group Name</Text>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  if (isEditing) {
                    handleEdit();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`${
                  isEditing ? "bg-blue-500" : "bg-sky-300"
                } px-4 py-2 rounded-full flex-row items-center gap-1.5`}
              >
                <ImageCustom
                  width={14}
                  height={14}
                  color="white"
                  source={
                    isEditing
                      ? "https://img.icons8.com/?size=100&id=82461&format=png&color=000000"
                      : "https://img.icons8.com/?size=100&id=86374&format=png&color=000000"
                  }
                />
                <Text className="text-white font-bold text-xs">
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            value={nameGroup}
            onChangeText={setNameGroup}
            editable={isAdmin && isEditing}
            className={`${
              isEditing
                ? "bg-slate-50 border-2 border-sky-300"
                : "bg-slate-100 border border-slate-200"
            } rounded-xl px-4 py-3.5 text-base font-semibold text-slate-800`}
            placeholder="Enter group name"
            placeholderTextColor="#94a3b8"
          />
        </View>
        {/* Group Stats */}
        <View className="bg-white mx-5 mb-5 rounded-2xl p-5 shadow-lg">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            Group Statistics
          </Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="bg-sky-300 rounded-xl p-3 mb-2">
                <ImageCustom
                  width={24}
                  height={24}
                  color="white"
                  source="https://img.icons8.com/?size=100&id=73429&format=png&color=000000"
                />
              </View>
              <Text className="text-xl font-bold text-sky-300">
                {listMember.length}
              </Text>
              <Text className="text-xs text-slate-500 text-center">
                Total Members
              </Text>
            </View>

            <View className="items-center">
              <View className="bg-emerald-500 rounded-xl p-3 mb-2">
                <ImageCustom
                  width={24}
                  height={24}
                  color="white"
                  source="https://img.icons8.com/?size=100&id=85500&format=png&color=000000"
                />
              </View>
              <Text className="text-xl font-bold text-emerald-500">
                {listMember.filter((m) => m.role === "ADMIN").length}
              </Text>
              <Text className="text-xs text-slate-500 text-center">Admins</Text>
            </View>

            <View className="items-center">
              <View className="bg-amber-500 rounded-xl p-3 mb-2">
                <ImageCustom
                  width={24}
                  height={24}
                  color="white"
                  source="https://img.icons8.com/?size=100&id=23264&format=png&color=000000"
                />
              </View>
              <Text className="text-xl font-bold text-amber-500">
                {listMember.filter((m) => m.role === "MEMBER").length}
              </Text>
              <Text className="text-xs text-slate-500 text-center">
                Members
              </Text>
            </View>
          </View>
        </View>
        {/* Add Member Section */}
        <View className="bg-white mx-5 mb-5 rounded-2xl p-5 shadow-lg">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            Add New Member
          </Text>

          <View className="flex-row gap-3 items-center">
            <View className="flex-1">
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-800"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddMember}
              className="bg-sky-300 rounded-xl p-3.5 shadow-md"
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=UkLBG0sZoWV0&format=png&color=000000"
                width={24}
                height={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Members List */}
        <View className="bg-white mx-5 mb-5 rounded-2xl shadow-lg overflow-hidden">
          <View className="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <Text className="text-lg font-bold text-slate-800">
              Squad Members ({listMember.length})
            </Text>
          </View>
          {listMember.length > 0 ? (
            <View className="max-h-96">
              <ScrollView
                contentContainerClassName="py-2"
                showsVerticalScrollIndicator={false}
              >
                {listMember.map((item, index) => (
                  <View key={item.id || index} className="mx-4 my-1">
                    <MemberGroup
                      data={item}
                      handleDel={() => handleDel(item.User.id)}
                      handleLeave={() => handleLeave(item.User.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View className="py-10 items-center">
              <View className="bg-slate-100 rounded-3xl p-4 mb-4">
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=73429&format=png&color=000000"
                  width={32}
                  height={32}
                  color="#94a3b8"
                />
              </View>
              <Text className="text-base font-semibold text-slate-500 text-center">
                No members found
              </Text>
              <Text className="text-sm text-slate-400 mt-1 text-center">
                Add the first member to get started
              </Text>
            </View>
          )}
        </View>
        {/* Action Buttons */}
        <View className="mx-5 gap-3">
          {/* Leave Group Button */}
          <TouchableOpacity
            onPress={() => handleLeave(Number(profile?.User.id))}
            className="bg-amber-500 rounded-xl py-4 px-5 flex-row items-center justify-center gap-2.5 shadow-md"
          >
            <ImageCustom
              width={20}
              height={20}
              color="white"
              source="https://img.icons8.com/?size=100&id=9433&format=png&color=000000"
            />
            <Text className="text-white font-bold text-base">Leave Group</Text>
          </TouchableOpacity>

          {/* Delete Group Button (Admin Only) */}
          {isAdmin && (
            <TouchableOpacity
              onPress={handeleDeleteGroup}
              className="bg-red-500 rounded-xl py-4 px-5 flex-row items-center justify-center gap-2.5 shadow-md"
            >
              <ImageCustom
                width={20}
                height={20}
                color="white"
                source="https://img.icons8.com/?size=100&id=68064&format=png&color=000000"
              />
              <Text className="text-white font-bold text-base">
                Delete Group
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default SquadDetail;
