import {
  View,
  Text,
  Pressable,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Avatar from "../../../components/Image/Avatar";
import { useAuth } from "../../../context/AuthContext";
import DonationCard from "../../../components/Card/DonationCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageCustom from "../../../components/Image/Image";
import DonationItem from "../../../components/DonationItem/DonationItem";
import { router } from "expo-router";
import { charityServices } from "../../../services/charity";
import useDebounce from "../../../hooks/useDebounce";

// Define TypeScript interface for better type safety
interface Donation {
  id: string;
  amount: string;
  charity_id: string;
  description: string;
  extra_data: {};
  order_code: string;
  payment_date: string;
  payment_processor: string;
  status: string;
  user_id: string;
}

export default function Donation() {
  const { profile } = useAuth();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 3;
  const [listCharity, setListCharity] = useState<any[]>([]);
  const [listDonation, setListDonation] = useState<Donation[]>([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10; // Add debounced search phone with longer delay to prevent premature searching
  const debouncedSearchPhone = useDebounce(searchPhone, 1000);

  const fetchCharity = async () => {
    try {
      const result = await charityServices.get_all_charity(3, 0, "ACTIVE");
      setListCharity(result.data || []);
    } catch (error: any) {
      console.log("Fetch charity error:", error);
      setError("Failed to load charities. Please try again.");
    }
  };

  const fetchDonation = async (pageNumber = 0, isRefresh = false) => {
    if (isLoadingMore && !isRefresh) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(0);
        setHasMoreData(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const result = await charityServices.get_all_donation_by_charityID(
        undefined,
        "SUCCESS",
        undefined,
        ITEMS_PER_PAGE,
        pageNumber * ITEMS_PER_PAGE
      );
      const newDonations = (result.data || []).map(
        (item: any, idx: number) => ({
          ...item,
          id: item.id || `temp-${pageNumber}-${idx}`,
        })
      );

      if (isRefresh || pageNumber === 0) {
        setListDonation(newDonations);
        setAllDonations(newDonations);
      } else {
        setListDonation((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewDonations = newDonations.filter(
            (item: { id: string }) => !existingIds.has(item.id)
          );
          return [...prev, ...uniqueNewDonations];
        });
        setAllDonations((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewDonations = newDonations.filter(
            (item: { id: string }) => !existingIds.has(item.id)
          );
          return [...prev, ...uniqueNewDonations];
        });
      }

      if (newDonations.length < ITEMS_PER_PAGE) {
        setHasMoreData(false);
      }

      setPage(pageNumber);
    } catch (error: any) {
      console.log("Fetch donation error:", error);
      setError("Failed to load donations. Please try again.");
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };
  const searchDonationsByPhone = useCallback(
    async (phone: string, pageNumber = 0, isRefresh = false) => {
      console.log(
        "searchDonationsByPhone called with:",
        phone,
        "length:",
        phone.trim().length
      );

      if (!phone.trim() || phone.trim().length < 3) {
        console.log("Search cancelled - insufficient length");
        setListDonation(allDonations);
        setIsSearching(false);
        setHasMoreData(true);
        setPage(0);
        setError(null);
        return;
      }

      if (isLoadingMore && !isRefresh) {
        console.log("Search cancelled - already loading");
        return;
      }

      try {
        console.log("Starting search for:", phone);
        if (pageNumber === 0) {
          setIsSearching(true);
        } else {
          setIsLoadingMore(true);
        }

        const result = await charityServices.search_donations_by_phone(
          phone,
          undefined,
          "SUCCESS",
          ITEMS_PER_PAGE,
          pageNumber * ITEMS_PER_PAGE
        );

        const newDonations = (result.data || []).map(
          (item: any, idx: number) => ({
            ...item,
            id: item.id || `search-temp-${pageNumber}-${idx}`,
          })
        );

        if (pageNumber === 0 || isRefresh) {
          setListDonation(newDonations);
        } else {
          setListDonation((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewDonations = newDonations.filter(
              (item: { id: string }) => !existingIds.has(item.id)
            );
            return [...prev, ...uniqueNewDonations];
          });
        }

        if (newDonations.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }

        setPage(pageNumber);
        console.log("Search completed successfully");
      } catch (error: any) {
        console.log("Search error:", error);
        setError("Failed to search donations. Please try again.");
        if (pageNumber === 0) {
          setListDonation([]);
        }
      } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    [allDonations, ITEMS_PER_PAGE, isLoadingMore]
  );
  useEffect(() => {
    fetchCharity();
    fetchDonation(0, true);
  }, []);
  useEffect(() => {
    if (debouncedSearchPhone.trim().length >= 3) {
      searchDonationsByPhone(debouncedSearchPhone, 0, true);
    } else {
      setListDonation(allDonations);
      setIsSearching(false);
      setHasMoreData(true);
      setPage(0);
      setError(null);
    }
  }, [debouncedSearchPhone]);
  const handleSearch = () => {
    if (searchPhone.trim().length >= 3) {
      searchDonationsByPhone(searchPhone, 0, true);
    }
  };

  const clearSearch = () => {
    setSearchPhone("");
    setListDonation(allDonations);
    setHasMoreData(true);
    setPage(0);
    setError(null);
  };
  const loadMoreData = () => {
    if (!isLoadingMore && hasMoreData && !refreshing) {
      const nextPage = page + 1;
      if (searchPhone.trim().length >= 3) {
        searchDonationsByPhone(searchPhone, nextPage);
      } else {
        fetchDonation(nextPage);
      }
    }
  };
  const onRefresh = () => {
    setError(null);
    if (searchPhone.trim().length >= 3) {
      searchDonationsByPhone(searchPhone, 0, true);
    } else {
      fetchDonation(0, true);
    }
  };

  const handleNavidateToDetail = (item: any) => {
    router.push({
      pathname: "(tabs)/donation/DonationDetail",
      params: { item: JSON.stringify(item) },
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingVertical: 40,
          paddingHorizontal: 5,
        }}
      >
        <View className="flex flex-col gap-10 w-full bg-white">
          {error && (
            <View className="px-5">
              <Text className="text-red-500 text-[14px]">{error}</Text>
            </View>
          )}
          <View className="flex flex-row px-5 justify-between">
            <Text className="text-[28px] text-[#404040] font-bold w-[70%]">
              Donation year of history
            </Text>
            <View className="w-[75px] h-[75px] rounded-full flex justify-center items-center border-[#EB4747] border-[3px]">
              <Pressable>
                <Avatar
                  source={profile?.User?.avatar_url}
                  width={65}
                  height={65}
                />
              </Pressable>
            </View>
          </View>
          <View className="w-full">
            <FlatList
              horizontal
              data={listCharity}
              keyExtractor={(item, index) => `charity-${item.id || index}`}
              renderItem={({ item }) => (
                <DonationCard
                  charity={item}
                  onPress={() => handleNavidateToDetail(item)}
                />
              )}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={() => (
                <View className="h-[100px] flex justify-center items-center ">
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/donation/SupportDiary")}
                  >
                    <ImageCustom
                      source="https://img.icons8.com/?size=100&id=wgYy0nz8B9SS&format=png&color=000000"
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View className="flex flex-row w-full justify-between px-6">
            <View className="flex flex-col gap-2">
              <View className="flex gap-3 flex-row justify-start items-center">
                <Text className="text-[#404040] opacity-90 font-bold text-[13px]">
                  Total donations:
                </Text>
                <Text className="text-[#2D5B75] font-bold text-[15px]">
                  +5.752.250 VNĐ
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-[#404040] text-[10px]">
                  Your kindness saves lives –
                </Text>
                <Text className="text-[#EB4747] font-bold italic text-[12px]">
                  Donate now!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/donation/SupportDiary")}
              activeOpacity={0.8}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
              className="bg-[#EB4747] px-5 py-2 flex justify-center items-center rounded-[10px]"
            >
              <Text className="text-white font-bold">Donation</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Search input */}
        <View
          style={{
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <TextInput
            placeholder="Enter phone number..."
            value={searchPhone}
            onChangeText={setSearchPhone}
            className="w-full py-3 bg-white rounded-[10px] text-[14px] border border-[#D9D9D9] shadow-md px-5 pr-10"
            keyboardType="phone-pad"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            blurOnSubmit={false}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={15}
          />
          {searchPhone.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={{
                position: "absolute",
                right: 30,
                top: "50%",
                transform: [{ translateY: -7 }],
              }}
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=46&format=png&color=666666"
                width={15}
                height={15}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* --- END search input --- */}

        <FlatList
          data={listDonation}
          keyExtractor={(item, index) =>
            item.id ? `donation-${item.id}` : `donation-fallback-${index}`
          }
          renderItem={({ item }) => <DonationItem item={item} />}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 20, gap: 8 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          ListEmptyComponent={() => (
            <View className="flex justify-center items-center py-10">
              <Text className="text-[#666666] text-[14px]">
                {searchPhone.length > 0 && searchPhone.length < 3
                  ? "Enter at least 3 digits to search"
                  : searchPhone.length >= 3
                  ? "No donations found for this phone number"
                  : "Enter a phone number to search donations"}
              </Text>
            </View>
          )}
          ListFooterComponent={() =>
            isLoadingMore ? (
              <View className="flex justify-center items-center py-4">
                <ActivityIndicator size="small" color="#80C4E9" />
                <Text className="text-[#666666] text-[12px] mt-2">
                  Loading more donations...
                </Text>
              </View>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
