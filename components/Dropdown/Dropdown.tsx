import React, { useState, useEffect } from "react";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import ImageCustom from "../Image/Image";

type DropdownItem = {
  label: string;
  value: string;
};
type Variant = "light" | "primary" | "danger";
type DropdownProps = {
  items: DropdownItem[];
  defaultValue?: string;
  onChangeValue?: (value: string | null) => void;
  variant?: Variant;
};

const variantStyles: Record<Variant, { bgColor: string; textColor: string }> = {
  light: {
    bgColor: "#ffffff",
    textColor: "#007bff",
  },
  primary: {
    bgColor: "#80C4E9",
    textColor: "#ffffff",
  },
  danger: {
    bgColor: "#dc3545",
    textColor: "#ffffff",
  },
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultValue,
  onChangeValue,
  variant = "light",
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(defaultValue || null);

  useEffect(() => {
    if (!defaultValue && items.length > 0) {
      setValue(items[0].value);
    }
  }, [items, defaultValue]);

  useEffect(() => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  }, [value, onChangeValue]);
  const { bgColor, textColor } = variantStyles[variant];
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={() => {}}
      placeholder="OnGoing"
      style={{
        backgroundColor: bgColor,
        borderColor: "#ccc",
        borderRadius: 20,
        height: 40,
        minHeight: 40,
      }}
      dropDownContainerStyle={{
        backgroundColor: bgColor,
        borderColor: "#ccc",
        borderRadius: 10,
      }}
      textStyle={{
        fontSize: 13,
        color: textColor,
        // fontWeight: "bold",
      }}
      placeholderStyle={{
        color: textColor,
        fontStyle: "italic",
      }}
      listItemLabelStyle={{
        color: "#404040",
      }}
      selectedItemLabelStyle={{
        color: textColor,
      }}
      showArrowIcon={true}
      showTickIcon={true}
      ArrowDownIconComponent={({ style }) => (
        <ImageCustom
          source="https://img.icons8.com/?size=100&id=85018&format=png&color=000000"
          width={15}
          height={15}
          color={textColor}
        ></ImageCustom>
      )}
      ArrowUpIconComponent={({ style }) => (
        <ImageCustom
          source="https://img.icons8.com/?size=100&id=89443&format=png&color=000000"
          width={15}
          height={15}
          color={textColor}
        ></ImageCustom>
      )}
      TickIconComponent={({ style }) => (
        <ImageCustom
          source="https://img.icons8.com/?size=100&id=82769&format=png&color=000000"
          width={15}
          height={15}
          color={textColor}
        ></ImageCustom>
      )}
    />
  );
};

export default Dropdown;
