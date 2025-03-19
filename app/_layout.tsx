import { Stack } from "expo-router";
import BackButton from "../components/Button/BackButton";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="(auth)/login"
        options={{
          headerShown: true,
          title: "",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="(auth)/register"
        options={{
          headerShown: true,
          title: "",
        }}
      ></Stack.Screen>
    </Stack>
  );
};
export default StackLayout;
