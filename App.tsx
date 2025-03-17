import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "./global.css"
import { verifyInstallation } from 'nativewind';

export default function App() {
  verifyInstallation();
  return (
    <View className=' w-full h-full flex items-center justify-center'>
      <Text className='text-lg'>hello asdshihi</Text>
      <Text className='text-xl text-red-500'>hihi</Text>
      <StatusBar style="auto" />
    </View>
  );
}

