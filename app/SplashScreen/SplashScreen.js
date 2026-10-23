import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import imagePath from '../constants/imagePath';
import { useAuth } from '../contexts/AuthContext';

const bikeLogo = require('../../assets/bike_logo.png');

const SplashScreen = ({ navigation }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(0.96)).current;
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

      <View style={[styles.ring, styles.topRing]} />
      <View style={[styles.ring, styles.bottomRing]} />

      <View style={styles.content}>
        <View style={styles.brand}>
          <Image
            source={bikeLogo}
            style={styles.riderLogo}
            resizeMode="contain"
            accessibilityLabel="Yogayog rider"
          />

          <View style={styles.wordmarkFrame}>
            <Animated.Image
              source={imagePath.splashscreen}
              style={[
                styles.wordmarkImage,
                { transform: [{ scale: wordmarkScale }] },
              ]}
              resizeMode="contain"
              accessibilityLabel="Yogayog"
            />
          </View>

          <Text style={styles.subtitle}>RIDER PARTNER APP</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Animated.View
          style={[styles.accent, { transform: [{ scaleX: progress }] }]}
        />
        <Text style={styles.tagline}>Earning made easy</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
