import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Marker {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  userType: "SENDER" | "HELPER" | "NORMAL";
  avatarUrl: string;
}

interface MarkerData {
  id: string;
  coordinate: [number, number];
  userType: "SENDER" | "HELPER" | "NORMAL";
  avatarUrl: string;
}

interface SocketEvents {
  TOCLIENT_USER_DISCONNECTED: string;
  TOCLIENT_COMMON_GROUPS_LOCATIONS: string;
  TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP: string;
  TOSERVER_HEARTBEAT: string;
  TOSERVER_UPDATE_USER_LOCATION: string;
  TOSERVER_SET_USER_INFO: string;
}

const SOCKET_EVENTS: SocketEvents = {
  TOCLIENT_USER_DISCONNECTED: "TOCLIENT_USER_DISCONNECTED",
  TOCLIENT_COMMON_GROUPS_LOCATIONS: "TOCLIENT_COMMON_GROUPS_LOCATIONS",
  TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP:
    "TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP",
  TOSERVER_HEARTBEAT: "TOSERVER_HEARTBEAT",
  TOSERVER_UPDATE_USER_LOCATION: "TOSERVER_UPDATE_USER_LOCATION",
  TOSERVER_SET_USER_INFO: "TOSERVER_SET_USER_INFO",
};

const serverUrl = "https://liveboat-backend.onrender.com";

interface UseSocketReturn {
  socket: React.MutableRefObject<Socket | null>;
  myLocation: [number, number] | null;
  otherUserMarkers: Record<number, MarkerData>;
  updateLocation: (
    latitude: number,
    longitude: number,
    accuracy: number
  ) => void;
  setUserInfo: (userType: string) => void;
  socketEvents: SocketEvents;
  displayOrUpdateMarkers: (data: Marker[]) => void;
  registerCommonSocketEvents: () => Promise<void>;
}

export const useSocket = (): UseSocketReturn => {
  const [userId, setUserId] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://i.pravatar.cc/150"
  );
  const [myLocation, setMyLocation] = useState<[number, number] | null>(null);
  const [otherUserMarkers, setOtherUserMarkers] = useState<
    Record<number, MarkerData>
  >({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await AsyncStorage.getItem("profile");
        const parsedProfile = JSON.parse(profileData || "{}");
        setUserId(Number(parsedProfile?.user_id) || 0);
        setAvatarUrl(
          parsedProfile?.User?.avatar_url || "https://i.pravatar.cc/150"
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    initializeSocket();

    const interval = setInterval(() => {
      if (socketRef.current) {
        socketRef.current.emit(SOCKET_EVENTS.TOSERVER_HEARTBEAT);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, []);

  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io(serverUrl);

      socketRef.current.on("connect", () => {
        console.log(`✅ Connected to server: ${socketRef.current?.id}`);
        registerCommonSocketEvents();
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Disconnected from server");
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("❌ Connection error:", error.message);
        Toast.show({
          type: "error",
          text1: "Connection Error",
          text2: error.message,
        });
      });

      socketRef.current.on("error", (error: Error) => {
        console.error("❌ Socket error:", error.message);
        Toast.show({
          type: "error",
          text1: "Socket Error",
          text2: error.message,
        });
      });
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log("Socket disconnected.");
      socketRef.current = null;
    }
  };

  const registerCommonSocketEvents = async () => {
    if (!socketRef.current) {
      console.error("Socket is not initialized.");
      return;
    }

    const groupIds = JSON.parse(
      (await AsyncStorage.getItem("groupIds")) || "[]"
    );
    // console.log("Registering common socket events...");
    // console.log("Group IDs:", groupIds);

    socketRef.current.on(
      SOCKET_EVENTS.TOCLIENT_COMMON_GROUPS_LOCATIONS,
      (data: Marker[]) => {
        // console.log("Common groups locations:", data);
        displayOrUpdateMarkers(data);
      }
    );

    socketRef.current.on(
      SOCKET_EVENTS.TOCLIENT_USER_DISCONNECTED,
      (data: any) => {
        console.log("User disconnected:", data.userId);
        setOtherUserMarkers((prevMarkers) => {
          const updatedMarkers = { ...prevMarkers };
          delete updatedMarkers[data.userId];
          return updatedMarkers;
        });
      }
    );
  };

  // const displayOrUpdateMarkers = (data: Marker[]) => {
  //   console.log("Displaying or updating markers:", data);
  //   const updatedMarkers: Record<number, MarkerData> = { ...otherUserMarkers };

  //   data.forEach((user) => {
  //     updatedMarkers[user.userId] = {
  //       id: user.userId.toString(),
  //       coordinate: [user.longitude, user.latitude],
  //       userType: user.userType,
  //       avatarUrl: user.avatarUrl,
  //     };
  //   });

  //   setOtherUserMarkers(updatedMarkers);
  // };
  const displayOrUpdateMarkers = (data: Marker[]) => {
    console.log("Displaying or updating markers:", data);

    const updatedMarkers: Record<number, MarkerData> = { ...otherUserMarkers };

    data.forEach((user) => {
      updatedMarkers[user.userId] = {
        id: user.userId.toString(),
        coordinate: [user.longitude, user.latitude],
        userType: user.userType,
        avatarUrl: user.avatarUrl,
      };
    });

    setOtherUserMarkers(updatedMarkers); // Update the state with new markers
  };
  const setUserInfo = async (userType: string) => {
    if (socketRef.current) {
      const groupIds = JSON.parse(
        (await AsyncStorage.getItem("groupIds")) || "[]"
      );
      console.log("userId", userId);
      console.log("avatarUrl", avatarUrl);
      console.log("groupIds", groupIds);
      console.log("userType", userType);
      console.log("timestamp", Date.now());
      console.log("accuracy", 0);

      socketRef.current.emit(SOCKET_EVENTS.TOSERVER_SET_USER_INFO, {
        userId,
        avatarUrl,
        groupIds,
        userType,
        timestamp: Date.now(),
        accuracy: 0,
      });
    }
  };

  const updateLocation = (
    latitude: number,
    longitude: number,
    accuracy: number
  ) => {
    if (!latitude || !longitude) return;
    setMyLocation([latitude, longitude]);
    socketRef.current?.emit(SOCKET_EVENTS.TOSERVER_UPDATE_USER_LOCATION, {
      latitude,
      longitude,
      accuracy,
    });
  };

  return {
    socket: socketRef,
    myLocation,
    otherUserMarkers,
    updateLocation,
    setUserInfo,
    socketEvents: SOCKET_EVENTS,
    displayOrUpdateMarkers,
    registerCommonSocketEvents,
  };
};
