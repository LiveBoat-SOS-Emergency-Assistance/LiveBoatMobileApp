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
export default function History() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 3;
  const visibleWidth = cardWidth * 2.5;
  const [listSOS, setListSOS] = useState<SOSItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const itemsPerPage = 4;

  const loadSOS = async (pageNum: number = 1) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const offset = (pageNum - 1) * itemsPerPage;
      const result = await sosService.getSOSByStatus(
        "ONGOING",
        itemsPerPage,
        offset
      );
      const newData: SOSItem[] = result.data || [];

      if (newData.length < itemsPerPage) {
        setHasMore(false);
      }

      setListSOS((prev: SOSItem[]) =>
        pageNum === 1 ? newData : [...prev, ...newData]
      );
    } catch (error) {
      console.error("Error loading SOS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSOS(1);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        loadSOS(nextPage);
        return nextPage;
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
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
              <Image
                className="w-[65px] h-[65px] rounded-full object-cover"
                source={require("../../../assets/images/ava.jpg")}
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
                  <Text className="text-[#404040] text-[8px]">
                    Weather Alert
                  </Text>
                </View>
                <ImageCustom
                  source="https://img.icons8.com/?size=100&id=kKxyuLXD4w0n&format=png&color=000000"
                  width={30}
                  height={30}
                ></ImageCustom>
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
                <Text>21°C</Text>
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
                  <Text className="text-[#404040] text-[8px]">
                    Community Report
                  </Text>
                </View>
                <Text>5</Text>
              </View>
            </View>
          </View>
          <Text className="text-[#EB4747] justify-start items-start text-start w-[90%] text-[18px] font-bold py-1">
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
          </ScrollView>
          <View className="w-[90%] h-[40px] relative flex shadow-lg border-gray-200 border-[1px] rounded-[10px] bg-white mt-4">
            <TextInput className="w-full h-full px-4"></TextInput>
            <ImageCustom
              className="absolute top-1/2 right-3 -translate-y-1/2"
              source="https://img.icons8.com/?size=100&id=112468&format=png&color=000000"
              width={24}
              height={24}
              color="#EB4747"
            ></ImageCustom>
          </View>
          <View className="flex  flex-row w-[90%] h-[35px] justify-center gap-2 ">
            <View className="w-3/12  flex-row items-center h-full border-gray-200 border-[1px] rounded-[10px] bg-white px-3 py-1 shadow-lg justify-between  relative flex">
              <Text className="text-[12px] text-[#EB4747]">Need help</Text>
              <ImageCustom
                className=""
                source="https://img.icons8.com/?size=100&id=85018&format=png&color=000000"
                width={18}
                height={18}
                color="#EB4747"
              />
            </View>
            <View className="w-4/12 flex-row items-center h-full border-gray-200 border-[1px] rounded-[10px] bg-white px-3 py-1 shadow-lg justify-between relative flex">
              <Text className="text-[12px] text-[#EB4747]">
                Natural Disaster
              </Text>
              <ImageCustom
                className=""
                source="https://img.icons8.com/?size=100&id=85018&format=png&color=000000"
                width={15}
                height={15}
                color="#EB4747"
              ></ImageCustom>
            </View>
            <View className="w-4/12  flex-row items-center h-full border-gray-200 border-[1px] rounded-[10px] bg-[#EB4747] px-3 py-1 shadow-lg justify-between relative flex">
              <Text className="text-[12px] text-white">Da Nang</Text>
              <ImageCustom
                className=""
                source="https://img.icons8.com/?size=100&id=85018&format=png&color=000000"
                width={18}
                height={18}
                color="#ffffff"
              ></ImageCustom>
            </View>
          </View>
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
