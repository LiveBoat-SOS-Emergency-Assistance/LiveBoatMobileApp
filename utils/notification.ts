import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

// Request notification permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  } else {
    console.log("Notification permission denied");
  }
  return enabled;
}

// Get FCM token
async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

// Handle notifications when the app is in the foreground
function setupForegroundNotification() {
  messaging().onMessage(async (remoteMessage) => {
    console.log(
      "Foreground notification received:",
      JSON.stringify(remoteMessage)
    );
    Toast.show({
      type: "success",
      text1:
        typeof remoteMessage.notification?.title === "string"
          ? remoteMessage.notification.title
          : typeof remoteMessage.data?.title === "string"
          ? remoteMessage.data.title
          : undefined,
      text2:
        typeof remoteMessage.notification?.body === "string"
          ? remoteMessage.notification.body
          : typeof remoteMessage.data?.body === "string"
          ? remoteMessage.data.body
          : undefined,
    });
  });
}

// Handle notifications when the application is in the background
function setupBackgroundNotification() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
      "Background notification received:",
      JSON.stringify(remoteMessage)
    );
  });
}

// Initialize notification service
export async function initializeNotifications() {
  try {
    const permissionGranted = await requestUserPermission();
    if (permissionGranted) {
      await getFCMToken();
      setupForegroundNotification();
      setupBackgroundNotification();
    } else {
      console.log("Cannot initialize notifications without permission");
    }
  } catch (error) {
    console.error("Error initializing notifications:", error);
  }
}
