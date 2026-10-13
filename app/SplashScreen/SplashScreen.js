import React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Image, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import colors from './styles/colors';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const bikeLogo = require('../../assets/bike_logo.png');

const SplashScreen = ({ navigation }) => {
  // eslint-disable-next-line react-hooks/refs
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        navigation.replace(navigationStrings.LOGINSCREEN);
      }
    });

    return () => animation.stop();
  }, [navigation, progress]);

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

          <Text style={styles.wordmark} accessibilityRole="header">
            <Text style={styles.wordmarkWhite}>YOGA</Text>
            <Text style={styles.wordmarkGold}>YOG</Text>
          </Text>

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
