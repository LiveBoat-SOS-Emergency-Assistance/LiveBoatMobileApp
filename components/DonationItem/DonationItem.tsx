import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Avatar from "../Image/Avatar";
import { userServices } from "../../services/user";
interface DonationItemProps {
  item: {
    amount: string;
    charity_id: string;
    description: string;
    extra_data: {};
    id: string;
    order_code: string;
    payment_date: string;
    payment_processor: string;
    status: string;
    user_id: string;
  };
}
const DonationItem = ({ item }: DonationItemProps) => {
  const [user, setUser] = useState<any>(null);
  const [isPressed, setIsPressed] = useState(false);
  const fetchUser = async () => {
    try {
      const result = await userServices.getUserByID(Number(item.user_id));
      console.log(result.data);
      setUser(result.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`flex flex-row w-full px-6 py-2 justify-between items-center ${
        isPressed ? "bg-gray-50" : ""
      }`}
    >
      <View className="flex flex-row gap-2 items-center ">
        <Avatar source={user?.User?.avatar_url} width={40} height={40}></Avatar>
        <View className="flex flex-col gap-1">
          <Text className="text-[#404040] text-[12px]">{user?.name}</Text>
          <Text className="text-[#404040] opacity-50 text-[9px] italic">
            Time: {item.payment_date}
          </Text>
        </View>
      </View>
      <Text className="text-[#404040] text-[12px] font-bold">
        {Number(item.amount).toLocaleString("vi-VN")} VND
      </Text>
    </TouchableOpacity>
  );
};
export default DonationItem;
