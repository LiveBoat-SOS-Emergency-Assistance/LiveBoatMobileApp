import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import SOSCard from "../../../components/Card/SOSCard";
import SOSCardFilter from "../../../components/Card/SOSCardFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import { sosService } from "../../../services/sos";
import InfiniteScrollPagination from "../../../components/Pagination/InfiniteScrollPagination";
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
export default function History() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 3;
  const visibleWidth = cardWidth * 2.5;
  const [listSOS, setListSOS] = useState<SOSItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { profile } = useAuth();

  // Search and filter states
  const [searchText, setSearchText] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["nearest"]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Filter options
  const filterOptions: FilterOption[] = [
    { label: "Nearest to me", value: "nearest" },
    { label: "Has rescue", value: "has_rescue" },
    { label: "No rescue", value: "no_rescue" },
  ];

  type WeatherData = {
    current?: {
      temp_c?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = WEATHER_API_KEY;
  const city = "Da Nang";
  const itemsPerPage = 4;
  const loadSOS = async (
    pageNum: number = 1,
    search: string = "",
    filters: string[] = []
  ) => {
    if (isLoading || !hasMore) return;
    console.log("Loading SOS for page:", pageNum, "with search:", filters);
    setIsLoading(true);
    try {
      const offset = (pageNum - 1) * itemsPerPage;

      // Build filter parameters for API
      const filterParams: any = {};

      // Handle filter selections
      filters.forEach((filter) => {
        switch (filter) {
          case "nearest":
            if (userLocation) {
              filterParams.near_me = true;
              filterParams.latitude = userLocation.latitude;
              filterParams.longitude = userLocation.longitude;
            }
            break;
          case "has_rescue":
            filterParams.has_rescuers = true;
            break;
          case "no_rescue":
            filterParams.no_rescuers = true;
            break;
        }
      }); // Add search parameter
      if (search.trim()) {
        filterParams.search = search;
      }

      console.log("Sending filterParams:", filterParams);

      const result = await sosService.getSOSByStatus("ONGOING", filterParams);
      console.log("Received SOS data:", result.data);
      if (result) {
        const newData: SOSItem[] = result.data || [];

        if (newData.length < itemsPerPage) {
          setHasMore(false);
        }

        setListSOS((prev: SOSItem[]) =>
          pageNum === 1 ? newData : [...prev, ...newData]
        );
      }
    } catch (error: any) {
      console.error("Error loading SOS:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
    } finally {
      setIsLoading(false);
    }
  };
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
        console.error("Error getting user location:", error);
      }
    };

    getUserLocation();
  }, []);

  // Only load SOS after we have user location (if needed) or when location is not required
  useEffect(() => {
    const needsLocation = selectedFilters.includes("nearest");

    if (!needsLocation || (needsLocation && userLocation)) {
      console.log("Loading SOS with location:", userLocation);
      console.log("Selected filters:", selectedFilters);
      setPage(1);
      setHasMore(true);
      setListSOS([]);
      loadSOS(1, searchText, selectedFilters);
    }
  }, [userLocation, searchText, selectedFilters]);
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        loadSOS(nextPage, searchText, selectedFilters);
        return nextPage;
      });
    }
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
        >
          <View className=" flex flex-row justify-between px-5 w-full items-center">
            <Text className="text-[28px] text-[#404040] font-bold ">Today</Text>
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Avatar
                width={65}
                height={65}
                className="w-[50px] h-[50px] rounded-full object-cover"
                source={profile?.User?.avatar_url}
              />
            </View>
          </View>
          <View
            className="w-[90%] h-[175px] rounded-[30px] bg-[#FFD9D9]  py-4"
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
                <Text className="text-[#EB4747] text-[40px] font-bold">5</Text>
                <Text className="text-[#404040] italic"> emergencies</Text>
              </View>
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=72xTAy8tXrTD&format=png&color=000000"
                width={60}
                height={60}
              ></ImageCustom>
            </View>
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
                  ></ImageCustom>

                  <Text className="text-[#404040] text-[8px]">
                    Weather Alert
                  </Text>
                </View>

                <Text className="text-xs">
                  {weather?.current?.condition.text || "Rain"}
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
                  ></ImageCustom>
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
          </View>
          {/* <Text className="text-[#EB4747] justify-start items-start text-start w-[90%] text-[18px] font-bold py-1">
            Incidents around you
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: visibleWidth }}
            contentContainerStyle={{
              paddingLeft: 0,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {[...Array(6)].map((_, index) => (
              <View
                key={index}
                style={{
                  width: cardWidth,
                  marginRight: 0,
                }}
                className="bg-white w-full py-2 px-3 justify-start"
              >
                <SOSCard />
              </View>
            ))}
          </ScrollView> */}
          {/* Search and Filter Row */}
          <View className="w-[90%] flex-row items-center justify-between mt-4 px-2">
            {/* Search Input */}
            <View className="flex-1 px-3 h-[40px] relative flex shadow-lg border-gray-200 border-[1px] rounded-[10px] bg-white mr-3">
              <TextInput
                className="w-full h-full px-4"
                placeholder="Search by name..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <ImageCustom
                className="absolute top-1/2 right-3 -translate-y-1/2"
                source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
                width={24}
                height={24}
                color="#EB4747"
              />
            </View>
            {/* Filter Dropdown */}
            <View className="w-[120px] h-[40px]">
              <MultiSelectDropdown
                options={filterOptions}
                selectedValues={selectedFilters}
                onSelectionChange={(newFilters) => {
                  console.log("New filters selected:", newFilters);
                  setSelectedFilters(newFilters);
                }}
                placeholder="Select filters"
              />
            </View>
          </View>
          {/* Empty State Message */}
          {!isLoading && listSOS.length === 0 && (
            <View className="flex-1 justify-center items-center py-16">
              <View className="bg-green-50 rounded-3xl p-8 mx-6 shadow-sm border border-green-100">
                <View className="items-center">
                  <Text className="text-xl font-bold text-green-800 text-center mb-2">
                    Awesome!
                  </Text>
                  <Text className="text-green-700 text-center text-base leading-6">
                    There is no SOS at the moment
                  </Text>
                  <Text className="text-green-600 text-center text-sm mt-2 opacity-80">
                    Everyone is safe right now 🎉
                  </Text>
                </View>
              </View>
            </View>
          )}
          <ScrollPagination<SOSItem>
            data={listSOS}
            itemsPerPage={itemsPerPage}
            renderItem={(item: SOSItem) => <SOSCardFilter data={item} />}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
