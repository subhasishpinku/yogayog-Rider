import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const CollectedCash = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.moneyBag}>💰</Text>
        </View>

        <Text style={styles.successTitle}>₹250 <Text style={styles.successTitleAccent}>Collected!</Text></Text>
        <Text style={styles.subtitle}>Payment received from Priya Mehta</Text>
        <Text style={styles.subtitle}>via UPI · Auto-reconciled</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>AWB</Text>
            <Text style={styles.detailValue}>YCG-2025-00921</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={[styles.detailValue, styles.greenValue]}>₹250</Text>
          </View>
          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>UPI · GPay</Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate(navigationStrings.ACTIVEDELIVERY)}
        >
          <Text style={styles.primaryButtonText}>→ Mark Delivered</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate(navigationStrings.DASHBOARDSCREEN)}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CollectedCash;
