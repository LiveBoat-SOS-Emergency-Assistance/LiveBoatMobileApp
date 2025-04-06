import { Image, SafeAreaView, Text, View } from "react-native";
import React from "react";
import Map from "../../../components/Map/Map";
import ImageCustom from "../../../components/Image/Image";
import { ScrollView } from "react-native";
import Information from "../../../components/Information/Information";

const profile_sos = () => {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="w-full bg-white"
      >
        {/* Map Section */}
        <View className="w-full h-[200px] bg-red-300">
          <Map /> {/* Ensure Map takes full space */}
        </View>

        {/* Profile Section */}
        <View className="w-full relative flex flex-col items-center py-4">
          <View className="absolute top-[-20px] left-1/2 -translate-x-1/2">
            <View className="relative">
              <Image
                className="rounded-full w-[90px] h-[90px]"
                source={require("../../../assets/images/ava.jpg")}
              />
              <View className="bg-[#EB4747] absolute bottom-0 right-2 w-8 h-8 rounded-full justify-center items-center flex">
                <ImageCustom
                  width={18}
                  height={18}
                  color="white"
                  source="https://img.icons8.com/?size=100&id=d7iUgF8ZrDaO&format=png&color=000000"
                />
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="flex flex-col mt-[80px] w-full justify-center items-center gap-4">
            <Text className="text-[#404040] font-bold text-[25px]">
              Phuong Anh
            </Text>
            <View className="w-[90%] h-[100px] bg-red-300 shadow-md rounded-[20px] px-5 py-2 gap-2">
              <Text className="text-white font-bold">Description:</Text>
              <Text className="text-white text-[13px]">
                This is the des of sos
              </Text>
            </View>
            <View className="w-[90%] bg-white border-gray-200 shadow-md rounded-[20px] px-5 py-4 gap-2">
              <Text className="text-[#EB4747] font-bold">
                Personal information:
              </Text>
              <View className="flex flex-row gap-1">
                <View className="flex flex-col justify-start gap-2">
                  <Information
                    title="Date of birth:"
                    content="14/04/2000"
                    icon="https://img.icons8.com/?size=100&id=43503&format=png&color=000000"
                  />
                  <Information
                    title="Phone number:"
                    content="09154877258"
                    icon="https://img.icons8.com/?size=100&id=9730&format=png&color=000000"
                  />
                  <Information
                    title="Address:"
                    content="Lien Chieu, Da Nang"
                    icon="https://img.icons8.com/?size=100&id=86457&format=png&color=000000"
                  />
                </View>
                <View className="flex flex-col justify-start gap-2">
                  <Information
                    title="Gender:"
                    content="Female"
                    icon="https://img.icons8.com/?size=100&id=11780&format=png&color=000000"
                  />
                  <Information
                    title="Email:"
                    content="phuonganh@gmail.com"
                    icon="https://img.icons8.com/?size=100&id=85467&format=png&color=000000"
                  />
                </View>
              </View>
            </View>

            <View className="w-[90%] bg-white border-gray-200 shadow-md rounded-[20px] px-5 py-4 gap-2">
              <Text className="text-[#EB4747] font-bold">
                Medical information
              </Text>
              <View className="flex flex-col justify-start gap-2">
                <Information
                  title="Blood type:"
                  content="A+"
                  icon="https://img.icons8.com/?size=100&id=92345&format=png&color=000000"
                />
                <Information
                  title="Allergy:"
                  content="Medicine..."
                  icon="https://img.icons8.com/?size=100&id=7bTFxD2ikcbM&format=png&color=000000"
                />
                <Information
                  title="Medical history:"
                  content="Heart, blood pressure, diabetes,..."
                  icon="https://img.icons8.com/?size=100&id=5BkXi8DP6q2o&format=png&color=000000"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile_sos;
