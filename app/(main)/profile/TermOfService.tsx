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

const TermsOfService = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-5 py-10 shadow-sm border-b border-slate-100">
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
            Terms of Service
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <View className="bg-gradient-to-r from-blue-50 to-indigo-50 mx-5 mt-5 rounded-2xl p-4 border border-blue-100">
          <Text className="text-blue-800 font-semibold text-center text-base">
            Last Updated: May 25, 2025
          </Text>
          <Text className="text-blue-600 text-sm text-center mt-1">
            Effective Date: May 25, 2025
          </Text>
        </View>

        {/* Welcome Message */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow-sm border border-slate-100">
          <View className="flex-row items-center gap-2 mb-3">
            <ImageCustom
              source={require("../../../assets/images/liveboatappicon.png")}
              width={24}
              height={24}
            />
            <Text className="text-lg font-bold text-slate-800">
              Welcome to LiveBoat
            </Text>
          </View>
          <Text className="text-slate-600 text-base leading-6">
            These Terms of Service ("Terms") govern your use of the LiveBoat
            mobile application and emergency response services. By using our
            app, you agree to these terms.
          </Text>
        </View>

        {/* 1. Acceptance of Terms */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            1. Acceptance of Terms
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            By downloading, installing, or using the LiveBoat application, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service.
          </Text>
          <Text className="text-slate-600 text-base leading-6">
            If you do not agree to these terms, please do not use our services.
          </Text>
        </View>

        {/* 2. Service Description */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            2. Service Description
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            LiveBoat is an emergency response and rescue coordination platform
            that provides:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Emergency SOS alerts and notifications
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Real-time location tracking during emergencies
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Communication with rescue teams and squads
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Emergency resource coordination
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Community-based rescue operations
            </Text>
          </View>
        </View>

        {/* 3. User Responsibilities */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            3. User Responsibilities
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            As a user of LiveBoat, you agree to:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Use the service only for legitimate emergency situations
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Provide accurate and truthful information
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Not misuse emergency features or create false alarms
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Respect other users and rescue personnel
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Follow local laws and emergency protocols
            </Text>
          </View>
        </View>

        {/* 4. Emergency Services Disclaimer */}
        <View className="bg-gradient-to-r from-yellow-50 to-orange-50 mx-5 mt-4 rounded-2xl p-5 border-2 border-yellow-200">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <Text className="text-white font-bold text-sm">!</Text>
            </View>
            <Text className="text-lg font-bold text-yellow-800">
              Important Emergency Notice
            </Text>
          </View>
          <Text className="text-yellow-800 text-base leading-6 mb-3 font-medium">
            LiveBoat is a supplementary emergency response tool and should not
            replace official emergency services.
          </Text>
          <Text className="text-yellow-700 text-base leading-6">
            Always contact local emergency services (police, fire, medical)
            through official channels (911, 113, etc.) for immediate assistance
            in life-threatening situations.
          </Text>
        </View>

        {/* 5. Account and Registration */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            5. Account and Registration
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            To use certain features of LiveBoat, you must create an account. You
            agree to:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Provide accurate registration information
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Keep your login credentials secure
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Update your profile information as needed
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Notify us immediately of any unauthorized access
            </Text>
          </View>
        </View>

        {/* 6. Privacy and Data */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            6. Privacy and Data Protection
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            Your privacy is important to us. We collect and use your data to
            provide emergency services including:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Location data during emergency situations
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Contact information for rescue coordination
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Emergency contacts and medical information
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Communication logs for service improvement
            </Text>
          </View>
        </View>

        {/* 7. Limitation of Liability */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            7. Limitation of Liability
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            LiveBoat provides emergency coordination services but cannot
            guarantee:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Immediate response to all emergency calls
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Availability of rescue personnel at all times
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Successful rescue outcomes in all situations
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Uninterrupted service availability
            </Text>
          </View>
        </View>

        {/* 8. Prohibited Uses */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            8. Prohibited Uses
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            You may not use LiveBoat to:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Submit false emergency reports or hoax calls
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Harass or threaten other users or rescue personnel
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Interfere with emergency response operations
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Use the service for commercial purposes without permission
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Violate any applicable laws or regulations
            </Text>
          </View>
        </View>

        {/* 9. Service Availability */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            9. Service Availability
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            We strive to maintain service availability but cannot guarantee
            uninterrupted access due to:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Network connectivity issues
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Scheduled maintenance and updates
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Technical difficulties or server problems
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Force majeure events or natural disasters
            </Text>
          </View>
        </View>

        {/* 10. Termination */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            10. Account Termination
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            We reserve the right to suspend or terminate your account if you:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Violate these Terms of Service
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Misuse emergency features or submit false reports
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Engage in harmful or illegal activities
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • Fail to comply with emergency protocols
            </Text>
          </View>
        </View>

        {/* 11. Updates to Terms */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            11. Updates to Terms
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            We may update these Terms of Service from time to time. When we do:
          </Text>
          <View className="ml-4">
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • We will notify you through the app or email
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • The updated date will be revised above
            </Text>
            <Text className="text-slate-600 text-base leading-6 mb-2">
              • Continued use constitutes acceptance of new terms
            </Text>
            <Text className="text-slate-600 text-base leading-6">
              • You may stop using the service if you disagree
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View className="bg-gradient-to-r from-red-50 to-pink-50 mx-5 mt-4 rounded-2xl p-5 border border-red-100">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-3">
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=9730&format=png&color=ffffff"
                width={24}
                height={24}
              />
            </View>
            <Text className="text-lg font-bold text-red-800">Contact Us</Text>
          </View>
          <Text className="text-red-700 text-base leading-6 mb-3">
            If you have questions about these Terms of Service, please contact
            us:
          </Text>
          <View className="ml-4">
            <Text className="text-red-700 text-base leading-6 mb-2">
              📧 Email: legal@liveboat.com
            </Text>
            <Text className="text-red-700 text-base leading-6 mb-2">
              📞 Phone: +84 (0) 236 123 4567
            </Text>
            <Text className="text-red-700 text-base leading-6 mb-2">
              🏢 Address: Da Nang, Vietnam
            </Text>
            <Text className="text-red-700 text-base leading-6">
              ⏰ Support Hours: 24/7 Emergency Support
            </Text>
          </View>
        </View>

        {/* Acknowledgment */}
        <View className="bg-white mx-5 mt-4 mb-6 rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Acknowledgment
          </Text>
          <Text className="text-slate-600 text-base leading-6 mb-3">
            By using LiveBoat, you acknowledge that you have read and understood
            these Terms of Service and agree to be bound by them.
          </Text>
          <Text className="text-slate-600 text-base leading-6 italic">
            Thank you for using LiveBoat to help build a safer community
            together.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfService;
