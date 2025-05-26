import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Modal,
} from "react-native";
import { router } from "expo-router";
import ImageCustom from "../../../components/Image/Image";
import { useAuth } from "../../../context/AuthContext";
import { sosService } from "../../../services/sos";
import MapboxGL from "@rnmapbox/maps";
import UserLocation from "../../../components/Map/UserLocation";
import Avatar from "../../../components/Image/Avatar";

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
  const [mapModal, setMapModal] = useState({ visible: false, lat: 0, lng: 0 });
  const { profile } = useAuth();
  const fetchSOSHistory = async () => {
    try {
      const result = await sosService.getSOSByUserId(Number(profile?.id));
      const apiData = result.data;
      const mapped: SOSRecord[] = apiData
        .map((item: any) => ({
          id: String(item.id),
          timestamp: item.created_at,
          location: item.name || item.description || "Unknown location",
          coordinates: {
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          },
          status:
            item.status?.toLowerCase() === "canceled"
              ? "cancelled"
              : item.status?.toLowerCase() || "ongoing",
          emergencyType: item.name || "Unknown",
          responders: item.reported_count || 0,
          duration: undefined,
          description: item.description || undefined,
        }))
        .sort(
          (a: SOSRecord, b: SOSRecord) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      setSosRecords(mapped);
    } catch (error) {
      console.error("Error fetching SOS history:", error);
    }
  };
  useEffect(() => {
    fetchSOSHistory();
  }, [profile]);

  useEffect(() => {
    loadSOSHistory();
  }, []);

  const loadSOSHistory = async () => {
    await fetchSOSHistory();
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
                    className="flex-1 bg-[#80C4E9] border border-gray-200 py-2 rounded-lg"
                    onPress={() =>
                      setMapModal({
                        visible: true,
                        lat: record.coordinates.latitude,
                        lng: record.coordinates.longitude,
                      })
                    }
                  >
                    <Text className="text-white text-center font-medium text-sm">
                      Show on Map
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Map Modal */}
      <Modal
        visible={mapModal.visible}
        animationType="slide"
        transparent
        onRequestClose={() => setMapModal({ ...mapModal, visible: false })}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: 400,
              backgroundColor: "#fff",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <View style={{ flex: 1 }}>
              <MapboxGL.MapView
                style={{ flex: 1 }}
                logoEnabled={false}
                attributionEnabled={false}
                compassEnabled={true}
                scaleBarEnabled={false}
              >
                <MapboxGL.Camera
                  centerCoordinate={[mapModal.lng, mapModal.lat]}
                  zoomLevel={14}
                />

                <MapboxGL.PointAnnotation
                  id="sos-marker"
                  coordinate={[mapModal.lng, mapModal.lat]}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "red",
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  ></View>
                </MapboxGL.PointAnnotation>
              </MapboxGL.MapView>
            </View>
            <TouchableOpacity
              onPress={() => setMapModal({ ...mapModal, visible: false })}
              style={{ padding: 16, backgroundColor: "#80C4E9" }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SOSHistory;
