// components/Pagination/InfiniteScrollPagination.tsx
import React, { useRef } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { InfiniteScrollPaginationProps } from "../../types/sosItem";

const ScrollPagination = <T,>({
  data,
  itemsPerPage,
  renderItem,
  onLoadMore,
  isLoading,
  hasMore,
}: InfiniteScrollPaginationProps<T>) => {
  const scrollViewRef = useRef<ScrollView>(null);

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
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {data.map((item, index) => (
        <View key={`${(item as any).id}-${index}`} style={{ marginBottom: 12 }}>
          {renderItem(item)}
        </View>
      ))}

      {isLoading && (
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" color="#EB4747" />
        </View>
      )}
    </ScrollView>
  );
};

export default ScrollPagination;
