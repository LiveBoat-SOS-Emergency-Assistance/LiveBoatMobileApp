import {
  Keyboard,
  ScrollView,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import ImageCustom from "../../../components/Image/Image";
import Dropdown from "../../../components/Dropdown/Dropdown";
import DonationCard from "../../../components/Card/DonationCard";
import { router } from "expo-router";
import { charityServices } from "../../../services/charity";
import { TouchableWithoutFeedback } from "react-native";
import useDebounce from "../../../hooks/useDebounce"; // ✅ If you have this hook

const SupportDiary = () => {
  const [listCharity, setListCharity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // ✅ Debounce search query (optional)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const statusOptions = [
    { label: "Ongoing", value: "ACTIVE" },
    { label: "Closed", value: "CLOSED" },
  ];

  // ✅ Enhanced fetch function
  const fetchCharity = useCallback(
    async (status = "CLOSED", limit = 20, offset = 0, search = "") => {
      try {
        setLoading(true);
        setError("");

        const result = await charityServices.get_all_charity(
          limit,
          offset,
          status
        );

        if (!result?.data) {
          throw new Error("No data received from API");
        }

        let filteredData = result.data;

        if (search.trim()) {
          filteredData = result.data.filter(
            (charity: any) =>
              charity.title?.toLowerCase().includes(search.toLowerCase()) ||
              charity.description
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              charity.organization?.toLowerCase().includes(search.toLowerCase())
          );
        }

        setListCharity(filteredData);
      } catch (error: any) {
        console.error("❌ Error fetching charity:", error);
        setError(error.message || "Failed to load charities");
        setListCharity([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleStatusChange = useCallback(
    (newStatus: string | null) => {
      if (!newStatus) return;
      setSelectedStatus(newStatus);
      fetchCharity(newStatus, 20, 0, searchQuery);
    },
    [searchQuery, fetchCharity]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    fetchCharity(selectedStatus, 20, 0, "");
  }, [selectedStatus, fetchCharity]);

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      fetchCharity(selectedStatus, 20, 0, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, selectedStatus, fetchCharity]);

  useEffect(() => {
    fetchCharity(selectedStatus);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-white w-full h-full pt-32 flex flex-col gap-4 relative">
        {/* Error Display */}
        {error ? (
          <View className="px-8">
            <Text className="text-red-500 text-[14px] bg-red-50 p-3 rounded-lg">
              {error}
            </Text>
          </View>
        ) : null}

        {/* Search & Filter Section */}
        <View className="flex flex-row w-full px-8 gap-2 space-x-2">
          {/* Search Input */}
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
              flex: 1,
            }}
            className="h-[40px] relative rounded-[20px] px-0"
          >
            <TextInput
              placeholder="Search charities..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              className="w-full py-3 bg-white  inline-flex rounded-[20px] text-[14px] border border-[#D9D9D9] shadow-md px-5 "
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />

            <View className="absolute right-2 top-4 flex-row items-center">
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} className="mr-1">
                  <ImageCustom
                    width={16}
                    height={16}
                    color="#999999"
                    source="https://img.icons8.com/?size=100&id=46&format=png&color=000000"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Status Dropdown */}
          <View className="w-[40%] h-[40px]">
            <Dropdown
              items={statusOptions}
              variant="primary"
              defaultValue={selectedStatus}
              onChangeValue={handleStatusChange}
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className="mt-5 pl-8"
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <View className="flex justify-center items-center py-10">
              <ActivityIndicator size="large" color="#80C4E9" />
              <Text className="text-[#666666] text-[14px] mt-2">
                Loading charities...
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-y-4 ">
              {listCharity.length > 0 ? (
                listCharity.map((charity: any, index: number) => (
                  <View
                    key={`charity-${charity.id || index}`}
                    className="w-[32%]"
                  >
                    <DonationCard
                      charity={charity}
                      onPress={() => {
                        router.push({
                          pathname: "(tabs)/donation/DonationDetail",
                          params: { item: JSON.stringify(charity) },
                        });
                      }}
                    />
                  </View>
                ))
              ) : (
                <View className="flex justify-center items-center py-10">
                  <ImageCustom
                    width={80}
                    height={80}
                    color="#D9D9D9"
                    source="https://img.icons8.com/?size=100&id=83195&format=png&color=000000"
                  />
                  <View className="mt-4 text-center">
                    <Text className="text-[#666666] text-[16px] font-medium">
                      No charities found
                    </Text>
                    <Text className="text-[#999999] text-[14px] mt-1">
                      {searchQuery.trim()
                        ? `No results for "${searchQuery}"`
                        : `No ${selectedStatus.toLowerCase()} charities available`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SupportDiary;
