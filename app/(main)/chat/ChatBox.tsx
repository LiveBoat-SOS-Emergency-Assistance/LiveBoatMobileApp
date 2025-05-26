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
import * as ImagePicker from "react-native-image-picker";
import { uploadFileToGCS } from "../../../utils/uploadAvatar";
import { Image } from "react-native";
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
  type MediaFile = {
    uri: string | undefined;
    type: string | undefined;
    name: string;
  };
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isSocketReady, setSocketReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  console.log("Group ID:", groupId);
  const { socket, messages, sendMessage, joinGroup, socketEvents } =
    useChatSocket();

  useEffect(() => {
    // console.log("Client:", { socket: socket.current, groupId, senderId });
    if (socket.current && socket.current.connected && groupId && senderId) {
      joinGroup(groupId, senderId);
    } else {
      socket.current?.on("connect", () => joinGroup(groupId, senderId));
    }
  }, [socket.current, groupId, senderId]);

  useEffect(() => {
    // console.log("Messages updated:", messages.length, messages);
    if (flatListRef.current && messages.length > 0) {
      console.log("Attempting to scroll to end");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  const pickImage = async () => {
    const options = {
      mediaType: "photo" as const,
      selectionLimit: 3,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        Alert.alert("Error", `Image picker error: ${response.errorMessage}`);
      } else {
        if (response.assets && Array.isArray(response.assets)) {
          const selectedImages = response.assets
            .filter((asset) => {
              // Chỉ chấp nhận JPG và PNG
              const type = asset.type?.toLowerCase();
              return (
                type?.includes("jpeg") ||
                type?.includes("jpg") ||
                type?.includes("png")
              );
            })
            .map((asset) => ({
              uri: asset.uri,
              type: asset.type,
              name:
                asset.fileName?.replace(/\.heif$/i, ".jpg") ||
                `image-${Date.now()}.jpg`,
            }));

          if (selectedImages.length === 0) {
            Alert.alert("Error", "Please select JPG or PNG images only");
            return;
          }

          setMediaFiles((prev) => [...prev, ...selectedImages]);
        }
      }
    });
  };
  // Function to upload media files using uploadFileToGCS
  const uploadMediaFiles = async (files: any[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadFileToGCS(file);
        if (result.success) {
          return result.fileUrl;
        } else {
          throw new Error(`Failed to upload file: ${file.name}`);
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls.filter((url) => url); // Filter out any failed uploads
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() && mediaFiles.length === 0) {
      Alert.alert("Error", "Please enter a message or select media files");
      return;
    }

    try {
      let uploadedMediaUrls: (string | undefined)[] = [];
      if (mediaFiles.length > 0) {
        uploadedMediaUrls = await uploadMediaFiles(mediaFiles);
      }
      console.log("Uploaded Media URLs:", uploadedMediaUrls);
      if (!messageContent && uploadedMediaUrls.length === 0) {
        Alert.alert("Error", "Please enter a message or select media files");
        return;
      }

      const data = {
        senderId,
        groupId,
        messageContent,
        media_url: uploadedMediaUrls,
      };

      sendMessage(senderId, groupId, messageContent, uploadedMediaUrls);
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
            {item?.content && (
              <View
                className={`${
                  isMyMessage ? "bg-[#f1f1f1]" : "bg-[#f1f1f1]"
                } px-4 py-2 rounded-lg max-w-[70%]`}
              >
                <Text className="text-sm text-gray-800">{item.content}</Text>
              </View>
            )}
            <View className="flex flex-col space-y-2 mt-2 max-w-[70%]">
              {item.media_url?.map(
                (url: any, index: React.Key | null | undefined) => {
                  // console.log("Media URL:", url);
                  return (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={{
                        width: 200,
                        height: 200,
                        marginTop: 5,
                        borderRadius: 8,
                      }}
                    />
                  );
                }
              )}
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
              {item.media_url?.length > 0 && (
                <View className="flex flex-col space-y-2 mt-2 max-w-[70%]">
                  {item.media_url.map((url: any, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 8,
                        resizeMode: "cover",
                      }}
                    />
                  ))}
                </View>
              )}
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
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
          {mediaFiles.length > 0 && (
            <View className="flex absolute bottom-20 flex-row flex-wrap gap-2 px-5 mb-2">
              {mediaFiles.map((file, index) => (
                <Image
                  key={index}
                  source={{ uri: file.uri }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              ))}
            </View>
          )}
          <View className="absolute bottom-4 w-full px-4">
            <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
              {/* Input field */}
              <TextInput
                value={messageContent}
                onChangeText={setMessageContent}
                placeholder="Enter your message..."
                className="flex-1 h-10 px-4 text-base"
                placeholderTextColor="#888"
              />

              {/* Upload image button */}
              <TouchableOpacity
                onPress={pickImage}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100"
              >
                <ImageCustom
                  width={20}
                  height={20}
                  color="gray"
                  source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
                />
              </TouchableOpacity>

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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default ChatBox;
