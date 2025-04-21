import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ChatItem from "../../../components/Card/ChatItem";
import { Image } from "react-native";

const AlertTab = () => (
  <View className="flex-1 pt-5 bg-white">
    <View className="flex flex-col gap-1">
      <ChatItem></ChatItem>
      <ChatItem></ChatItem>
    </View>
  </View>
);

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
  const [routes] = useState([
    { key: "alert", title: "Alert" },
    { key: "group", title: "Group" },
    { key: "chat", title: "Chat" },
  ]);
  const renderScene = SceneMap({
    alert: AlertTab,
    group: GroupTab,
    chat: ChatTab,
  });
  const screenWidth = Dimensions.get("window").width;
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
