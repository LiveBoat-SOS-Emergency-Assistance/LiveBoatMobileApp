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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      // If less than 24 hours ago, show relative time
      if (diffInHours < 24) {
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return diffInMinutes < 1
            ? "Just now"
            : `${diffInMinutes} minutes ago`;
        }
        return `${diffInHours} hours ago`;
      }

      // If less than 7 days ago, show days
      if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      }

      // Otherwise show full date
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const fetchUser = async () => {
    try {
      const result = await userServices.getUserByID(Number(item.user_id));
      // console.log(result.data);
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
          <Text className="text-[#404040] text-[12px] font-medium">
            {user?.name}
          </Text>
          <Text className="text-[#404040] opacity-60 text-[10px] italic">
            {formatDate(item.payment_date)}
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
