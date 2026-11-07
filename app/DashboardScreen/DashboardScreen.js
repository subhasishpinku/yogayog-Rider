import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles/styles';

import EarningsScreen from '../EarningsScreen/EarningsScreen';
import HomeScreen from '../HomeScreen/HomeScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import ActiveList from '../ActiveScreen/ActiveList';
const DashboardScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [activeListFilter, setActiveListFilter] = useState('all');
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconTranslateY = useRef(new Animated.Value(0)).current;
  const navigateToTab = (tab, filter = 'all') => {
    if (tab === 'active') setActiveListFilter(filter);
    setActiveTab(tab);
  };
  const screens = { home: <HomeScreen navigation={navigation} onNavigateToTab={navigateToTab} />, active: <ActiveList initialStatus={activeListFilter} />, earnings: <EarningsScreen />, profile: <ProfileScreen /> };
  const tabs = [['home', '🏠', 'Home'], ['active', '📦', 'Active'], ['earnings', '💰', 'Earnings'], ['profile', '👤', 'Profile']];

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (activeTab !== 'home') {
          setActiveTab('home');
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => subscription.remove();
    }, [activeTab]),
  );

  useEffect(() => {
    const iconAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(iconScale, {
            toValue: 1.15,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(iconTranslateY, {
            toValue: -3,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(iconTranslateY, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    iconAnimation.start();
    return () => iconAnimation.stop();
  }, [iconScale, iconTranslateY]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {screens[activeTab]}
      <View style={styles.bottomTabs}>
        {tabs.map(([key, icon, label]) => (
          <Pressable key={key} style={styles.tab} onPress={() => setActiveTab(key)}>
            <Animated.Text
              style={[
                styles.tabIcon,
                key === activeTab && {
                  transform: [{ translateY: iconTranslateY }, { scale: iconScale }],
                },
              ]}
            >
              {icon}
            </Animated.Text>
            <Text style={key === activeTab ? styles.activeTab : styles.tabLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
export default DashboardScreen;



