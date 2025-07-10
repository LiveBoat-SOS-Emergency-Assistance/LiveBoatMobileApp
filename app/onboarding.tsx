import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import OnBoardingScreen from '../components/OnBoarding/OnBoardingScreen';
import { useState, useEffect } from 'react';

export default function OnboardingRoute() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const asyncItemName = 'onboarding-step-3';

    useEffect(() => {
      const checkOnboarding = async () => {
        const onboarded = await AsyncStorage.getItem(asyncItemName);
        if (onboarded == 'true') {
            router.replace('/(tabs)/home');
        } else {
          setLoading(false);
        }
      };
      checkOnboarding();
    }, [router]);
  
    if (loading) return null;
  
    return (
        <OnBoardingScreen
          onDone={async () => {
            await AsyncStorage.setItem(asyncItemName, 'true');
            router.replace('/(tabs)/home');
          }}
        />
    );
}
