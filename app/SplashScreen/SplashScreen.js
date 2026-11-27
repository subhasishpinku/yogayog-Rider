import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import imagePath from '../constants/imagePath';
import { useAuth } from '../contexts/AuthContext';

const bikeLogo = require('../image/bike4.gif');
// Side-view delivery bike used by the left-to-right splash animation.
const runningBike = require('../image/bike5.gif');

const SplashScreen = ({ navigation }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(0.96)).current;
  const bikeTranslateX = useRef(new Animated.Value(-Dimensions.get('window').width - 70)).current;
  const [splashFinished, setSplashFinished] = useState(false);
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    });
    const wordmarkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(wordmarkScale, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkScale, {
          toValue: 0.96,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start(({ finished }) => {
      if (finished) {
        setSplashFinished(true);
      }
    });
    wordmarkAnimation.start();

    return () => {
      animation.stop();
      wordmarkAnimation.stop();
    };
  }, [navigation, progress, wordmarkScale]);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const bikeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bikeTranslateX, {
          toValue: screenWidth + 70,
          duration: 7000,
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(bikeTranslateX, {
          toValue: -screenWidth - 70,
          duration: 0,
          useNativeDriver: true,
          isInteraction: false,
        }),
      ])
    );

    bikeAnimation.start();

    return () => bikeAnimation.stop();
  }, [bikeTranslateX]);

  useEffect(() => {
    if (splashFinished && !isAuthLoading) {
      navigation.replace(
        isAuthenticated
          ? navigationStrings.DASHBOARDSCREEN
          : navigationStrings.LOGINSCREEN
      );
    }
  }, [isAuthenticated, isAuthLoading, navigation, splashFinished]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* <View style={[styles.ring, styles.topRing]} />
      <View style={[styles.ring, styles.bottomRing]} /> */}

      <View style={styles.content}>
        <View style={styles.brand}>
       

          <View style={styles.wordmarkFrame}>
            <Animated.Image
              source={imagePath.splashscreen1}
              style={[
                styles.wordmarkImage,
                { transform: [{ scale: wordmarkScale }] },
              ]}
              resizeMode="contain"
              accessibilityLabel="Yogayog"
            />
          </View>
       <Image
            source={bikeLogo}
            style={styles.riderLogo}
            resizeMode="contain"
            accessibilityLabel="Yogayog rider"
          />
          <Text style={styles.subtitle}>RIDER PARTNER APP</Text>
        </View>
      </View>

      {/* <View style={styles.footer}>
        <Animated.View
          style={[styles.accent, { transform: [{ scaleX: progress }] }]}
        />
        <Animated.Image
          source={runningBike}
          style={[styles.runningBike, { transform: [{ translateX: bikeTranslateX }] }]}
          resizeMode="contain"
          accessibilityLabel="Moving rider bike"
        />
      </View> */}
    </View>
  );
};

export default SplashScreen;
