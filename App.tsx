import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import HomeStack from './app/Navigation/HomeStack';
import { AuthProvider } from "./app/contexts/AuthContext"; // adjust path
import {HomeProvider} from './app/contexts/HomeContext'; // adjust path
// Hide the native splash screen before the React tree renders.
SplashScreen.hideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
      } catch (error) {
        console.log('Initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <StatusBar hidden />
      <AuthProvider >
        <HomeProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
      </HomeProvider>
      </AuthProvider>
    </>
  );
}
//http://192.168.23.135:8082
//npx expo run:android
//npx expo start
//npx expo run:ios
//npx expo prebuild --clean
//npx expo prebuild
//eas build --platform android --profile production
//eas build --platform android --profile preview
//npx eas build --platform android --profile production
//.\gradlew.bat :app:bundleRelease --stacktrace
//npx expo start -c
// cd android
 //.\gradlew signingReport
 // Debug SHA-1 for this project's android/app/debug.keystore:
 // 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
//npx expo install --check
// npx expo prebuild --clean
// npx expo run:android
//npx eas-cli@latest build --platform android --profile development
//gradlew.bat app:assembleDebug --stacktrace
//adb logcat -v color | findstr /I "Google Maps API key authorization AndroidRuntime"
//adb logcat -c
//npx expo run:android --variant release
//npx eas-cli@latest build --platform android --profile preview
//26156609-8bd6-4c3f-b78b-ab3d840e518b
//"lokeash_agarwal"