import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
interface PaginationProps {
  data: string[];
  itemsPerPage: number;
  renderItem: (item: string) => React.ReactNode;
}
const InfiniteScrollPagination = ({
  data,
  itemsPerPage,
  renderItem,
}: PaginationProps) => {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);

  const loadMoreItems = () => {
    if (visibleItems < data.length) {
      setVisibleItems((prev) => prev + itemsPerPage);
    }
  };
  return (
    <FlatList
      data={data.slice(0, visibleItems)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>{renderItem(item)}</View>
      )}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        visibleItems < data.length ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginVertical: 20 }}
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
});

export default InfiniteScrollPagination;
