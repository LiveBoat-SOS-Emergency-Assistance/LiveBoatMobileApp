import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacity as TouchableOpacityType,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, Filter, Users } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ChatItem from "../../../components/Card/ChatItem";
import { notifcationService } from "../../../services/notification";
import Toast from "react-native-toast-message";
import { groupServices } from "../../../services/group";
import InviteItem from "../../../components/Invite/InviteItem";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";
import SystemItem from "../../../components/Card/SystemItem";
const ChatScreen = () => {
  const [selectedValue, setSelectedValue] = useState<string>("alert");
  const [open, setOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const touchableRef = useRef<React.ElementRef<typeof TouchableOpacity> | null>(
    null
  );
  const [historyChat, setHistoryChat] = useState<any[]>([]);
  const [listInvite, setListInvite] = useState<any[]>([]);
  const [systemNotification, setSystemNotification] = useState<any[]>([]);
  const options = [
    { label: "Alert", value: "alert" },
    { label: "Chat", value: "chat" },
    { label: "Squad", value: "squad" },
    { label: "Invite", value: "invite" },
  ];
  const handleLayout = () => {
    touchableRef.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        setDropdownWidth(width);
      }
    );
  };
  // Function for Invite Tab
  const handleAcceptInvite = async (inviteId: string) => {
    try {
      console.log(inviteId);
      const result = await groupServices.updateInvite(Number(inviteId), {
        status: "ACCEPTED",
      });
      if (result) {
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Accept invite successfully",
        });
        setListInvite((prev) =>
          prev.filter((invite) => invite.id !== inviteId)
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      // Display the error message using Toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };
  const handleRejectInvite = async (inviteId: string) => {
    try {
      const result = await groupServices.updateInvite(Number(inviteId), {
        status: "DECLINED",
      });
      if (result) {
        Toast.show({
          type: "success",
          text1: "Notification",
          text2: "Reject invite successfully",
        });
        setListInvite((prev) =>
          prev.filter((invite) => invite.id !== inviteId)
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      // Display the error message using Toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };
  const renderListChat = async (route: string) => {
    if (route === "alert") {
      try {
        const result = await notifcationService.get_notification();
        console.log(result.data);

        setSystemNotification(result.data);
      } catch (error: any) {
        console.log(error);
      }
    } else if (route === "invite") {
      try {
        const result = await groupServices.getInvites();
        const pendingInvites = result.data.filter(
          (invite: any) => invite.status === "PENDING"
        );
        setListInvite(pendingInvites);
      } catch (error: any) {
        console.log(error);
      }
    } else if (route === "squad") {
      try {
        const result = await groupServices.getChat("GROUP");
        console.log(result.data);
        setHistoryChat(result.data);
      } catch (error: any) {
        console.log(error);
      }
    } else {
      setHistoryChat([]);
    }
  };

  useEffect(() => {
    renderListChat(selectedValue);
  }, [selectedValue]);

  const handlePress = (Id: number, name: string) => {
    router.push({
      pathname: "(main)/chat/ChatBox",
      params: { Id, name },
    });
  };

  return (
    <View className="flex flex-col w-full flex-1 h-full bg-white">
      <View className="w-full pt-14 flex flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 px-5"
        >
          <ImageCustom
            width={25}
            height={25}
            source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
          />
        </TouchableOpacity>
        <Text className="text-[24px] text-[#404040] font-bold">My Inbox</Text>
      </View>
      <View className="flex-row items-center border-b border-gray-200  justify-between py-4 px-5 ">
        {/* Left */}

        <View className="relative z-50">
          <TouchableOpacity
            ref={touchableRef}
            onPress={() => {
              setOpen(!open);
              setTimeout(handleLayout, 0);
            }}
            onLayout={handleLayout}
            activeOpacity={0.9}
            className="flex-row items-center gap-2 px-2 py-2 rounded-full bg-gray-50"
          >
            <Users size={20} color="#6B7280" />
            <Text className="font-medium text-[#404040]">
              {selectedValue
                ? options.find((opt) => opt.value === selectedValue)?.label ||
                  "Alert"
                : "Alert"}
            </Text>
            <Text className="text-sm bg-green-100 text-green-600 px-2 rounded-full">
              232
            </Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
          {open && (
            <View
              style={{
                width: dropdownWidth,
              }}
              className="absolute top-full z-50 mt-2"
            >
              <DropDownPicker
                open={open}
                value={selectedValue}
                items={options}
                setOpen={setOpen}
                setValue={setSelectedValue}
                multiple={false}
                placeholder=""
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#6B7280",
                  display: "none",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#ebebec",
                }}
              />
            </View>
          )}
        </View>

        {/* Right */}
        <View className="flex-row   items-center gap-2 px-2 py-2 rounded-full bg-[#fafaff]">
          <Filter size={20} color="#6B7280" />
          <Text className="font-medium">Oldest</Text>
          <ChevronDown size={16} color="#6B7280" />
        </View>
      </View>

      <View className="flex-1 justify-center  bg-gray-50">
        <FlatList
          data={
            selectedValue === "invite"
              ? listInvite
              : selectedValue === "squad"
              ? historyChat
              : systemNotification.slice().reverse()
          }
          keyExtractor={(item, index) => `key-${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            selectedValue === "invite" ? (
              <InviteItem
                item={item}
                onAccept={handleAcceptInvite}
                onReject={handleRejectInvite}
              ></InviteItem>
            ) : selectedValue === "squad" ? (
              <View className="mb-4 px-5">
                <ChatItem
                  created_at={item?.created_at}
                  last_message_time={item?.last_message_time}
                  name={item?.name}
                  onPress={() => handlePress(item?.id, item?.name)}
                />
              </View>
            ) : (
              <View className="w-full ">
                <SystemItem
                  notification={item.Notification}
                  is_read={item.is_read}
                  notification_id={item.notification_id}
                  user_id={item.user_id}
                  // name={item?.name}
                  // onPress={() => handlePress(item?.id, item?.name)}
                />
              </View>
            )
          }
        />
      </View>
    </View>
  );
};
export default ChatScreen;
