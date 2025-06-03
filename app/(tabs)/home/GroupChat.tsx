import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { useLocalSearchParams } from "expo-router";
import { initializeChatModule, sendMessage } from "../../../sockets/ChatModule";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "../../../components/Image/Avatar";
import { chatSocket } from "./SOSMap";
const GroupChat = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
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
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      return;
    }
    try {
      sendMessage(chatSocket, messageContent, groupId, profile?.id!);
      setMessageContent("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
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

      <View className="absolute bottom-9 w-full px-4 bg-red-400 pb-2">
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
          {/* Input field */}
          <TextInput
            value={messageContent}
            onChangeText={setMessageContent}
            placeholder="Enter your message..."
            className="flex-1 h-10 px-4 text-base"
            placeholderTextColor="#888"
          />

          {/* Send message button */}
          <TouchableOpacity
            onPress={handleSendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#fbdada]"
          >
            <ImageCustom
              width={20}
              height={20}
              color="#EB4747"
              source="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default GroupChat;
