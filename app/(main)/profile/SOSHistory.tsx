import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";

interface SOSRecord {
  id: string;
  timestamp: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: "ongoing" | "resolved" | "cancelled";
  emergencyType: string;
  responders: number;
  duration?: string;
  description?: string;
}

const SOSHistory = () => {
  const [sosRecords, setSosRecords] = useState<SOSRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const mockData: SOSRecord[] = [
    {
      id: "1",
      timestamp: "2024-12-15 14:30:00",
      location: "Vũng Tàu Beach, Vietnam",
      coordinates: { latitude: 10.346, longitude: 107.0843 },
      status: "resolved",
      emergencyType: "Water Emergency",
      responders: 3,
      duration: "45 minutes",
      description: "Rescued from strong current",
    },
    {
      id: "2",
      timestamp: "2024-12-10 09:15:00",
      location: "Nha Trang Bay, Vietnam",
      coordinates: { latitude: 12.2388, longitude: 109.1967 },
      status: "ongoing",
      emergencyType: "Equipment Failure",
      responders: 2,
      description: "Boat engine failure",
    },
    {
      id: "3",
      timestamp: "2024-12-05 16:45:00",
      location: "Hạ Long Bay, Vietnam",
      coordinates: { latitude: 20.9101, longitude: 107.1839 },
      status: "cancelled",
      emergencyType: "Medical Emergency",
      responders: 0,
      description: "False alarm - resolved independently",
    },
    {
      id: "4",
      timestamp: "2024-11-28 11:20:00",
      location: "Phu Quoc Island, Vietnam",
      coordinates: { latitude: 10.2899, longitude: 103.984 },
      status: "resolved",
      emergencyType: "Lost at Sea",
      responders: 5,
      duration: "2 hours 15 minutes",
      description: "Successfully guided back to shore",
    },
  ];

  useEffect(() => {
    loadSOSHistory();
  }, []);

  const loadSOSHistory = async () => {
    // Replace with actual API call
    setSosRecords(mockData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSOSHistory();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-orange-100 border-orange-200 text-orange-700";
      case "resolved":
        return "bg-green-100 border-green-200 text-green-700";
      case "cancelled":
        return "bg-gray-100 border-gray-200 text-gray-700";
      default:
        return "bg-gray-100 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return "🚨";
      case "resolved":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "Water Emergency":
        return "🌊";
      case "Equipment Failure":
        return "⚙️";
      case "Medical Emergency":
        return "🏥";
      case "Lost at Sea":
        return "🧭";
      default:
        return "🚨";
    }
  };

  const filteredRecords =
    selectedFilter === "all"
      ? sosRecords
      : sosRecords.filter((record) => record.status === selectedFilter);

  const filters = [
    { key: "all", label: "All", count: sosRecords.length },
    {
      key: "ongoing",
      label: "Ongoing",
      count: sosRecords.filter((r) => r.status === "ongoing").length,
    },
    {
      key: "resolved",
      label: "Resolved",
      count: sosRecords.filter((r) => r.status === "resolved").length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: sosRecords.filter((r) => r.status === "cancelled").length,
    },
  ];

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: 40 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
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
        <Text className="text-lg font-semibold text-gray-800">SOS History</Text>
        <View className="w-9" />
      </View>
      {/* Stats Cards */}
      <View className="flex-row px-4 py-4 space-x-3">
        <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-2xl font-bold" style={{ color: "#80C4E9" }}>
            {sosRecords.length}
          </Text>
          <Text className="text-sm text-gray-500">Total SOS</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-2xl font-bold text-green-600">
            {sosRecords.filter((r) => r.status === "resolved").length}
          </Text>
          <Text className="text-sm text-gray-500">Resolved</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-2xl font-bold text-orange-600">
            {sosRecords.filter((r) => r.status === "ongoing").length}
          </Text>
          <Text className="text-sm text-gray-500">Ongoing</Text>
        </View>
      </View>
      {/* Filters */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3 gap-1">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor:
                    selectedFilter === filter.key ? "#80C4E9" : "white",
                  borderColor:
                    selectedFilter === filter.key ? "#80C4E9" : "#e5e7eb",
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedFilter === filter.key
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* SOS Records List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRecords.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">📋</Text>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              No SOS Records Found
            </Text>
            <Text className="text-gray-500 text-center">
              {selectedFilter === "all"
                ? "You haven't sent any SOS signals yet."
                : `No ${selectedFilter} SOS records found.`}
            </Text>
          </View>
        ) : (
          <View className="space-y-3 pb-8">
            {filteredRecords.map((record) => (
              <View
                key={record.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                {/* Header */}
                <View className="p-5 pb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "#80C4E9" + "20" }}
                      >
                        <Text className="text-lg">
                          {getEmergencyIcon(record.emergencyType)}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-800 text-base">
                          {record.emergencyType}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {formatDate(record.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full border ${getStatusColor(
                        record.status
                      )}`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          getStatusColor(record.status).split(" ")[2]
                        }`}
                      >
                        {getStatusIcon(record.status)}{" "}
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-3">
                    <ImageCustom
                      width={16}
                      height={16}
                      source="https://img.icons8.com/?size=100&id=7880&format=png&color=6b7280"
                      className="mr-2"
                    />
                    <Text className="text-sm text-gray-600 flex-1">
                      {record.location}
                    </Text>
                  </View>

                  {/* Description */}
                  {record.description && (
                    <Text className="text-sm text-gray-600 mb-3">
                      {record.description}
                    </Text>
                  )}

                  {/* Details */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <ImageCustom
                        width={16}
                        height={16}
                        source="https://img.icons8.com/?size=100&id=86&format=png&color=6b7280"
                        className="mr-1"
                      />
                      <Text className="text-sm text-gray-500">
                        {record.responders} responder
                        {record.responders !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    {record.duration && (
                      <View className="flex-row items-center">
                        <ImageCustom
                          width={16}
                          height={16}
                          source="https://img.icons8.com/?size=100&id=59&format=png&color=6b7280"
                          className="mr-1"
                        />
                        <Text className="text-sm text-gray-500">
                          {record.duration}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="bg-gray-50 px-5 py-3 flex-row space-x-3 gap-2">
                  <TouchableOpacity
                    className="flex-1 py-2 rounded-lg"
                    style={{ backgroundColor: "#80C4E9" }}
                  >
                    <Text className="text-white text-center font-medium text-sm">
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-white border border-gray-200 py-2 rounded-lg">
                    <Text className="text-gray-700 text-center font-medium text-sm">
                      Show on Map
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SOSHistory;
