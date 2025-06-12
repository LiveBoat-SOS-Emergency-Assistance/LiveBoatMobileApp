import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../baseUrl";

interface Marker {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  userType: "SENDER" | "HELPER" | "NORMAL";
  avatarUrl: string;
  isOnline?: boolean;
}

interface SocketContextType {
  socket: React.MutableRefObject<Socket | null>;
  userId: number;
  myLocation: [number, number] | null;
  otherUserMarkers: Record<number, Marker>;
  setOtherUserMarkers: React.Dispatch<
    React.SetStateAction<Record<number, Marker>>
  >;
  initializeSocket: () => void;
  updateLocation: (
    latitude: number,
    longitude: number,
    accuracy: number
  ) => void;
  messages: any[];
  setUserInfo: (userType: string) => void;
  displayOrUpdateMarkers: (data: Marker[]) => void;
  registerCommonSocketEvents: () => void;
  displayOfflineMarker: (
    userId: number,
    longitude: number,
    latitude: number,
    isOnline?: boolean
  ) => void;
  sendMessage: (
    senderId: number,
    groupId: number,
    content: string,
    mediaFiles: any[]
  ) => Promise<boolean>;
  joinGroup: (groupId: number, userId: number) => void;
  clearAndRefreshMarkers: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_EVENTS = {
  TOCLIENT_USER_DISCONNECTED: "TOCLIENT_USER_DISCONNECTED",
  TOCLIENT_COMMON_GROUPS_LOCATIONS: "TOCLIENT_COMMON_GROUPS_LOCATIONS",
  TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP:
    "TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP",
  TOSERVER_HEARTBEAT: "TOSERVER_HEARTBEAT",
  TOSERVER_UPDATE_USER_LOCATION: "TOSERVER_UPDATE_USER_LOCATION",
  TOSERVER_SET_USER_INFO: "TOSERVER_SET_USER_INFO",
  TOCLIENT_SOS_FINISHED: "TOCLIENT_SOS_FINISHED",
  TOCLIENT_HELPER_LOCATIONS: "TOCLIENT_HELPER_LOCATIONS",

  //
  RECEIVE_MESSAGE: "receive_message",
  CHAT_HISTORY: "chat_history",
  JOIN_GROUP: "join_group",
  SEND_MESSAGE: "send_message",
};

const serverUrl = baseURL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [myLocation, setMyLocation] = useState<[number, number] | null>(null);
  const [otherUserMarkers, setOtherUserMarkers] = useState<
    Record<number, Marker>
  >({});
  const socketRef = useRef<Socket | null>(null);

  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io(serverUrl);
      console.log("✅ Socket initialized");
      socketRef.current.on("connect", () => {
        console.log(`✅ Connected to server: ${socketRef.current?.id}`);
        registerCommonSocketEvents();
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Disconnected from server live location");
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("❌ Connection error:", error.message);
        Toast.show({
          type: "error",
          text1: "Connection Error",
          text2: error.message,
        });
      });
    }
  };

  const registerCommonSocketEvents = async () => {
    if (!socketRef.current) return;
    // setUserInfo("NORMAL");
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
        console.log("User disconnected live location:", data.userId);
        setOtherUserMarkers((prevMarkers) => {
          const updatedMarkers = { ...prevMarkers };
          delete updatedMarkers[data.userId];
          return updatedMarkers;
        });
      }
    );
    // setInterval(() => {
    //   if (socketRef.current) {
    //     socketRef.current.emit(SOCKET_EVENTS.TOSERVER_HEARTBEAT);
    //   }
    // }, 5000);
  };
  const clearAndRefreshMarkers = async () => {
    console.log("🧹 Clearing all markers and requesting fresh data");

    // Clear markers
    setOtherUserMarkers({});

    // Request fresh data
    if (socketRef.current) {
      socketRef.current.emit(
        SOCKET_EVENTS.TOSERVER_GET_LOCATIONS_OF_PEOPLE_IN_SAME_GROUP,
        {
          forceRefresh: true,
          timestamp: Date.now(),
          clearPrevious: true,
        }
      );
    }
  };

  const displayOrUpdateMarkers = (data: Marker[]) => {
    setOtherUserMarkers((prevMarkers) => {
      const updatedMarkers = { ...prevMarkers };
      data.forEach((user) => {
        updatedMarkers[user.userId] = {
          userId: user.userId,
          latitude: user.latitude,
          longitude: user.longitude,
          accuracy: user.accuracy,
          userType: user.userType,
          avatarUrl: user.avatarUrl,
          isOnline: true,
        };
      });
      return updatedMarkers;
    });
  };

  const setUserInfo = async (userType: string) => {
    if (socketRef.current) {
      console.log("setUserInfo calll");
      try {
        const groupIds = JSON.parse(
          (await AsyncStorage.getItem("groupIds")) || "[]"
        );
        console.log("groupIds 165 SocketContext", groupIds);
        const profileData = await AsyncStorage.getItem("profile");
        // console.log("profileData 165 SocketContext", profileData);
        const parsedProfile = JSON.parse(profileData || "{}");
        const userId = Number(parsedProfile?.user_id) || 0;
        const avatarUrl =
          parsedProfile?.User?.avatar_url || "https://i.pravatar.cc/150";

        socketRef.current.emit(SOCKET_EVENTS.TOSERVER_SET_USER_INFO, {
          userId,
          avatarUrl,
          groupIds,
          userType,
          timestamp: Date.now(),
          accuracy: 0,
        });
        console.log("information sent to server:", {
          userId,
          avatarUrl,
          groupIds,
          userType,
          timestamp: Date.now(),
          accuracy: 0,
        });
        console.log("after set userInfo calll");
      } catch (error: any) {
        console.error("Error setting user info:", error.message);
      }
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
  const displayOfflineMarker = (
    userId: number,
    longitude: number,
    latitude: number,
    isOnline?: boolean
  ) => {
    setOtherUserMarkers((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        accuracy: 0,
        latitude: latitude,
        longitude: longitude,
        userType: "SENDER",
        avatarUrl: prev[userId]?.avatarUrl || "https://i.pravatar.cc/150",
        isOnline: isOnline,
      },
    }));
  };
  const sendMessage = async (
    senderId: number,
    groupId: number,
    content: string,
    mediaFiles: any[]
  ) => {
    if (!socketRef.current) return false;

    try {
      if (mediaFiles.length > 3) {
        throw new Error("You can only upload up to 3 media files.");
      }

      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        // mediaUrls = await uploadMediaFiles(mediaFiles);
      }

      const data = {
        senderId,
        groupId,
        content,
        // mediaUrls,
      };

      socketRef.current.emit(SOCKET_EVENTS.SEND_MESSAGE, data);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({ type: "error", text1: "Error", text2: "" });
      return false;
    }
  };

  const joinGroup = (groupId: number, userId: number) => {
    if (!socketRef.current) {
      console.warn("Socket is not initialized");
      return;
    }
    console.log(`Emitting join_group: groupId=${groupId}, userId=${userId}`);
    socketRef.current.emit(SOCKET_EVENTS.JOIN_GROUP, { groupId, userId });
  };

  useEffect(() => {
    initializeSocket();

    const interval = setInterval(() => {
      if (socketRef.current) {
        socketRef.current.emit(SOCKET_EVENTS.TOSERVER_HEARTBEAT);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        userId,
        myLocation,
        otherUserMarkers,
        initializeSocket,
        setOtherUserMarkers,
        updateLocation,
        setUserInfo,
        displayOrUpdateMarkers,
        registerCommonSocketEvents,
        displayOfflineMarker,
        sendMessage,
        messages,
        joinGroup,
        clearAndRefreshMarkers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
