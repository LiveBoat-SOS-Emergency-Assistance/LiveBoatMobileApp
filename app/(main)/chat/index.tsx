import { View, Text, Dimensions, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ChatItem from "../../../components/Card/ChatItem";
import { Image } from "react-native";
import { groupServices } from "../../../services/group";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ImageCustom from "../../../components/Image/Image";
import Toast from "react-native-toast-message";
import { notifcationService } from "../../../services/notification";

const AlertTab = ({ listSOS }: { listSOS: any[] }) => {
  return (
    <View className="flex-1 pt-16 bg-white">
      <View className="flex flex-col gap-1">
        {listSOS.length > 0 ? (
          listSOS.map((item) => <ChatItem notification={item} key={item.id} />)
        ) : (
          <View className="pt-5 justify-center items-center">
            <Image
              style={{ width: 200, height: 200 }}
              className="object-cover"
              source={require("../../../assets/images/404.jpg")}
            />
            <Text className="font-semibold text-[#404040] ">
              No messages... but we're thinking of you!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const GroupTab = () => (
  <View className="flex-1  items-center pt-20 bg-white">
    <Image
      style={{ width: 200, height: 200 }}
      className="object-cover"
      source={require("../../../assets/images/404.jpg")}
    />
    <Text className="font-semibold text-[#404040] ">
      No messages... but we're thinking of you!
    </Text>
  </View>
);
const InviteTab = ({
  listInvite,
  setListInvite,
}: {
  listInvite: any[];
  setListInvite: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
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
  return (
    <View className="flex-1 bg-white pt-5">
      {listInvite.length > 0 ? (
        <FlatList
          data={listInvite}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="px-4 py-3 border-b border-gray-200 flex flex-row justify-between items-center">
              <View className="flex flex-col">
                <Text className="text-lg font-bold text-[#404040]">
                  {item.Group.name}
                </Text>
                <Text className="text-gray-500">
                  {item.Group.description || "No description"}
                </Text>
              </View>
              <View className="flex flex-row gap-2">
                <Pressable onPress={() => handleAcceptInvite(item.id)}>
                  <ImageCustom
                    width={20}
                    height={20}
                    color="#009900"
                    source="https://img.icons8.com/?size=100&id=pmwTGmuQrtwg&format=png&color=000000"
                  ></ImageCustom>
                </Pressable>
                <Pressable onPress={() => handleRejectInvite(item.id)}>
                  <ImageCustom
                    width={20}
                    height={20}
                    color="red"
                    source="https://img.icons8.com/?size=100&id=84073&format=png&color=000000"
                  ></ImageCustom>
                </Pressable>
              </View>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Image
            style={{ width: 200, height: 200 }}
            source={require("../../../assets/images/404.jpg")}
          />
          <Text className="font-semibold text-[#404040] mt-4">
            No messages... but we're thinking of you!
          </Text>
        </View>
      )}
    </View>
  );
};
const ChatTab = () => (
  <View className="flex-1  items-center pt-20 bg-white">
    <Image
      style={{ width: 200, height: 200 }}
      className="object-cover"
      source={require("../../../assets/images/404.jpg")}
    />
    <Text className="font-semibold text-[#404040] ">
      No messages... but we're thinking of you!
    </Text>
  </View>
);

export default function ChatScreen() {
  const [index, setIndex] = useState(0);
  const [listInvite, setListInvite] = useState<any[]>([]);
  const [listSOSNotification, setListSOSNotification] = useState<any[]>([]);
  const [routes] = useState([
    { key: "alert", title: "Alert" },
    { key: "group", title: "Group" },
    { key: "invite", title: "Invite" },
    { key: "chat", title: "Chat" },
  ]);
  const getNotificationSOS = async () => {
    try {
      const result = await notifcationService.get_notification();
      // console.log("hihi", result.data);
      setListSOSNotification(result.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotificationSOS();
  }, []);
  // const renderScene = SceneMap({
  //   alert: AlertTab,
  //   group: GroupTab,
  //   chat: ChatTab,
  //   invite: InviteTab,
  // });
  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "alert":
        return <AlertTab listSOS={listSOSNotification} />;
      case "group":
        return <GroupTab />;
      case "invite":
        return (
          <InviteTab listInvite={listInvite} setListInvite={setListInvite} />
        );
      case "chat":
        return <ChatTab />;
      default:
        return null;
    }
  };

  const screenWidth = Dimensions.get("window").width;

  const getInvite = async () => {
    try {
      const result = await groupServices.getInvites();
      const pendingInvites = result.data.filter(
        (invite: any) => invite.status === "PENDING"
      );
      setListInvite(pendingInvites);
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    getInvite();
  }, []);
  return (
    <View className="flex-2 w-full h-full bg-white flex flex-col gap-3">
      <Text className="font-bold text-[28px] text-[#404040] px-8 py-3">
        My Inbox
      </Text>

      <View
        style={{
          width: screenWidth * 0.9,
          alignSelf: "center",
          flex: 1,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: screenWidth * 0.9 }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: "#EB4747",
                height: 4,
                borderRadius: 5,
              }}
              style={{ backgroundColor: "white", elevation: 2 }}
              activeColor="#EB4747"
              inactiveColor="#9f9f9f"
              pressColor="#fddede"
            />
          )}
        />
      </View>
    </View>
  );
}
