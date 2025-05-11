import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserInfo = () => {
  const [userId, setUserId] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://i.pravatar.cc/150"
  );
  const [groupIds, setGroupIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const profileString = await AsyncStorage.getItem("profile");
        const profile = JSON.parse(profileString || "{}");
        setUserId(Number(profile?.user_id) || 0);
        setAvatarUrl(profile?.User?.avatar_url || "https://i.pravatar.cc/150");

        const groupIdsString = await AsyncStorage.getItem("groupIds");
        const groupIds = JSON.parse(groupIdsString || "[]");
        setGroupIds(groupIds);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return { userId, avatarUrl, groupIds };
};

export default useUserInfo;
