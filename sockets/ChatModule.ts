import { Socket } from "socket.io-client";

interface ChatMessage {
  content: string;
  avatar_url: string;
  name: string;
}

interface InitializeChatModuleParams {
  chatSocket: Socket | null;
  groupId: string | null;
  onNewMessage?: (msg: ChatMessage) => void;
  onChatHistory?: (msgs: ChatMessage[]) => void;
}

export const initializeChatModule = ({
  chatSocket,
  groupId,
  onNewMessage,
  onChatHistory,
}: InitializeChatModuleParams): void => {
  if (!chatSocket || !groupId) {
    console.error("Missing params for chat module");
    return;
  }

  chatSocket.on("connect", () => {
    console.log("Connected to chat:", chatSocket.id);
  });

  chatSocket.on("disconnect", () => {
    console.log("Disconnected from chat");
  });

  chatSocket.on("receive_message", (data) => {
    console.log("Received message:", data);
    const message = {
      content: data.content,
      avatar_url: data.avatar_url,
      name: data.sender_name,
    };
    onNewMessage?.(message);
  });

  chatSocket.on("chat_history", (jsonData) => {
    const messages: ChatMessage[] = jsonData.map(
      (data: { content: any; avatar_url: any; sender_name: any }) => ({
        content: data.content,
        avatar_url: data.avatar_url,
        name: data.sender_name,
      })
    );
    onChatHistory?.(messages);
  });

  chatSocket.emit("join_group", { groupId });
};

export const sendMessage = (
  chatSocket: Socket | null,
  message: string,
  groupId: string | null,
  userId: string | null
): void => {
  if (!groupId || !chatSocket || !userId) {
    console.error("Missing params to send message");
    return;
  }

  const data = {
    senderId: userId,
    groupId,
    content: message,
    mediaUrls: [],
  };

  chatSocket.emit("send_message", data);
};
