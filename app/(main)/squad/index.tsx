import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { groupServices } from "../../../services/group";
import InfiniteScrollPagination from "../../../components/Pagination/InfiniteScrollPagination";
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
    <View className="w-full flex flex-col bg-white h-full">
      <View className="flex flex-col w-full relative h-[200px]">
        <Image
          source={require("../../../assets/images/bgfamily.jpg")}
          className="w-full object-cover h-[200px]"
        ></Image>
        <View className="bg-[#404040] w-full absolute top-0 h-[200px] opacity-0"></View>

        <View className="flex flex-col gap-8 px-3">
          <View className="justify-between w-full px-4 flex flex-row pt-10 items-center">
            <Text className="font-bold text-[#404040] text-[20px]">Squad:</Text>
            <View className="flex flex-row gap-3">
              {isAdmin && (
                <TouchableOpacity
                  onPress={handleEdit}
                  activeOpacity={0.8}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    cursor: "pointer",
                  }}
                  className="flex flex-row justify-center items-center px-3 py-2 bg-[#80C4E9] rounded-[30px] gap-2 cursor-pointer"
                >
                  <ImageCustom
                    width={15}
                    height={15}
                    color="white"
                    source="https://img.icons8.com/?size=100&id=86374&format=png&color=000000"
                  ></ImageCustom>
                  <Text className="text-white font-bold">Edit</Text>
                </TouchableOpacity>
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={handeleDeleteGroup}
                  activeOpacity={0.8}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                  className="flex flex-row justify-center items-center px-4 py-2 bg-[#EB4747] rounded-[30px] gap-2"
                >
                  <ImageCustom
                    width={15}
                    height={15}
                    color="white"
                    source="https://img.icons8.com/?size=100&id=68064&format=png&color=000000"
                  ></ImageCustom>
                  <Text className="text-white font-bold">Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View className="flex w-full flex-row px-4">
            <TextInput
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 3,
              }}
              onChangeText={setNameGroup}
              value={nameGroup}
              editable={isAdmin}
              className="w-full rounded-[30px] border border-[#80C4E9] h-[40px] px-7 bg-white text-[#559CC3] font-bold"
            ></TextInput>
          </View>
          <View className="flex flex-col px-4 gap-3">
            <Text className="font-bold text-[#404040] text-[20px]">
              Member:
            </Text>
            <View className="flex flex-row gap-5 w-full justify-center items-center">
              <View
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                className="w-[90%] justify-center flex items-center flex-row px-2"
              >
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  className="rounded-[30px] border border-[#80C4E9] h-[40px] px-7 bg-white text-[#559CC3] font-bold w-full text-[11px]"
                ></TextInput>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
                  width={30}
                  height={30}
                  color="#80C4E9"
                  className="absolute right-5 top-2"
                ></ImageCustom>
              </View>
              <Pressable
                onPress={handleAddMember}
                className="w-[10%] flex justify-center items-center pb-14 "
              >
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=UkLBG0sZoWV0&format=png&color=000000"
                  width={30}
                  height={30}
                  color="#80C4E9"
                  className="absolute right-4 top-3"
                ></ImageCustom>
              </Pressable>
            </View>
            <View className=" flex flex-col w-full h-[250px] scroll-auto">
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false} // Hide the scroll indicator
                style={{ paddingHorizontal: 10 }}
              >
                <InfiniteScrollPagination
                  data={listMember}
                  itemsPerPage={2}
                  renderItem={(item) => (
                    <MemberGroup
                      data={item}
                      handleDel={() => handleDel(item.User.id)}
                      handleLeave={() => handleLeave(item.User.id)}
                    />
                  )}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default SquadDetail;
