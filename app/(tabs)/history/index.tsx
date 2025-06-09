import {
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import SOSCardFilter from "../../../components/Card/SOSCardFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import { sosService } from "../../../services/sos";
import ScrollPagination from "../../../components/Pagination/ScrollPagination";
import { SOSItem } from "../../../types/sosItem";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "../../../components/Image/Avatar";
import { WEATHER_API_KEY } from "@env";
import axios from "axios";
import MultiSelectDropdown, {
  FilterOption,
} from "../../../components/Dropdown/MultiSelectDropdown";
import { getCurrentLocation } from "../../../utils/location";
import useDebounce from "../../../hooks/useDebounce";

export default function History() {
  const screenWidth = Dimensions.get("window").width;

  // ✅ Core state
  const [allSOSData, setAllSOSData] = useState<SOSItem[]>([]); // Store all data for frontend search
  const [filteredSOS, setFilteredSOS] = useState<SOSItem[]>([]); // Filtered and searched data
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { profile } = useAuth();

  // ✅ Search and filter states
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // ✅ Weather state
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = WEATHER_API_KEY;
  const city = "Da Nang";
  const itemsPerPage = 10;

  // ✅ Filter options
  const filterOptions: FilterOption[] = [
    { label: "Nearest to me", value: "nearest" },
    { label: "Has rescue", value: "has_rescue" },
    { label: "No rescue", value: "no_rescue" },
  ];

  // ✅ Frontend search function
  const performFrontendSearch = (data: SOSItem[], searchTerm: string) => {
    if (!searchTerm.trim()) {
      return data;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      // Search by ID (convert to string for comparison)
      const idMatch = item.id
        ?.toString()
        .toLowerCase()
        .includes(lowercaseSearch);

      // Search by user name (from various possible name fields)
      const nameMatch =
        // item.user?.full_name?.toLowerCase().includes(lowercaseSearch) ||
        item?.id?.toLowerCase().includes(lowercaseSearch) ||
        item.SOS?.name?.toLowerCase().includes(lowercaseSearch);

      // Search by description if available
      const descriptionMatch = item?.SOS?.description
        ?.toLowerCase()
        .includes(lowercaseSearch);

      return idMatch || nameMatch || descriptionMatch;
    });
  };

  // ✅ Apply search to current data
  useEffect(() => {
    console.log("🔍 Applying search:", debouncedSearchText);
    const searchResults = performFrontendSearch(
      allSOSData,
      debouncedSearchText
    );
    setFilteredSOS(searchResults);
    console.log(`📊 Search results: ${searchResults.length} items`);
  }, [debouncedSearchText, allSOSData]);

  // ✅ Main loadSOS function (no search parameter)
  const loadSOS = async (pageNum: number = 1, filters: string[] = []) => {
    if (isLoading && pageNum !== 1) return;

    setIsLoading(true);

    try {
      const filterParams: any = {};

      const hasRescueFilter = filters.includes("has_rescue");
      const noRescueFilter = filters.includes("no_rescue");

      if (hasRescueFilter && noRescueFilter) {
        // Both selected, no filter
      } else if (hasRescueFilter) {
        filterParams.has_rescuers = true;
      } else if (noRescueFilter) {
        filterParams.no_rescuers = true;
      }

      if (filters.includes("nearest")) {
        if (userLocation) {
          filterParams.near_me = true;
          filterParams.latitude = userLocation.latitude;
          filterParams.longitude = userLocation.longitude;
        } else {
          console.log("⚠️ Nearest filter selected but no location available");
          setIsLoading(false);
          return;
        }
      }

      console.log("📡 API call parameters:", filterParams);
      const result = await sosService.getSOSByStatus("ONGOING", filterParams);

      if (result?.data) {
        const newData: SOSItem[] = result.data || [];

        if (pageNum === 1) {
          setAllSOSData(newData);
        } else {
          setAllSOSData((prev) => {
            const existingIds = prev.map((item) => item.id);
            const uniqueNewData = newData.filter(
              (item) => !existingIds.includes(item.id)
            );
            return [...prev, ...uniqueNewData];
          });
        }

        setHasMore(newData.length >= itemsPerPage);
      } else {
        if (pageNum === 1) {
          setAllSOSData([]);
        }
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("❌ Error loading SOS:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      if (pageNum === 1) {
        setAllSOSData([]);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
        }
      } catch (error) {
        console.error("❌ Error getting user location:", error);
      }
    };

    getUserLocation();
  }, []);

  // ✅ Get weather data on mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&lang=en`
        );
        setWeather(res.data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // ✅ Load initial data when app starts
  useEffect(() => {
    const loadInitialData = async () => {
      if (userLocation) {
        setSelectedFilters(["nearest"]);
        setPage(1);
        setHasMore(true);
        await loadSOS(1, ["nearest"]);
      }
    };

    loadInitialData();
  }, [userLocation]);

  // ✅ Handle filter changes (not search, search is handled separately)
  useEffect(() => {
    const handleFilterChange = async () => {
      if (
        selectedFilters.length === 1 &&
        selectedFilters[0] === "nearest" &&
        !debouncedSearchText
      ) {
        return; // Skip if only nearest filter and no search
      }

      const needsLocation = selectedFilters.includes("nearest");
      if (needsLocation && !userLocation) {
        return;
      }

      setPage(1);
      setHasMore(true);
      await loadSOS(1, selectedFilters);
    };

    handleFilterChange();
  }, [selectedFilters]); // Only depend on filters, not search

  // ✅ Handle load more
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        loadSOS(nextPage, selectedFilters);
        return nextPage;
      });
    }
  };

  // ✅ Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);

    try {
      await loadSOS(1, selectedFilters);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: string[]) => {
    setSelectedFilters(newFilters);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="bg-white h-full flex flex-col pb-12 gap-3 mb-24"
          contentContainerStyle={{
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#EB4747"]}
              tintColor="#EB4747"
            />
          }
        >
          {/* Header */}
          <View className="flex flex-row justify-between px-5 w-full items-center">
            <Text className="text-[28px] text-[#404040] font-bold">Today</Text>
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Avatar
                width={65}
                height={65}
                className="w-[50px] h-[50px] rounded-full object-cover"
                source={profile?.User?.avatar_url}
              />
            </View>
          </View>
          {/* Weather Card */}
          <View
            className="w-[90%] h-[175px] rounded-[30px] bg-[#FFD9D9] py-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-[#404040] font-bold px-5">
              Total emergencies
            </Text>
            <View className="flex flex-row justify-between px-5">
              <View className="flex flex-row gap-3 items-center justify-center pl-5">
                <Text className="text-[#EB4747] text-[40px] font-bold">
                  {filteredSOS.length}
                </Text>
                <Text className="text-[#404040] italic">emergencies</Text>
              </View>
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=72xTAy8tXrTD&format=png&color=000000"
                width={60}
                height={60}
              />
            </View>

            {/* Weather info cards */}
            <View className="flex flex-row gap-5 px-2 w-full justify-center pt-2">
              <View
                className="w-1/4 bg-white h-[60px] rounded-md shadow flex flex-col justify-center items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View className="flex flex-row justify-center items-center">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=kKxyuLXD4w0n&format=png&color=000000"
                    width={24}
                    height={24}
                  />
                  <Text className="text-[#404040] text-[8px]">
                    Weather Alert
                  </Text>
                </View>
                <Text className="text-xs">
                  {weather?.current?.condition?.text || "Rain"}
                </Text>
              </View>

              <View
                className="w-1/4 bg-white h-[60px] rounded-md shadow flex flex-col gap-2 justify-center items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View className="flex flex-row justify-center items-center">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=32690&format=png&color=000000"
                    width={16}
                    height={16}
                  />
                  <Text className="text-[#404040] text-[8px]">Temperature</Text>
                </View>
                <Text className="text-xs">
                  {weather?.current?.temp_c || "20"}°C
                </Text>
              </View>

              <View
                className="w-1/4 bg-white h-[60px] rounded-md shadow flex flex-col gap-2 justify-center items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View className="flex flex-row justify-center items-center gap-1">
                  <Text className="text-[10px]">
                    {weather?.current?.is_day ? "☀️" : "🌙"}
                  </Text>
                  <Text className="text-[#404040] text-[8px]">Time</Text>
                </View>
                <Text className="text-xs">
                  {weather?.current?.is_day ? "Day" : "Night"}
                </Text>
              </View>
            </View>
          </View>{" "}
          {/* Search and Filter Row */}
          <View className="w-[90%] flex-row items-center justify-between mt-4 px-2">
            {/* Search Input */}
            <View className="flex-1 px-3 h-[40px] relative flex shadow-lg border-gray-200 border-[1px] rounded-[10px] bg-white mr-3">
              <TextInput
                className="w-full h-full px-4 "
                placeholder="Search by name..."
                value={searchText}
                onChangeText={(text) => {
                  console.log("📝 Search text changed:", text);
                  setSearchText(text);
                }}
                returnKeyType="search"
              />
              {/* Clear button - only show when there's text */}
              {searchText.length > 0 && (
                <TouchableOpacity
                  className="absolute top-1/2 right-3 w-5 h-5 rounded-full  flex items-center justify-center"
                  style={{ transform: [{ translateY: -10 }] }}
                  onPress={() => {
                    setSearchText("");
                  }}
                >
                  <Text className="text-gray-600 text-lg font-bold">×</Text>
                </TouchableOpacity>
              )}
              {/* Search icon - only show when there's no text */}
              {searchText.length === 0 && (
                <View
                  className="absolute top-1/2 right-3"
                  style={{ transform: [{ translateY: -10 }] }}
                >
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
                    width={20}
                    height={20}
                  />
                </View>
              )}
            </View>

            {/* Filter Dropdown */}
            <View className="w-[120px] h-[40px]">
              <MultiSelectDropdown
                options={filterOptions}
                selectedValues={selectedFilters}
                onSelectionChange={handleFilterChange}
                placeholder="Filters"
              />
            </View>
          </View>
          {/* Loading indicator */}
          {isLoading && filteredSOS.length === 0 && !refreshing && (
            <View className="w-[90%] py-12 items-center">
              <ActivityIndicator size="large" color="#EB4747" />
              <Text className="text-gray-500 mt-4 text-center">
                Loading emergencies...
              </Text>
            </View>
          )}
          {/* Empty State Message */}
          {!isLoading && filteredSOS.length === 0 && (
            <View className="flex-1 justify-center items-center py-16">
              <View className="bg-green-50 rounded-3xl p-8 mx-6 shadow-sm border border-green-100">
                <View className="items-center">
                  <Text className="text-4xl mb-4">
                    {debouncedSearchText ? "🔍" : "✅"}
                  </Text>
                  <Text className="text-xl font-bold text-green-800 text-center mb-2">
                    {debouncedSearchText ? "No Results" : "Awesome!"}
                  </Text>
                  <Text className="text-green-700 text-center text-base leading-6">
                    {debouncedSearchText
                      ? `No emergencies found for "${debouncedSearchText}"`
                      : "There is no SOS at the moment"}
                  </Text>
                  <Text className="text-green-600 text-center text-sm mt-2 opacity-80">
                    {debouncedSearchText
                      ? "Try a different search term"
                      : "Everyone is safe right now 🎉"}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {/* SOS List */}
          {filteredSOS.length > 0 && (
            <View style={{ width: "100%", flex: 1 }}>
              <ScrollPagination<SOSItem>
                data={filteredSOS}
                itemsPerPage={itemsPerPage}
                renderItem={(item: SOSItem) => <SOSCardFilter data={item} />}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                hasMore={hasMore}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
