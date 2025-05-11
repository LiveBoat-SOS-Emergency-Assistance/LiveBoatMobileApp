import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import ImageCustom from "../../../components/Image/Image";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="ProfileSOS"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="DetailSOS"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
                opacity: 0.9,
              }}
              className="w-[30px] h-[30px] rounded-full bg-[#EB4747] flex justify-center items-center"
            >
              <ImageCustom
                source="https://img.icons8.com/?size=100&id=82826&format=png&color=000000"
                width={18}
                height={18}
                color="white"
              ></ImageCustom>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
