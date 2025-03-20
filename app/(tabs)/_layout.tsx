import { Stack } from "expo-router";

const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="list" options={{ headerShown: true }} />
    </Stack>
  );
};

export default TabsLayout;
