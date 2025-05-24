import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  gif?: string;
  category: "emergency" | "app" | "safety" | "account";
}

const FAQ = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How to send an emergency SOS signal?",
      answer:
        "To send an SOS signal, tap the red emergency button on the home screen. Hold for 3 seconds to activate. Your location and emergency details will be sent to nearby rescuers automatically.",
      gif: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
      category: "emergency",
    },
    {
      id: 2,
      question: "How to start a live stream for rescue?",
      answer:
        "Go to the Home tab, tap 'Start Live Stream', allow camera and microphone permissions. Your live video will be broadcast to rescue teams and volunteers in your area.",
      gif: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
      category: "emergency",
    },
    {
      id: 3,
      question: "How to join a rescue squad?",
      answer:
        "Navigate to the Squad tab, browse available squads in your area, and tap 'Join'. You may need to meet certain requirements and be approved by squad leaders.",
      gif: "https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif",
      category: "app",
    },
    {
      id: 4,
      question: "What information should I include in my profile?",
      answer:
        "Include your full name, emergency contacts, medical information (allergies, blood type), and current location. This helps rescuers provide better assistance.",
      gif: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
      category: "account",
    },
    {
      id: 5,
      question: "How to enable location sharing?",
      answer:
        "Go to Settings > Privacy > Location Services, find LiveBoat app and set to 'Always'. This ensures accurate location tracking during emergencies.",
      gif: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
      category: "safety",
    },
    {
      id: 6,
      question: "What to do while waiting for rescue?",
      answer:
        "Stay calm, conserve energy, signal your location if possible, and keep your phone charged. Use the app's chat feature to communicate with rescue teams.",
      gif: "https://media.giphy.com/media/3o7qDVHln5s9aZqs2k/giphy.gif",
      category: "safety",
    },
    {
      id: 7,
      question: "How to make a donation?",
      answer:
        "Go to the Donation tab, select a cause or rescue operation, choose your donation amount, and complete the payment through secure payment methods.",
      gif: "https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif",
      category: "app",
    },
    {
      id: 8,
      question: "How to view rescue history?",
      answer:
        "Check the History tab to see all your past SOS requests, rescue operations you've participated in, and donation history.",
      gif: "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
      category: "app",
    },
  ];

  const categories = [
    {
      key: "all",
      label: "All",
      icon: "https://img.icons8.com/?size=100&id=132&format=png&color=6b7280",
    },
    {
      key: "emergency",
      label: "Emergency",
      icon: "https://img.icons8.com/?size=100&id=63308&format=png&color=ef4444",
    },
    {
      key: "app",
      label: "App Usage",
      icon: "https://img.icons8.com/?size=100&id=85500&format=png&color=eb4747",
    },
    {
      key: "safety",
      label: "Safety",
      icon: "https://img.icons8.com/?size=100&id=85467&format=png&color=22c55e",
    },
    {
      key: "account",
      label: "Account",
      icon: "https://img.icons8.com/?size=100&id=86&format=png&color=8b5cf6",
    },
  ];

  const filteredFAQ =
    selectedCategory === "all"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const toggleExpanded = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency":
        return "🚨";
      case "app":
        return "📱";
      case "safety":
        return "🛡️";
      case "account":
        return "👤";
      default:
        return "❓";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-10 bg-white shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ImageCustom
            width={20}
            height={20}
            source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">FAQ</Text>
        <View className="w-9" />
      </View>
      {/* Hero Section */}
      <View className="px-4 py-6 bg-white">
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3">
            <ImageCustom
              width={32}
              height={32}
              source="https://img.icons8.com/?size=100&id=85467&format=png&color=3b82f6"
            />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Frequently Asked Questions
          </Text>
          <Text className="text-gray-500 text-center">
            Find answers to common questions about using LiveBoat
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View className="px-4 mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row space-x-3 gap-1">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSelectedCategory(category.key)}
                  className={`flex-row items-center px-4 py-2 rounded-full border ${
                    selectedCategory === category.key
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <ImageCustom
                    width={16}
                    height={16}
                    source={category.icon}
                    className="mr-2"
                  />
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategory === category.key
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* FAQ Items */}
        <View className="px-4 space-y-3 mb-8 gap-2">
          {filteredFAQ.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <TouchableOpacity
                onPress={() => toggleExpanded(item.id)}
                className="p-5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-sm">
                      {getCategoryIcon(item.category)}
                    </Text>
                  </View>
                  <Text className="flex-1 text-base font-medium text-gray-800 mr-3">
                    {item.question}
                  </Text>
                </View>
                <View
                  className={`transform ${
                    expandedItem === item.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ImageCustom
                    width={20}
                    height={20}
                    source="https://img.icons8.com/?size=100&id=79&format=png&color=6b7280"
                  />
                </View>
              </TouchableOpacity>
              {expandedItem === item.id && (
                <View className="px-5 pb-5">
                  <View className="border-t border-gray-100 pt-4">
                    {item.gif && (
                      <View className="mb-4 rounded-xl overflow-hidden">
                        <Image
                          source={{ uri: item.gif }}
                          style={{
                            width: "100%",
                            height: 200,
                            borderRadius: 12,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    )}
                    <Text className="text-gray-600 leading-6 text-sm">
                      {item.answer}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        {/* Contact Support */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQ;
