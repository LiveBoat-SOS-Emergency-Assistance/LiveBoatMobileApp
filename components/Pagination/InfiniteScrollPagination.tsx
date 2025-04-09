import React, { useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

interface PaginationProps {
  data: string[];
  itemsPerPage: number;
  renderItem: (item: string) => React.ReactNode;
}

const PaginatedScroll = ({
  data,
  itemsPerPage,
  renderItem,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      setCurrentPage(page);

      // Simulate loading (remove this in production and replace with actual data fetching)
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range of visible pages
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range to always show 3 pages when possible
    if (currentPage <= 3) {
      rangeEnd = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(totalPages - 3, 2);
    }

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <View className="flex-1 mb-5 w-[90%]">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {currentItems.map((item, index) => (
          <View className="bg-gray-200 my-2 rounded-lg" key={index}>
            {renderItem(item)}
          </View>
        ))}

        {loading && (
          <ActivityIndicator size="large" color="#0000ff" className="my-5" />
        )}
      </ScrollView>

      {/* Pagination Controls */}
      <View className="flex-row justify-center items-center mt-5">
        {/* Previous button */}
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-2 p-3 rounded-md ${
            currentPage === 1 ? "bg-red-100" : "bg-red-300"
          }`}
        >
          <Text
            className={`${currentPage === 1 ? "text-white" : "text-white"}`}
          >
            {"<"}
          </Text>
        </TouchableOpacity>

        {/* Page numbers */}
        {getPaginationNumbers().map((page, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              typeof page === "number" ? handlePageChange(page) : null
            }
            disabled={typeof page !== "number"}
            className={`mx-1 w-10 h-10 items-center justify-center rounded-md ${
              currentPage === page
                ? "bg-red-500"
                : typeof page === "number"
                ? "bg-white border-gray-200 border"
                : "bg-transparent"
            }`}
          >
            <Text
              className={`${
                currentPage === page
                  ? "text-white font-bold"
                  : typeof page === "number"
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next button */}
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`mx-2 p-3 rounded-md ${
            currentPage === totalPages ? "bg-red-100" : "bg-red-300"
          }`}
        >
          <Text
            className={`${
              currentPage === totalPages ? "text-white" : "text-white"
            }`}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaginatedScroll;
