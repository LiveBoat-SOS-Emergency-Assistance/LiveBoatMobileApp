import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";

interface keyboardProp {
  children: React.ReactNode;
}
const KeyboardAvoidingContainer = ({ children }: keyboardProp) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default KeyboardAvoidingContainer;
