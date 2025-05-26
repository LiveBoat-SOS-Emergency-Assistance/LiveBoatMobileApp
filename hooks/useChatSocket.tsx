import { createContext, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { io, Socket } from "socket.io-client";

interface SocketEvents {
  RECEIVE_MESSAGE: string;
  CHAT_HISTORY: string;
  JOIN_GROUP: string;
  SEND_MESSAGE: string;
}

const SOCKET_EVENTS: SocketEvents = {
  RECEIVE_MESSAGE: "receive_message",
  CHAT_HISTORY: "chat_history",
  JOIN_GROUP: "join_group",
  SEND_MESSAGE: "send_message",
};
interface UseChatSocketReturn {
  socket: React.MutableRefObject<Socket | null>;
  messages: any[];
  sendMessage: (
    senderId: number,
    groupId: number,
    content: string,
    mediaFiles: any[]
  ) => Promise<boolean>;
  joinGroup: (groupId: number, userId: number) => void;
  socketEvents: SocketEvents;
  registerSocketEvents: () => void;
}
export const useChatSocket = (): UseChatSocketReturn => {
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    initializeSocket();
    return () => {
      disconnectSocket();
    };
  }, []);
  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io("https://liveboat-backend.onrender.com");

      socketRef?.current?.on("connect", () => {
        console.log(`✅ Connected to server chat: ${socketRef?.current?.id}`);
        registerSocketEvents();
      });

      socketRef.current.on("disconnect", () => {
        console.log(`❌ Disconnected from server`);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("❌ Connection error:", error.message);
        Toast.show({
          type: "error",
          text1: "Connection Error",
          text2: error.message,
        });
      });

      socketRef.current.on("error", (error) => {
        console.error("❌ Socket error:", error);
        Toast.show({
          type: "error",
          text1: "Socket Error",
          text2: error.toString(),
        });
      });
    }
  };
  // let isSocketRegistered = false;

  const registerSocketEvents = () => {
    socketRef?.current?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log("Received message in React Native:", data);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, data];
        // console.log("Updated messages:", newMessages);
        return newMessages;
      });
    });

    socketRef?.current?.on(SOCKET_EVENTS.CHAT_HISTORY, (data) => {
      setMessages(data);
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log("❌ Socket disconnected123.");
      socketRef.current = null;
    }
  };
  const uploadMediaFiles = async (mediaFiles: any[]) => {
    /* TODO
      Implement media file upload functionality for React Native
      This should handle:
      1. Getting signed URLs from server
      2. Uploading files to storage
      3. Returning array of uploaded file URLs
      
      Example implementation:
      const mediaData = files.map(file => ({
        fileName: file.name,
        fileType: file.type
      }));

      const response = await fetch(`${serverUrl}/gcp-storage/generate-signed-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaData),
      });

      const signedUrls = await response.json();
      // ... handle upload and return URLs
    */
  };
  const sendMessage = async (
    senderId: number,
    groupId: number,
    content: string,
    mediaFiles: any[]
  ) => {
    if (!socketRef.current) return false;

    try {
      // if (mediaFiles.length > 3) {
      //   throw new Error("You can only upload up to 3 media files.");
      // }

      // let mediaUrls = [];
      // if (mediaFiles.length > 0) {
      //   // mediaUrls = await uploadMediaFiles(mediaFiles);
      // }

      const data = {
        senderId,
        groupId,
        content,
        mediaUrls: mediaFiles,
      };
      console.log("Socket status:", socketRef.current?.connected);
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
  return {
    socket: socketRef,
    messages,
    sendMessage,
    joinGroup,
    socketEvents: SOCKET_EVENTS,
    registerSocketEvents,
  };
};
