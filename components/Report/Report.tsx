import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Avatar from "../Image/Avatar";
import ImageCustom from "../Image/Image";
import { userServices } from "../../services/user";

interface ReportItem {
  userId: number;
  name: string;
  avatar: string;
  reason: string;
  date: string;
}

interface ReportProps {
  data: ReportItem[];
  onWarnUser?: (message: string) => void;
}

const Report: React.FC<ReportProps> = ({ data, onWarnUser }) => {
  const [showWarnInput, setShowWarnInput] = useState(false);
  const [warnMessage, setWarnMessage] = useState("");
  const [userDetails, setUserDetails] = useState<{ [key: number]: any }>({});
  const [loadingUsers, setLoadingUsers] = useState<{ [key: number]: boolean }>(
    {}
  );

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const reportTime = new Date(dateString);
    const diffInMs = now.getTime() - reportTime.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
  };

  const handleWarnUserClick = () => {
    setShowWarnInput(true);
  };
  const fetchUserInfor = async (userId: number) => {
    if (userDetails[userId]) {
      return userDetails[userId];
    }
    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await userServices.getUserByID(userId);
      setUserDetails((prev) => ({
        ...prev,
        [userId]: result.data,
      }));

      return result.data;
    } catch (error: any) {
      console.error("Error fetching user information:", error);
      return null;
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Fetch all user information
  useEffect(() => {
    const fetchAllUserInfo = async () => {
      if (!data || data.length === 0) return;
      const fetchPromises = data.map(async (report) => {
        if (!userDetails[report.userId] && !loadingUsers[report.userId]) {
          return fetchUserInfor(report.userId);
        }
        return null;
      });
      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("❌ Error fetching some user information:", error);
      }
    };

    fetchAllUserInfo();
  }, [data]);
  const handleSubmitWarn = () => {
    if (warnMessage.trim() && onWarnUser) {
      onWarnUser(warnMessage.trim());
      setWarnMessage("");
      setShowWarnInput(false);
    }
  };
  const handleCancelWarn = () => {
    setWarnMessage("");
    setShowWarnInput(false);
  };

  return (
    <View
      className="w-[90%] bg-white border border-gray-200 rounded-[20px] px-5 py-4 shadow-md"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center mb-3">
          <ImageCustom
            source="https://img.icons8.com/?size=100&id=84997&format=png&color=000000"
            width={20}
            height={20}
          />
          <Text className="text-black font-bold ml-2 text-[11px]">
            Reports ({data?.length || 0})
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleWarnUserClick}
          className="px-3 py-2  flex justify-center rounded-[20px] items-center "
        >
          <Text className="text-[11px] text-[#EB4747] font-bold flex justify-center items-center">
            ⚠️ Warn User
          </Text>
        </TouchableOpacity>
      </View>

      {/* Warn User Input Section */}
      {showWarnInput && (
        <View className="mb-4 p-3 bg-gray-50 rounded-[15px] border border-gray-200">
          <Text className="text-[#EB4747] font-bold text-[12px] mb-2">
            Send warning message:
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-[10px] p-3 text-[12px] mb-3"
            placeholder="Enter your warning message..."
            value={warnMessage}
            onChangeText={setWarnMessage}
            multiline={true}
            numberOfLines={3}
            maxLength={200}
            textAlignVertical="top"
          />
          <View className="flex flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={handleCancelWarn}
              className="bg-gray-400 px-4 py-2 rounded-[15px]"
            >
              <Text className="text-white text-[11px] font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmitWarn}
              className="bg-[#EB4747] px-4 py-2 rounded-[15px]"
              disabled={!warnMessage.trim()}
            >
              <Text className="text-white text-[11px] font-bold">
                Send Warning
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!data || data.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">
          No reports available for this SOS
        </Text>
      ) : (
        <ScrollView
          className="max-h-[200px]"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View className="space-y-3">
            {data.map((report, index) => {
              const userInfo = userDetails[report.userId];
              const isLoading = loadingUsers[report.userId];
              return (
                <View key={`${report.userId}-${index}`} className="py-2">
                  <View className="flex flex-row items-center justify-center space-x-2 gap-4">
                    <View className="w-1/12">
                      <Avatar
                        source={userInfo?.User?.avatar_url || report.avatar}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </View>
                    <View className="flex w-10/12 flex-col">
                      <View className="flex justify-between flex-row ">
                        <Text className="text-[#404040] font-semibold text-[13px]">
                          {userInfo?.name || report.name}
                          {isLoading && (
                            <Text className="text-gray-500 text-[10px]">
                              User Name
                            </Text>
                          )}
                        </Text>
                        <Text className="text-gray-500 text-[10px]">
                          {formatTimeAgo(report.date)}
                        </Text>
                      </View>
                      <Text className="text-[#404040] text-[12px] leading-4 ">
                        {report.reason}
                      </Text>
                    </View>
                  </View>
                  {index < data.length - 1 && (
                    <View className="border-t border-gray-100 mt-3" />
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Report;
