import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Avatar from "../../../components/Image/Avatar";
import { router, useLocalSearchParams } from "expo-router";
import ImageCustom from "../../../components/Image/Image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useChatSocket } from "../../../hooks/useChatSocket";
interface ChatMessageProps {
  data: {
    avatar_url: string;
    sender_name: string;
    content: string;
    media_url?: string[];
  };
}
const ChatBox = () => {
  const { Id, name } = useLocalSearchParams();
  const { profile } = useAuth();
  const [groupId, setGroupId] = useState(Number(Id));
  const [senderId, setSenderId] = useState(Number(profile?.id));
  const [messageContent, setMessageContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSocketReady, setSocketReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  console.log("Group ID:", groupId);
  const { socket, messages, sendMessage, joinGroup, socketEvents } =
    useChatSocket();

  useEffect(() => {
    console.log("Client:", { socket: socket.current, groupId, senderId });
    if (socket.current && socket.current.connected && groupId && senderId) {
      joinGroup(groupId, senderId);
    } else {
      socket.current?.on("connect", () => joinGroup(groupId, senderId));
    }
  }, [socket.current, groupId, senderId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() && mediaFiles.length === 0) {
      Alert.alert("Error", "Please enter a message or select media files");
      return;
    }

    try {
      const data = {
        senderId,
        groupId,
        messageContent,
        mediaFiles,
      };
      if (!senderId) return;
      // socket?.current?.emit("send_message", data);
      sendMessage(senderId, groupId, messageContent, mediaFiles);
      setMessageContent("");
      setMediaFiles([]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = Number(item.User?.id) === Number(senderId);
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
            <Avatar width={40} height={40} source={item?.User.avatar_url} />
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
    <GestureHandlerRootView className="flex-1 bg-white relative">
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View className="flex flex-row items-center gap-3 px-5 border-b border-gray-200 pt-4 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-start"
            >
              <ImageCustom
                width={25}
                height={25}
                source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
              />
            </TouchableOpacity>
            <View className="w-[60px] h-[60px] bg-[#fbdada] rounded-full flex justify-center items-center">
              <Text className="font-bold text-[#EB4747] text-xl">
                {typeof name === "string" ? name.charAt(0).toUpperCase() : "A"}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-[#404040]">{name}</Text>
              <View className="flex flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-[#1fb141]"></View>
                <Text className="text-sm text-gray-500">Online</Text>
              </View>
            </View>
          </View>
          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => `message-${index}`}
            renderItem={renderMessage}
            inverted={false}
            className="flex-1 w-full mb-20 mt-5 px-5"
          />
          <View className="absolute bottom-2">
            <View className="flex flex-row w-full px-5 gap-2">
              <View className="relative w-[85%] h-[40px] border border-gray-200 rounded-full flex-row items-center px-3 py-2">
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default ChatBox;
