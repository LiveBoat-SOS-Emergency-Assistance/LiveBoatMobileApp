// components/Pagination/InfiniteScrollPagination.tsx
import React, { useRef } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  RefreshControl,
} from "react-native";
import { InfiniteScrollPaginationProps } from "../../types/sosItem";
import { Text } from "react-native";
interface ScrollPaginationProps<T> extends InfiniteScrollPaginationProps<T> {
  onRefresh?: () => void;
  refreshing?: boolean;
}
const ScrollPagination = <T,>({
  data,
  itemsPerPage,
  renderItem,
  onLoadMore,
  isLoading,
  hasMore,
  onRefresh,
  refreshing = false,
}: ScrollPaginationProps<T>) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isCloseToBottom && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#EB4747"]}
            tintColor="#EB4747"
            title="Pull to refresh..."
            titleColor="#666"
          />
        ) : undefined
      }
      contentContainerStyle={{
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: screenWidth,
      }}
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <View style={{ width: "100%" }}>
        {data.map((item, index) => (
          <View
            key={`${(item as any).id}-${index}`}
            style={{
              marginBottom: 12,
              width: "100%",
            }}
          >
            {renderItem(item)}
          </View>
        ))}
      </View>
      {isLoading && !refreshing && (
        <View
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#EB4747" />
          <Text
            style={{
              marginTop: 8,
              color: "#666",
              fontSize: 14,
            }}
          >
            Loading more...
          </Text>
        </View>
      )}

      {/* ✅ End of list indicator */}
      {!hasMore && data.length > 0 && !isLoading && (
        <View
          style={{
            padding: 16,
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#f3f4f6",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#6b7280",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              -- End of list --
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ScrollPagination;
