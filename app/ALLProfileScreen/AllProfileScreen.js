import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import {
  startBackgroundLocation,
  stopBackgroundLocation,
} from '../Services/BackgroundLocation';
const profileItems = [
  { icon: '✓', title: 'KYC Page & Verification', subtitle: 'Verify your identity and rider account', badge: 'New', tone: 'gold',route: navigationStrings.KYCVERIFICATION  },
  { icon: '▣', title: 'Documents Upload Section', subtitle: 'Upload licence, RC, insurance and ID proof', route: navigationStrings.DOCUMENTSUPLOADSECTION },
  { icon: '⌖', title: 'Live Location on Map', subtitle: 'Share your current delivery location', tone: 'green',route: navigationStrings.LIVELOCATIONMAP  },
  // { icon: '₹', title: 'COD Amount to Collect', subtitle: 'Accept payment by QR or Cash', tone: 'gold' , route: navigationStrings.CODAMOUNTCOLLECT},
  // { icon: 'A–H', title: 'Non-Delivery Reasons', subtitle: 'Choose a reason from A–H when delivery fails', route: navigationStrings.NONDELIVERYREPORT },
  { icon: '↗', title: 'COD Amount Handed Over to Branch', subtitle: 'Record cash handover after your shift', badge: 'New', tone: 'gold' ,route: navigationStrings.CODHANDOVER},
  { icon: '☎', title: 'Call Customer from App', subtitle: 'Contact the customer without leaving the app', badge: 'New', tone: 'green', route: navigationStrings.CALLCUSTOMER },
   
];

const AllProfileScreen = () => {
  const navigation = useNavigation();
  const { isLoggingOut, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          stopTracking();
          await logout();
          navigation.replace(navigationStrings.LOGINSCREEN);
        },
      },
    ]);
  };
 const stopTracking = async () => {
    try {
      await stopBackgroundLocation();
      console.log('Background tracking stopped');
    } catch (error) {
      console.log('Stop error:', error.message);
    }
  };
  return (
  <View style={styles.screen}>
    <StatusBar style="light" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>All Profile</Text>
        <Text style={styles.subtitle}>Manage your rider tools and verification</Text>
      </View>
      <Text style={styles.sectionTitle}>RIDER FEATURES</Text>
      {profileItems.map((item) => (
        <Pressable
          key={item.title}
          style={styles.itemCard}
          onPress={() => item.route && navigation.navigate(item.route)}
        >
          <View style={[styles.itemIcon, item.tone === 'gold' && styles.goldIcon, item.tone === 'green' && styles.greenIcon]}>
            <Text style={[styles.itemIconText, item.tone === 'gold' && styles.goldIconText, item.tone === 'green' && styles.greenIconText]}>{item.icon}</Text>
          </View>
          <View style={styles.itemCopy}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
            </View>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        disabled={isLoggingOut}
        onPress={handleLogout}
        style={[styles.logoutCard, isLoggingOut && styles.logoutCardDisabled]}
      >
        <View style={styles.logoutIcon}>
          <Text style={styles.logoutIconText}>↪</Text>
        </View>
        <Text style={styles.logoutText}>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Text>
      </Pressable>
    </ScrollView>
  </View>
  );
};

export default AllProfileScreen;


