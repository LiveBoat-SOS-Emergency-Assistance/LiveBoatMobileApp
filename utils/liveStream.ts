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
 * This function should not return JSX. Move UI logic to a React component.
 * If you want to update audio participant state, do it here.
 */
export const updateAudioParticipant = (props: any) => {
  // TODO: Implement logic to update audio participant in state/store.
  // This function should not return JSX or use React hooks.
  // Use this function to update participant data, and render UI in a component.
};

/**
 * Remove an audio participant from the in-memory store.
 */
export function removeAudioParticipant(remoteProducerId: string) {
  if (audioParticipants[remoteProducerId]) {
    // Optionally unload sound if managed here
    if (audioParticipants[remoteProducerId].sound) {
      audioParticipants[remoteProducerId].sound?.unloadAsync();
    }
    delete audioParticipants[remoteProducerId];
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

export async function updateViewCount() {
  try {
    const view = await getRoomPeersAmount();
    // Pass 'view' to your component state/UI
    // console.log(`Current viewers: ${view}`);
    return view;
  } catch (error) {
    console.error("Error updating view count:", error);
    return 0;
  }
}

export function updateRoomVideo(props: any): void {
  // Implement in component: update video stream or fallback image
  const { track } = props;
  if (track) {
  } else {
  }
}

export function updateCameraStatus(
  isCameraOn: boolean,
  producerId: string
): void {}

export function updateAudioStatus(
  isAudioOn: boolean,
  producerId: string
): void {}

export function scrollChatToBottom(): void {
  // Implement in component: use FlatList ref and scrollToEnd
}

export function displayNewMessage(props: any): void {
  // Implement in component: add message to chat state and scroll to bottom
}

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
