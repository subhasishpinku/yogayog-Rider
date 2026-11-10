import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${date}, ${time}`;
};

const KYCApproved = () => {
  const navigation = useNavigation();
  const verifiedOn = getCurrentDateTime();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.approvalIcon}>
          <Text style={styles.approvalEmoji}>🎉</Text>
        </View>
        <Text style={styles.title}>KYC Approved!</Text>
        <Text style={styles.subtitle}>You are now a verified Yogayog{`\n`}Rider Partner. Start earning now!</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rider ID</Text>
            <Text style={[styles.detailValue, styles.riderId]}>YCG-RDR-0042</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Verified On</Text>
            <Text style={styles.detailValue}>{verifiedOn}</Text>
          </View>
          <View style={[styles.detailRow, styles.lastDetailRow]}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, styles.activeStatus]}>• Active</Text>
          </View>
        </View>

        <Pressable style={styles.startButton} onPress={() => navigation.navigate(navigationStrings.DASHBOARDSCREEN)}>
          <Text style={styles.startButtonText}>Start Riding →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default KYCApproved;
