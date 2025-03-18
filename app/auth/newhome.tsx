import "../global.css"
import { View, Text, StyleSheet, Image, Button, Pressable } from 'react-native';
import Fonts from '../../constants/Fonts';
const NewHome = () =>{
    return (
        <View className='flex-1 justify-center items-center w-full h-full flex flex-col relative'>
            <Image source={require('../assets/images/imageHomepage.png')} style={{width:350, height:350}}></Image>
            <View className='w-[80px] h-[80px] bg-[#eb4747] rounded-[90px] flex justify-center items-center'>
                <Image source={{uri: 'https://img.icons8.com/?size=100&id=EdlByEkcflBj&format=png&color=fffffff'}}
                  style={{width: 40, height: 40}} />
            </View>
            
            <View className='flex flex-col gap-1 w-full justify-center items-center'>
              <Text className='font-extrabold text-[25px] text-[#404040]' style={{fontFamily:Fonts.PoppinsBold}}>Emergency?</Text>
              <Text className='font-extrabold text-[25px] text-[#404040]' style={{fontFamily:Fonts.PoppinsItalic}}>You are never alone!</Text>
            </View>
           <View className='flex flex-col gap-4 w-full justify-center items-center pt-2'>
              <Pressable className='bg-[#eb4747] text-white py-4 flex items-center w-[80%] rounded-[30px] shadow-md'>
                <Text className='text-white font-bold text-[18px]'>Create account</Text>
              </Pressable>
              
              <Pressable className='bg-white py-3 flex items-center w-[80%] rounded-[30px] border-[#d9d9d9] border shadow-md flex-row justify-center gap-2'>
               <Image source={require('../assets/images/gg.png')}
                    style={{width: 30, height: 30}} />
                <Text className='text-[#404040] font-bold text-[18px]'>Continue with Google</Text>
              </Pressable>
              <Text className='underline text-[#404040]'>Have an account? Sign in</Text>
           </View>
           <Text className='text-[13px] bottom-0  absolute'>
               By proceeding, you agree to our Term of Use and confirm you 
                 have read our 
                 <Text className='font-bold'>Privacy and Cookie Statement</Text>
            </Text>
        </View>
      );
}
export default NewHome;