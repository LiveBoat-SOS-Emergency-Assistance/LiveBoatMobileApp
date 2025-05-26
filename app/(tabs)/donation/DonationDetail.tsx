import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageCustom from "../../../components/Image/Image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import DonationItem from "../../../components/DonationItem/DonationItem";
import { useLocalSearchParams } from "expo-router";
import ModalDonation from "../../../components/Modal/ModalDonation";
import { charityServices } from "../../../services/charity";

interface Charity {
  id: string;
  title: string;
  description: string;
  goal_amount: string;
  status: string;
  createdAt: string;
  extra_data: {
    focus: string;
    region: string;
    image?: {
      pic1: string;
    };
  };
}
const ITEMS_PER_PAGE = 10;

const DonationDetail = () => {
  const { item } = useLocalSearchParams();
  const charity = typeof item === "string" ? JSON.parse(item) : null;
  const [visible, setVisible] = useState(false);
  const [openModalDonation, setOpenModalDonation] = useState(false);
  const [listDonation, setListDonation] = useState<any[]>([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchDonation = async (pageNumber = 0, isRefresh = false) => {
    if (isLoadingMore && !isRefresh) return;
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(0);
        setHasMoreData(true);
      } else {
        setIsLoadingMore(true);
      }
      const result = await charityServices.get_all_donation_by_charityID(
        charity?.id,
        "SUCCESS",
        searchPhone || undefined,
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
      } else {
        setListDonation((prev: any[]) => {
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
      console.log(error);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDonation(0, true);
  }, [charity?.id, searchPhone]);

  const loadMoreData = () => {
    if (!isLoadingMore && hasMoreData && !refreshing) {
      fetchDonation(page + 1);
    }
  };

  const onRefresh = () => {
    fetchDonation(0, true);
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: "white", width: "100%" }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
        {visible && (
          <ModalDonation
            charityId={charity?.id}
            title="Make a donation"
            message="Your support helps us achieve our goals and bring positive change"
            confirmText="Donate now"
            cancelText="Cancel"
            onConfirm={() => {
              setOpenModalDonation(true);
              setVisible(false);
            }}
            onCancel={() => setVisible(false)}
          />
        )}
        <View className="flex-1 w-full bg-white">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex w-full bg-white gap-5 pt-2">
              <View className="w-[90%] pl-5">
                <Text className="font-bold text-[#404040] text-[18px]">
                  {charity?.title}
                </Text>
              </View>
              <View className="flex flex-col w-full px-5 gap-2">
                <View className="flex flex-row gap-2 items-center">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=12776&format=png&color=000000"
                    width={20}
                    height={20}
                  />
                  <Text className="text-[#666666] text-[12px] font-bold">
                    Start time:
                  </Text>
                  <Text className="text-[#2D5B75] text-[12px] font-bold">
                    {charity?.created_at
                      ? formatDate(charity.created_at)
                      : "N/A"}
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=12776&format=png&color=000000"
                    width={20}
                    height={20}
                  />
                  <Text className="text-[#666666] text-[12px] font-bold">
                    End time:
                  </Text>
                  <Text className="text-[#2D5B75] text-[12px] font-bold">
                    {charity?.status === "ACTIVE" ? "  Ongoing" : "  Closed"}
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center">
                  <ImageCustom
                    source="https://img.icons8.com/?size=100&id=lnjvjfvXC9fa&format=png&color=000000"
                    width={20}
                    height={20}
                  />
                  <Text className="text-[#666666] text-[12px] font-bold">
                    Address:
                  </Text>
                  <Text className="text-[#2D5B75] text-[12px] font-bold">
                    {"  "} {charity?.extra_data?.region || "N/A"}
                  </Text>
                </View>
              </View>
              <View className="w-full px-4">
                <Image
                  className="w-full h-[200px] rounded-[20px] object-cover"
                  source={require("../../../assets/images/flood.png")}
                />
              </View>
              <View className="flex flex-col w-full px-5 gap-2">
                <Text className="text-[#2D5B75] text-[12px] font-bold">
                  Event summary:
                </Text>
                <View className="bg-[#d9eef9] w-full h-fit rounded-[30px] flex px-4 py-2">
                  <Text className="text-[#404040] text-[13px] px-2 py-2">
                    {charity?.description || "No description available."}
                  </Text>
                </View>
              </View>
              <View className="flex flex-col w-full gap-2">
                <Text className="text-[#2D5B75] text-[12px] px-5 font-bold">
                  List of supporters:
                </Text>
                <View className="flex px-5 relative">
                  <TextInput
                    className="border border-[#D9D9D9] rounded-md px-4 h-[40px] mb-2 text-[14px] bg-white pr-10"
                    placeholder="Enter phone number..."
                    placeholderTextColor="#A0A0A0"
                    value={searchPhone}
                    onChangeText={setSearchPhone}
                    keyboardType="phone-pad"
                    returnKeyType="search"
                    clearButtonMode="never"
                  />
                  {searchPhone.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchPhone("")}
                      style={{
                        position: "absolute",
                        right: 25,
                        top: 6,
                        zIndex: 10,
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={{ fontSize: 20, color: "#A0A0A0" }}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {refreshing && (
                  <ActivityIndicator
                    size="small"
                    color="#80C4E9"
                    className="mt-2"
                  />
                )}
                {listDonation.length === 0 && !refreshing ? (
                  <View className="flex justify-center items-center py-10">
                    <Text className="text-[#666666] text-[14px]">
                      No supporters found for this charity.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={listDonation}
                    keyExtractor={(item, index) =>
                      item.id
                        ? `donation-${item.id}`
                        : `donation-fallback-${index}`
                    }
                    renderItem={({ item }) => <DonationItem item={item} />}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.3}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={{ gap: 8, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={10}
                    ListFooterComponent={() =>
                      isLoadingMore ? (
                        <View className="flex justify-center items-center py-4">
                          <ActivityIndicator size="small" color="#80C4E9" />
                          <Text className="text-[#666666] text-[12px] mt-2">
                            Loading more supporters...
                          </Text>
                        </View>
                      ) : null
                    }
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 8 }} />
                    )}
                    scrollEnabled={false}
                  />
                )}
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
            activeOpacity={0.8}
            className="absolute bottom-24 right-3"
          >
            <Animatable.View
              animation="rubberBand"
              iterationCount="infinite"
              duration={1500}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#EB4747",
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ImageCustom
                width={25}
                height={25}
                color="#fff"
                source="https://img.icons8.com/?size=100&id=wYrEPj8MXvDY&format=png&color=000000"
              />
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DonationDetail;
