import { useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

const BackButton = ({ size = 24 }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
      <Image
        source={{
          uri: "https://img.icons8.com/?size=100&id=84994&format=png&color=000000",
        }}
        style={{ width: 30, height: 30, tintColor: "#404040" }}
      ></Image>
    </TouchableOpacity>
  );
};
export default BackButton;
