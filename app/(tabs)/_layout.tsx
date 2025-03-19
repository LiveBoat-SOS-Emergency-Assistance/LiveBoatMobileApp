import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{ headerShown: false, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="list" options={{ headerShown: false }} />
    </Tabs>
  );
};
