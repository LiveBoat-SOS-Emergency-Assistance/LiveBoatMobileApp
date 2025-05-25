import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import ImageCustom from "../../../components/Image/Image";
import { groupServices } from "../../../services/group";
import ModalCreateSquad from "../../../components/Modal/ModalCreateSquad";
import Toast from "react-native-toast-message";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  avatar?: string;
  isOwner: boolean;
  isAdmin: boolean;
  status: "active" | "inactive" | "pending";
  createdAt?: string;
  lastActivity?: string;
  category: "rescue" | "community" | "emergency" | "training";
  Group?: {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  role?: string;
  userId?: string;
}

const ManageGroup = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    filterGroups();
  }, [groups, selectedFilter, searchQuery]);
  useFocusEffect(
    useCallback(() => {
      loadGroups();
      loadInvites();
      setRefreshing(false);
    }, [refreshing])
  );

  const loadGroups = async () => {
    try {
      const result = await groupServices.getGroup();
      // console.log("Fetched groups:", result.data);
      if (result && result.data) {
        const transformedGroups: Group[] = result.data.map((item: any) => ({
          id: item.id || String(Math.random()),
          name: item.name || "Unnamed Group",
          description: item.description || "No description available",
          memberCount: Math.floor(Math.random() * 50) + 5,
          avatar: `https://img.icons8.com/?size=100&id=85&format=png&color=${getRandomColor()}`,
          isOwner: item.role === "OWNER" || false,
          isAdmin: item.role === "ADMIN" || item.role === "OWNER" || false,
          status: "active" as const,
          createdAt: item.created_at || new Date().toISOString(),
          lastActivity:
            item.last_message_time ||
            item.created_at ||
            new Date().toISOString(),
          category: "community" as const,
          role: item.role || "MEMBER",
          userId: item.userId,
        }));
        setGroups(transformedGroups);
      }
    } catch (error: any) {
      console.log("Error fetching groups:", error);
      setGroups([]);
    }
  };

  const loadInvites = async () => {
    try {
      const result = await groupServices.getInvites();
      const pendingInvites = result.data.filter(
        (invite: any) => invite.status === "PENDING"
      );
      setInvites(pendingInvites);
    } catch (error: any) {
      console.log("Error fetching invites:", error);
      setInvites([]);
    }
  };

  const getRandomColor = () => {
    const colors = ["80C4E9", "4ade80", "f59e0b", "ef4444", "8b5cf6", "06b6d4"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    await loadInvites();
    setRefreshing(false);
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const result = await groupServices.updateInvite(Number(inviteId), {
        status: "ACCEPTED",
      });
      if (result) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Invite accepted successfully",
        });
        // Remove the accepted invite from list and reload groups
        setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
        await loadGroups(); // Reload groups to show the new group
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      const result = await groupServices.updateInvite(Number(inviteId), {
        status: "DECLINED",
      });
      if (result) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Invite declined successfully",
        });
        setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleRefreshAfterCreate = () => {
    loadGroups(); // Reload groups after creating new one
  };
  const filterGroups = () => {
    let filtered = groups;

    // Filter by status
    if (selectedFilter !== "all") {
      if (selectedFilter === "owned") {
        filtered = filtered.filter((group) => group.isOwner);
      } else if (selectedFilter === "pending") {
        // For invites filter, we'll handle this separately in the UI
        filtered = [];
      } else {
        filtered = filtered.filter((group) => group.status === selectedFilter);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (group.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGroups(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 border-green-200 text-green-700";
      case "pending":
        return "bg-orange-100 border-orange-200 text-orange-700";
      case "inactive":
        return "bg-gray-100 border-gray-200 text-gray-700";
      default:
        return "bg-gray-100 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "✅";
      case "pending":
        return "⏳";
      case "inactive":
        return "😴";
      default:
        return "📋";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "rescue":
        return "🚨";
      case "community":
        return "👥";
      case "emergency":
        return "🆘";
      case "training":
        return "📚";
      default:
        return "📋";
    }
  };

  const getRoleText = (group: Group) => {
    if (group.isOwner) return "Owner";
    if (group.isAdmin) return "Admin";
    return "Member";
  };

  const getRoleColor = (group: Group) => {
    if (group.isOwner) return "#80C4E9";
    if (group.isAdmin) return "#f59e0b";
    return "#6b7280";
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };
  const handleGroupAction = async (group: Group, action: string) => {
    switch (action) {
      case "view":
        // Navigate to group details
        router.push({
          pathname: "/(main)/squad",
          params: { id: group.id, name: group.name },
        });

        break;
      case "edit":
        if (group.isOwner || group.isAdmin) {
          router.push(`/(main)/squad/${group.id}`);
        } else {
          Alert.alert("Notice", "You don't have permission to edit this group");
        }
        break;
      case "leave":
        Alert.alert(
          "Confirm",
          `Are you sure you want to leave the group "${group.name}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Leave Group",
              style: "destructive",
              onPress: async () => {
                try {
                  await groupServices.leaveGroup(Number(group.id));
                  setGroups((prev) => prev.filter((g) => g.id !== group.id));
                  Alert.alert("Success", "Left group successfully");
                } catch (error: any) {
                  Alert.alert("Error", "Failed to leave group");
                }
              },
            },
          ]
        );
        break;
      case "delete":
        if (group.isOwner) {
          Alert.alert(
            "Confirm",
            `Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  try {
                    await groupServices.deleteGroup(Number(group.id));
                    setGroups((prev) => prev.filter((g) => g.id !== group.id));
                    Alert.alert("Success", "Group deleted successfully");
                  } catch (error: any) {
                    Alert.alert("Error", "Failed to delete group");
                  }
                },
              },
            ]
          );
        } else {
          Alert.alert("Notice", "Only group owner can delete the group");
        }
        break;
    }
  };
  const filters = [
    { key: "all", label: "All", count: groups.length },

    {
      key: "active",
      label: "Active",
      count: groups.filter((g) => g.status === "active").length,
    },
    {
      key: "pending",
      label: "Invites",
      count: invites.length,
    },
  ];

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
        <Text className="text-lg font-semibold text-gray-800">
          Manage Groups
        </Text>
        <TouchableOpacity
          onPress={handleCreateGroup}
          className="p-2 rounded-full"
          style={{ backgroundColor: "#80C4E9" + "20" }}
        >
          <ImageCustom
            width={20}
            height={20}
            source="https://img.icons8.com/?size=100&id=3220&format=png&color=80C4E9"
          />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View className="px-4 py-4 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <ImageCustom
            width={20}
            height={20}
            source="https://img.icons8.com/?size=100&id=132&format=png&color=6b7280"
            className="mr-3"
          />
          <TextInput
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-gray-700"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ImageCustom
                width={20}
                height={20}
                source="https://img.icons8.com/?size=100&id=46&format=png&color=6b7280"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Stats Cards */}
      <View className="flex-row px-4 py-2 space-x-3 gap-2">
        <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-2xl font-bold" style={{ color: "#80C4E9" }}>
            {groups.length}
          </Text>
          <Text className="text-sm text-gray-500">Total Groups</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-2xl font-bold text-green-600">
            {groups.filter((g) => g.status === "active").length}
          </Text>
          <Text className="text-sm text-gray-500">Active</Text>
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
      {/* Groups List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedFilter === "pending" ? (
          // Show Invites
          invites.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-6xl mb-4">📬</Text>
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                No Pending Invites
              </Text>
              <Text className="text-gray-500 text-center">
                You don't have any pending group invitations
              </Text>
            </View>
          ) : (
            <View className="space-y-3 pb-8">
              {invites.map((invite) => (
                <View
                  key={invite.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <View className="p-5">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-full items-center justify-center mr-3">
                          <ImageCustom
                            width={48}
                            height={48}
                            source={
                              invite.Group?.avatar ||
                              "https://img.icons8.com/?size=100&id=85&format=png&color=80C4E9"
                            }
                            className="rounded-full"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-800 text-base">
                            {invite.Group?.name || "Unknown Group"}
                          </Text>
                          <Text className="text-sm text-gray-500 mt-1">
                            Invited by {invite.inviterName || "Unknown"}
                          </Text>
                        </View>
                      </View>
                      <View className="px-2 py-1 rounded-full bg-orange-100 border border-orange-200">
                        <Text className="text-xs font-medium text-orange-700">
                          ⏳ Pending
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm text-gray-600 mb-4">
                      {invite.Group?.description || "No description available"}
                    </Text>

                    {/* Action Buttons */}
                    <View className="flex-row space-x-3 gap-3">
                      <TouchableOpacity
                        onPress={() => handleAcceptInvite(invite.id)}
                        className="flex-1 bg-[#80C4E9] rounded-xl py-3 items-center"
                      >
                        <Text className="text-white font-semibold">Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRejectInvite(invite.id)}
                        className="flex-1 bg-gray-500 rounded-xl py-3 items-center"
                      >
                        <Text className="text-white font-semibold">
                          Decline
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )
        ) : filteredGroups.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">📂</Text>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              No Groups Found
            </Text>
            <Text className="text-gray-500 text-center">
              {searchQuery.trim()
                ? `No groups match "${searchQuery}"`
                : "You haven't joined any groups yet"}
            </Text>
          </View>
        ) : (
          <View className="space-y-3 pb-8">
            {filteredGroups.map((group) => (
              <View
                key={group.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                {/* Header */}
                <View className="p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full items-center justify-center mr-3">
                        <ImageCustom
                          width={48}
                          height={48}
                          source={
                            group.avatar ||
                            "https://img.icons8.com/?size=100&id=85&format=png&color=80C4E9"
                          }
                          className="rounded-full"
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="font-semibold text-gray-800 text-base mr-2">
                            {group.name}
                          </Text>
                          <Text className="text-lg">
                            {getCategoryIcon(group.category)}
                          </Text>
                        </View>
                        <View className="flex-row items-center mt-1">
                          <View
                            className="px-2 py-1 rounded-full mr-2"
                            style={{
                              backgroundColor: getRoleColor(group) + "20",
                            }}
                          >
                            <Text
                              className="text-xs font-medium"
                              style={{ color: getRoleColor(group) }}
                            >
                              {getRoleText(group)}
                            </Text>
                          </View>
                          <View
                            className={`px-2 py-1 rounded-full border ${getStatusColor(
                              group.status
                            )}`}
                          >
                            <Text
                              className={`text-xs font-medium ${
                                getStatusColor(group.status).split(" ")[2]
                              }`}
                            >
                              {getStatusIcon(group.status)} {group.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* Description */}
                  <Text className="text-sm text-gray-600 mb-3">
                    {group.description || "No description available"}
                  </Text>
                  {/* Stats */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <ImageCustom
                        width={16}
                        height={16}
                        source="https://img.icons8.com/?size=100&id=86&format=png&color=6b7280"
                        className="mr-1"
                      />
                      <Text className="text-sm text-gray-500">
                        {group.memberCount || 0} member
                        {(group.memberCount || 0) !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <ImageCustom
                        width={16}
                        height={16}
                        source="https://img.icons8.com/?size=100&id=59&format=png&color=6b7280"
                        className="mr-1"
                      />
                      <Text className="text-sm text-gray-500">
                        {formatLastActivity(
                          group.lastActivity || new Date().toISOString()
                        )}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <ImageCustom
                      width={16}
                      height={16}
                      source="https://img.icons8.com/?size=100&id=85&format=png&color=6b7280"
                      className="mr-1"
                    />
                    <Text className="text-sm text-gray-500">
                      Created{" "}
                      {formatDate(group.createdAt || new Date().toISOString())}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="bg-gray-50 px-5 py-3 flex-row space-x-3 gap-1">
                  <TouchableOpacity
                    onPress={() => handleGroupAction(group, "view")}
                    className="flex-1 py-2 rounded-lg"
                    style={{ backgroundColor: "#80C4E9" }}
                  >
                    <Text className="text-white text-center font-medium text-sm">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {/* Create Group Modal */}
      {showCreateModal && (
        <ModalCreateSquad
          onClose={handleCloseModal}
          onRefresh={handleRefreshAfterCreate}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageGroup;
