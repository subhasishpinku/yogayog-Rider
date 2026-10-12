import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';

import HomeStack from './app/Navigation/HomeStack';

export default function App() {
  useEffect(() => {
    const fullscreen = async () => {
      await NavigationBar.setVisibilityAsync('hidden');
    };

    fullscreen();
  }, []);

  return (
    <>
      <StatusBar hidden />

      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </>
  );
}

//npx expo run:android
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
 //72:97:2D:20:34:A0:1D:33:C0:F8:E2:94:F8:40:6F:27:68:18:AE:F8