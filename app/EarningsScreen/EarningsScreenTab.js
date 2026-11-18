import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import CODHandover from '../CODHandover/CODHandover';
import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import EarningsScreen from './EarningsScreen';
import styles from './styles/styles';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const EarningsScreenTab = () => {
  const navigation = useNavigation();
  const { riderProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('earnings');
  const logoScale = useRef(new Animated.Value(1)).current;
  const handWave = useRef(new Animated.Value(0)).current;
  const riderName = riderProfile?.name || 'Suresh Kumar';
  const riderInitials = riderName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const handRotation = handWave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  useEffect(() => {
    const logoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    const handAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(handWave, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: -1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.delay(1200),
      ])
    );

    logoAnimation.start();
    handAnimation.start();

    return () => {
      logoAnimation.stop();
      handAnimation.stop();
    };
  }, [handWave, logoScale]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111112' }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.ring} />
        <View style={styles.greetingRow}>
          <Animated.Image
            source={require('../../assets/yogayoglogo1.png')}
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          <Text style={styles.greeting}>
            {getTimeBasedGreeting()}{' '}
            <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
              ✋︎
            </Animated.Text>
          </Text>
          <Pressable
            style={styles.walletButton}
            onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
          >
            <Text style={styles.walletButtonText}>Wallet</Text>
          </Pressable>
          <Pressable
            style={[styles.avatar, styles.headerAvatar]}
            onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
          >
            <Text style={styles.avatarText}>{riderInitials || 'SK'}</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: 'row', padding: 8, backgroundColor: '#202022' }}>
        <Pressable
          style={{ flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10, backgroundColor: activeTab === 'earnings' ? '#FFC800' : 'transparent' }}
          onPress={() => setActiveTab('earnings')}
        >
          <Text style={{ color: activeTab === 'earnings' ? '#111112' : '#FFFFFF', fontWeight: '800' }}>Earnings</Text>
        </Pressable>
        <Pressable
          style={{ flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10, backgroundColor: activeTab === 'cod' ? '#FFC800' : 'transparent' }}
          onPress={() => setActiveTab('cod')}
        >
          <Text style={{ color: activeTab === 'cod' ? '#111112' : '#FFFFFF', fontWeight: '800' }}>COD Handover</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        {activeTab === 'earnings' ? <EarningsScreen /> : <CODHandover />}
      </View>
    </View>
  );
};

export default EarningsScreenTab;
