import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 py-8">
      {/* Header */}
      <View className="bg-white px-5 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-100 rounded-full p-2.5 mr-4"
          >
            <ImageCustom
              width={20}
              height={20}
              source="https://img.icons8.com/?size=100&id=20i9yZTsnnmg&format=png&color=000000"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800 flex-1">
            Privacy Policy
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <View className="bg-blue-50 mx-5 mt-5 rounded-2xl p-4">
          <Text className="text-blue-800 font-semibold text-center">
            Last Updated: May 24, 2025
          </Text>
        </View>

        {/* Introduction */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Introduction
          </Text>
          <Text className="text-slate-600 leading-6">
            LiveBoat ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our emergency response
            mobile application.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Information We Collect
          </Text>

          <View className="mb-4">
            <Text className="font-semibold text-slate-700 mb-2">
              1. Personal Information
            </Text>
            <Text className="text-slate-600 leading-6 mb-2">
              • Name, email address, phone number
            </Text>
            <Text className="text-slate-600 leading-6 mb-2">
              • Profile information and emergency contacts
            </Text>
            <Text className="text-slate-600 leading-6">
              • Account preferences and settings
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-semibold text-slate-700 mb-2">
              2. Location Information
            </Text>
            <Text className="text-slate-600 leading-6 mb-2">
              • Real-time GPS location during SOS emergencies
            </Text>
            <Text className="text-slate-600 leading-6">
              • Location history for emergency response purposes
            </Text>
          </View>

          <View>
            <Text className="font-semibold text-slate-700 mb-2">
              3. Usage Data
            </Text>
            <Text className="text-slate-600 leading-6 mb-2">
              • App usage patterns and features used
            </Text>
            <Text className="text-slate-600 leading-6">
              • Device information and technical logs
            </Text>
          </View>
        </View>

        {/* How We Use Your Information */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            How We Use Your Information
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • Provide emergency response services and SOS alerts
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • Connect you with rescue teams and emergency contacts
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • Improve app functionality and user experience
          </Text>
          <Text className="text-slate-600 leading-6">
            • Send important notifications about your safety
          </Text>
        </View>

        {/* Information Sharing */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Information Sharing
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            We may share your information only in these circumstances:
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • With emergency responders during SOS situations
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • With your designated emergency contacts
          </Text>
          <Text className="text-slate-600 leading-6">
            • When required by law or to protect safety
          </Text>
        </View>

        {/* Data Security */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Data Security
          </Text>
          <Text className="text-slate-600 leading-6">
            We implement industry-standard security measures to protect your
            personal information. However, no method of transmission over the
            internet is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>

        {/* Your Rights */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Your Rights
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            You have the right to:
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • Access and update your personal information
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            • Request deletion of your data
          </Text>
          <Text className="text-slate-600 leading-6">
            • Opt-out of non-essential communications
          </Text>
        </View>

        {/* Contact Information */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Contact Us
          </Text>
          <Text className="text-slate-600 leading-6 mb-2">
            If you have questions about this Privacy Policy, please contact us:
          </Text>
          <Text className="text-blue-600 leading-6 mb-2">
            Email: privacy@liveboat.com
          </Text>
          <Text className="text-blue-600 leading-6">
            Phone: +84 123 456 789
          </Text>
        </View>

        {/* Agreement */}
        <View className="bg-amber-50 mx-5 mt-5 mb-5 rounded-2xl p-4 border border-amber-200">
          <Text className="text-amber-800 text-center font-semibold">
            By using LiveBoat, you agree to this Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
