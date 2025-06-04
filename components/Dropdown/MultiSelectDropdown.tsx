import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import ImageCustom from "../Image/Image";

export type FilterOption = {
  label: string;
  value: string;
};

type MultiSelectDropdownProps = {
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  placeholder?: string;
  maxHeight?: number;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select filters",
  maxHeight = 200,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = (value: string) => {
    const updatedSelection = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    onSelectionChange(updatedSelection);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0]);
      return option ? option.label : placeholder;
    }
    return `${selectedValues.length} filters selected`;
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={[
            styles.buttonText,
            selectedValues.length === 0 && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {getDisplayText()}
        </Text>
        <ImageCustom
          source="https://img.icons8.com/?size=100&id=85018&format=png&color=000000"
          width={18}
          height={18}
          color="#EB4747"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Select Filters</Text>
                  {selectedValues.length > 0 && (
                    <TouchableOpacity onPress={clearAll}>
                      <Text style={styles.clearButton}>Clear All</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView
                  style={{ maxHeight }}
                  showsVerticalScrollIndicator={false}
                >
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.optionRow}
                      onPress={() => toggleSelection(option.value)}
                    >
                      <Checkbox
                        value={selectedValues.includes(option.value)}
                        onValueChange={() => toggleSelection(option.value)}
                        color={
                          selectedValues.includes(option.value)
                            ? "#EB4747"
                            : "#ccc"
                        }
                      />
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 35,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 12,
    color: "#EB4747",
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 300,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  clearButton: {
    fontSize: 14,
    color: "#EB4747",
    fontWeight: "500",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  doneButton: {
    backgroundColor: "#EB4747",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MultiSelectDropdown;
