import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles/styles';

import EarningsScreen from '../EarningsScreen/EarningsScreen';
import HomeScreen from '../HomeScreen/HomeScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import ActiveScreen from '../ActiveScreen/ActiveScreen';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const screens = { home: <HomeScreen navigation={navigation} />, active: <ActiveScreen />, earnings: <EarningsScreen />, profile: <ProfileScreen /> };
  const tabs = [['home', '🏠', 'Home'], ['active', '📦', 'Active'], ['earnings', '💰', 'Earnings'], ['profile', '👤', 'Profile']];
  return <View style={styles.screen}><StatusBar style="light" />{screens[activeTab]}<View style={styles.bottomTabs}>{tabs.map(([key, icon, label]) => <Pressable key={key} style={styles.tab} onPress={() => setActiveTab(key)}><Text style={styles.tabIcon}>{icon}</Text><Text style={key === activeTab ? styles.activeTab : styles.tabLabel}>{label}</Text></Pressable>)}</View></View>;
};
export default DashboardScreen;



