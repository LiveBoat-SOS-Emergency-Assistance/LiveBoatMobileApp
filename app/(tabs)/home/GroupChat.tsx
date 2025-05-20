import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { useLocalSearchParams } from "expo-router";
import { getChatSocket } from "../../../utils/socket";
import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "../../../components/Image/Avatar";
import { chatSocket } from "./SOSMap";
const GroupChat = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  // const chatSocket = getChatSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const { profile } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatSocket || !groupId) return;

    initializeChatModule({
      chatSocket,
      groupId,
      onNewMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onChatHistory: (msgs) => setMessages(msgs),
    });

    return () => {
      chatSocket.off("receive_message");
      chatSocket.off("chat_history");
    };
  }, [chatSocket, groupId]);
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(chatSocket, messageContent, groupId, profile?.id!);
    setMessageContent("");
  };
  const renderItem = ({ item }: { item: any }) => {
    const isMyMessage = item.name === profile?.name;
    return (
      <View
        className={`flex flex-row  gap-3 mb-3 w-full  ${
          isMyMessage ? "justify-end" : "justify-start"
        }`}
      >
        {isMyMessage ? (
          <>
            <View
              className={`${
                isMyMessage ? "bg-[#f1f1f1]" : "bg-[#f1f1f1]"
              } px-4 py-2 rounded-lg max-w-[70%]`}
            >
              <Text className="text-sm text-gray-800">{item.content}</Text>
            </View>

            <Avatar width={40} height={40} source={profile?.User.avatar_url} />
          </>
        ) : (
          <>
            <Avatar width={40} height={40} source={item?.avatar_url} />
            <View
              className={`${
                isMyMessage ? "bg-[#f1f1f1]" : "bg-[#f1f1f1]"
              } px-4 py-2 rounded-lg max-w-[70%]`}
            >
              <Text className="text-sm text-gray-800">{item.content}</Text>
            </View>
          </>
        )}
      </View>
    );
  };
  return (
    <View className="w-full h-full bg-red-400  relative ">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
      <View className="absolute bottom-16">
        <View className="flex flex-row w-full px-5 gap-2">
          <View className="relative w-[85%] h-[40px] border bg-white border-gray-200 rounded-full  flex-row items-center px-3 py-2">
            <ImageCustom
              width={20}
              height={20}
              color="gray"
              className="abosolute left-1"
              source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
            ></ImageCustom>
            <TextInput
              value={messageContent}
              onChangeText={setMessageContent}
              placeholder="Enter message..."
              className="w-full h-full pl-2 pr-3 "
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-[#fbdada]  p-3 rounded-full"
          >
            <ImageCustom
              width={20}
              height={20}
              color="#EB4747"
              source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
            ></ImageCustom>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default GroupChat;
