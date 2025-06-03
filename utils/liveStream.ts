import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getRoomPeersAmount } from "../mediaSoup";
import { Audio } from "expo-av";

// Utility functions for managing audio participants in React Native
// No hooks, no JSX, no DOM usage
// All UI/state logic should be handled in React components

// Type for an audio participant
export interface AudioParticipant {
  remoteProducerId: string;
  trackUri: string; // URI to play audio (e.g., from server or local file)
  name?: string;
  avatarUrl?: string;
  isAudioOn?: boolean;
}

// In-memory store for audio participants
const audioParticipants: Record<
  string,
  { remoteProducerId: string; track: any; sound?: Audio.Sound | null }
> = {};

/**
 * Add or update an audio participant in the in-memory store.
 * Returns the participant object for use in UI components.
 */
export function addOrUpdateAudioParticipant({
  remoteProducerId,
  track,
}: {
  remoteProducerId: string;
  track: any;
}) {
  audioParticipants[remoteProducerId] = { remoteProducerId, track };
  return audioParticipants[remoteProducerId];
}
/**
 * Update audio participant - adds or updates existing participant
 */
export const updateAudioParticipant = (props: any) => {
  const { remoteProducerId, track, userInfo } = props;

  console.log("🎤 Updating audio participant:", {
    remoteProducerId,
    track,
    userInfo,
  });

  // Store participant data for UI components to consume
  audioParticipants[remoteProducerId] = {
    remoteProducerId,
    track,

    sound: null,
  };

  // Call callback if provided (for UI updates)
  if (globalAudioParticipantCallback) {
    globalAudioParticipantCallback("add", {
      id: remoteProducerId,
      producerId: remoteProducerId,
      track,
      userId: userInfo?.userId,
      name: userInfo?.name || `User ${remoteProducerId.substring(0, 4)}`,
      avatar:
        userInfo?.avatar_url ||
        "https://img.icons8.com/?size=100&id=23264&format=png&color=000000",
      isAudioOn: true,
    });
  }
};

/**
 * Remove an audio participant from the in-memory store.
 */
export function removeAudioParticipant(remoteProducerId: string) {
  console.log("🎤 Removing audio participant:", remoteProducerId);

  if (audioParticipants[remoteProducerId]) {
    // Optionally unload sound if managed here
    if (audioParticipants[remoteProducerId].sound) {
      audioParticipants[remoteProducerId].sound?.unloadAsync();
    }
    delete audioParticipants[remoteProducerId];
  }

  // Call callback if provided (for UI updates)
  if (globalAudioParticipantCallback) {
    globalAudioParticipantCallback("remove", { producerId: remoteProducerId });
  }
}

// Global callback for UI updates - will be set by PreLive component
let globalAudioParticipantCallback:
  | ((action: "add" | "remove" | "update", data: any) => void)
  | null = null;

/**
 * Set callback for audio participant updates
 */
export function setAudioParticipantCallback(
  callback: (action: "add" | "remove" | "update", data: any) => void
) {
  globalAudioParticipantCallback = callback;
}

/**
 * Update audio participant status (mute/unmute)
 */
export function updateAudioParticipantStatus(
  remoteProducerId: string,
  isAudioOn: boolean
) {
  console.log("🎤 Updating audio status:", { remoteProducerId, isAudioOn });

  if (globalAudioParticipantCallback) {
    globalAudioParticipantCallback("update", {
      producerId: remoteProducerId,
      isAudioOn,
    });
  }
}

/**
 * Get all current audio participants as an array.
 */
export function getAudioParticipants() {
  return Object.values(audioParticipants);
}

/**
 * Utility to play audio from a URI (for use in components/screens).
 */
export async function playAudioFromUri(uri: string): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true }
  );
  return sound;
}

// --- UI/Component logic stubs ---
// These should be implemented in React Native components/screens, not here.

// export async function updateViewCount() {
//   try {
//     const view = await getRoomPeersAmount();
//     console.log(`Current viewers: ${view}`);
//     return view;
//   } catch (error) {
//     console.error("Error updating view count:", error);
//     return 0;
//   }
// }

// export function updateRoomVideo(props: any): void {
//   // Implement in component: update video stream or fallback image
//   const { track } = props;
//   return track;
// }

// export function updateCameraStatus(
//   isCameraOn: boolean,
//   producerId: string
// ): void {}

// export function updateAudioStatus(
//   isAudioOn: boolean,
//   producerId: string
// ): void {}

// export function scrollChatToBottom(): void {
//   // Implement in component: use FlatList ref and scrollToEnd
// }

// export function displayNewMessage(props: any): void {
//   // Implement in component: add message to chat state and scroll to bottom
// }

const styles = StyleSheet.create({
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#4CAF50",
  },
});
