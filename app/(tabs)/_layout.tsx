import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "home") iconName = "home";
          else if (route.name === "donation") iconName = "heart";
          else if (route.name === "profile") iconName = "person";
          return <Ionicons size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5 },
      })}
    >
      <Tabs.Screen name="home/index" options={{ title: "Home" }} />
      <Tabs.Screen name="donation/index" options={{ title: "Donation" }} />
      <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
      <Tabs.Screen name="list" options={{ title: "Profile" }} />
    </Tabs>
  );
}
