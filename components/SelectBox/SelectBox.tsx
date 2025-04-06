import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SelectDropdown, {
  SelectDropdownProps,
} from "react-native-select-dropdown";
import ImageCustom from "../Image/Image";

interface SelectBoxProps {
  data: { title: string }[];
}

export default function SelectBox({ data }: SelectBoxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (data.length > 0) {
      setSelectedIndex(0);
    }
  }, [data]);

  return (
    <View className="w-3/12 items-center justify-center bg-white h-[35px]">
      <SelectDropdown
        data={data}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          setSelectedIndex(index);
        }}
        renderButton={(selectedItem: { title: string }, isOpened: boolean) => (
          <View className="flex-row items-center justify-between w-full border py-3 px-4 border-gray-300 rounded-lg bg-white">
            <Text className="text-gray-700 text-[14px]">
              {selectedItem ? selectedItem.title : "Select an option"}
            </Text>
            <Text className="text-gray-400 text-[14px]">
              {!isOpened && (
                <ImageCustom
                  width={16}
                  height={16}
                  color="#EB4747"
                  source="https://img.icons8.com/?size=100&id=89221&format=png&color=000000"
                ></ImageCustom>
              )}
            </Text>
          </View>
        )}
        renderItem={(
          item: { title: string },
          index: number,
          isSelected: boolean
        ) => (
          <View
            className={`flex-row items-center justify-start p-3 ${
              isSelected ? "bg-gray-200" : "bg-white"
            } border-b border-gray-300 rounded-md`}
          >
            <Text className="text-gray-700 text-[16px]">{item.title}</Text>
          </View>
        )}
        dropdownStyle={{
          borderRadius: 8,
          width: "100%",
          marginTop: 10,
          elevation: 5,
        }}
      />
    </View>
  );
}
