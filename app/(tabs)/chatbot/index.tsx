import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ImageCustom from "../../../components/Image/Image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { aiURL } from "../../../baseUrl";
import LottieView from "lottie-react-native";
import { Key } from "lucide-react-native";
import { Image } from "react-native";

export default function Chatbot(): JSX.Element {
  const angleAnim = useRef(new Animated.Value(0)).current;
  const [colors, setColors] = useState(["#D5F0F2", "#F7A3A3", "#F7D8AD"]);
  const [messageContent, setMessageContent] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const [check, setCheck] = useState(false);
  const [apiUrl] = useState(aiURL);
  const scrollViewRef = useRef<ScrollView>(null);
  const fetchUrl = `${apiUrl.trim()}/api/generate`;
  const [typing, setTyping] = useState(false);
  // const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "ai" | "error" | "loading"; content: string }[]
  >([]);
  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(angleAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(angleAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    );
    animate.start();

    const listenerId = angleAnim.addListener(({ value }) => {
      const c1 = interpolateColor(value, "#D5F0F2", "#F7A3A3");
      const c2 = interpolateColor(value, "#F7A3A3", "#F7D8AD");
      const c3 = interpolateColor(value, "#F7D8AD", "#D5F0F2");
      setColors([c1, c2, c3]);
    });

    return () => {
      angleAnim.removeListener(listenerId);
    };
  }, []);

  const sendMessageToAPI = async (userMessage: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", content: userMessage },
    ]);

    setMessageContent("");

    try {
      setTyping(true);
      console.log("Fetch URL:", fetchUrl);

      if (!apiUrl || !apiUrl.startsWith("http")) {
        throw new Error("Invalid API URL");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          system: `You are an emergency response assistant. Only provide direct, concise answers related to emergencies including accidents, natural disasters, medical issues, or situations like getting lost.
You can answer questions in English or Vietnamese.
If the user's question is completely unrelated to these topics, reply exactly:
"Sorry, your request is not related to emergency assistance." and do not say anything, or elaborate whatsoever anymore.
Answer directly without any introductory phrases. Focus only on giving the answer or refusal.
If the user says things like greetings, reply with: "Hello, how can I help you?"
If the input is ambiguous or unclear but could still relate to healthcare, politely ask for clarification.
`,
          prompt: userMessage,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data.response);

      const aiResponse = `${data.response || "No response from AI."}`;
      setTyping(false);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", content: aiResponse || "No response from AI." },
      ]);

      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err: any) {
      console.error("Error in sendMessageToAPI:", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "error", content: err.message },
      ]);
    }
  };

  const handleSendMessage = async () => {
    setCheck(true);
    if (!messageContent.trim()) {
      textInputRef.current?.focus();
      return;
    }
    Keyboard.dismiss();
    await sendMessageToAPI(messageContent.trim());
    setMessageContent("");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      > */}
      <View className="relative h-full">
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          onPress={() => {
            setChatHistory([]);
            setCheck(false);
            router.replace("/(tabs)/home");
          }}
          className="items-start flex absolute top-16 left-5 z-50 w-[20px]"
        >
          <ImageCustom
            width={20}
            height={20}
            color="#EB4747"
            source="https://img.icons8.com/?size=100&id=8112&format=png&color=000000"
          />
        </TouchableOpacity>
        <View className="flex w-full h-[100px] bg-transparent"></View>
        {check ? (
          <ScrollView
            // className=""
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            style={{ height: 300 }}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingBottom: 80,
              paddingHorizontal: 10,
            }}
          >
            {chatHistory.map((message, index) =>
              message.sender === "ai" ? (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <ImageCustom
                    source={require("../../../assets/images/chatbot.png")}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                  <View className="mb-3 p-2 rounded-xl self-start bg-white max-w-[75%]">
                    <Text className="color-black">{message.content}</Text>
                  </View>
                </View>
              ) : (
                <View
                  key={index}
                  className={`mb-3 p-2 rounded-xl ${
                    message.sender === "user"
                      ? "self-end bg-white"
                      : message.sender === "error"
                      ? "self-start bg-red-100"
                      : "self-start bg-white"
                  }`}
                  style={
                    message.sender === "user"
                      ? { alignSelf: "flex-end", maxWidth: "75%" }
                      : { alignSelf: "flex-start", maxWidth: "75%" }
                  }
                >
                  <Text className="color-black">
                    {message.sender === "error"
                      ? "Oops, something went wrong!"
                      : message.content}
                  </Text>
                </View>
              )
            )}

            {typing && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <ImageCustom
                  source={require("../../../assets/images/chatbot.png")}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                <View
                  style={{
                    width: 60,
                    height: 30,
                    backgroundColor: "#f3f4f6",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <LottieView
                    source={{
                      uri: "https://lottie.host/f52662c5-7c67-4040-a539-899bb0dfbf7d/0pB91FaotS.lottie",
                    }}
                    autoPlay
                    loop
                    speed={2}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="flex-1 z-10 justify-center items-center px-5">
            <View className="flex flex-col gap-2 items-center">
              <Text className="font-normal text-2xl text-white">
                Hello, Bach Duong!
              </Text>
              <Text className="text-2xl text-white">
                How can I help you today?
              </Text>
              {/* <Image
                  width={20}
                  height={20}
                  source={require("../../../assets/images/chatbot.png")}
                ></Image> */}
            </View>
          </View>
        )}
        <View className="pb-2 z-50">
          <View className="flex flex-row w-full px-5 gap-4">
            <View className="relative w-[85%] h-[40px] border border-gray-200 rounded-full bg-white flex-row items-center px-3 py-2">
              <ImageCustom
                width={20}
                height={20}
                color="gray"
                className="absolute left-3"
                source="https://img.icons8.com/?size=100&id=59728&format=png&color=000000"
              />
              <TextInput
                ref={textInputRef}
                value={messageContent}
                onChangeText={setMessageContent}
                placeholder="Enter message..."
                className="w-full h-full pl-8 pr-3 text-black"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSendMessage}
              className="bg-white p-3 rounded-full z-50"
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
      {/* </KeyboardAvoidingView> */}
    </GestureHandlerRootView>
  );
}

function interpolateColor(
  value: number,
  color1: string,
  color2: string
): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * value);
  const g = Math.round(c1.g + (c2.g - c1.g) * value);
  const b = Math.round(c1.b + (c2.b - c1.b) * value);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string) {
  const parsedHex = hex.replace("#", "");
  const bigint = parseInt(parsedHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
