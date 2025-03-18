import { View, Text, StyleSheet, Image } from 'react-native';
import "../global.css"

const index = () =>{
    return (
        <View className='flex-1 justify-center items-center w-full h-full'>
          <Image source={require('../assets/images/imageHomepage.png')} className='w-[400px] h-[416px]'></Image>
          <View className='w-[80px] h-[80px] bg-[#eb4747] rounded-[90px] flex justify-center items-center'>
              <Image source={{uri: 'https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png&color=fffff'}}
                style={{width: 40, height: 40}} />
               
          </View>
          <Text className='font-bold text-[25px] text-[#404040]'>Emergency?</Text>
          <Text>You are never alone!</Text>
        </View>
      );
}
export default index;