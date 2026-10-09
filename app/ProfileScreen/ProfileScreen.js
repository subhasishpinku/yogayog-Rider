import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';

import styles from './styles/styles';

const personalInformation = [
  ['Full Name', 'Suresh Kumar'],
  ['Date of Birth', '15 Mar 1995'],
  ['Gender', 'Male'],
  ['Address', '14/2, Tollygunge Main Rd,\nKolkata - 700033'],
  ['City / State', 'Kolkata, West Bengal'],
  ['PIN Code', '700033'],
];

const contactNumbers = [
  ['Primary Mobile', '+91 98765 43210', 'highlight'],
  ['Alternate Mobile', '+91 87654 32109'],
  ['Emergency Contact', 'Ramesh Kumar · +91 76543\n21098'],
  ['Email', 'suresh.k@gmail.com'],
];

const vehicleDetails = [
  ['Vehicle Type', '🛵 Bike'],
  ['Registration No.', 'KA 01 AB 1234', 'highlight'],
  ['Make / Model', 'Honda Activa 6G'],
  ['Year', '2022'],
  ['Insurance Expiry', '31 Dec 2025', 'warning'],
];

const bankDetails = [
  ['Account Name', 'Suresh Kumar'],
  ['Bank Name', 'State Bank of India'],
  ['Account No.', '•••• •••• 4821'],
  ['IFSC Code', 'SBIN0000421'],
  ['Account Type', 'Savings'],
  ['UPI ID', 'suresh@sbi', 'highlight'],
];

const DetailSection = ({ title, rows }) => (
  <View style={styles.detailCard}>
    <Text style={styles.detailTitle}>{title}</Text>
    {rows.map(([label, value, tone], index) => (
      <View key={label} style={[styles.detailRow, index === rows.length - 1 && styles.lastDetailRow]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, tone === 'highlight' && styles.highlightValue, tone === 'warning' && styles.warningValue]}>
          {value}
        </Text>
      </View>
    ))}
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRing} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SK</Text>
          </View>
          <Text style={styles.name}>Suresh Kumar</Text>
          <Text style={styles.role}>🛵 Bike Rider · YCG-RDR-0042</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusChip, styles.onlineChip]}>
              <Text style={styles.onlineText}>• Online</Text>
            </View>
            <View style={[styles.statusChip, styles.ratingChip]}>
              <Text style={styles.ratingText}>★ 4.8 Rating</Text>
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusText}>312 Deliveries</Text>
            </View>
          </View>
        </View>

        <DetailSection title="PERSONAL INFORMATION" rows={personalInformation} />
        <DetailSection title="CONTACT NUMBERS" rows={contactNumbers} />
        <DetailSection title="VEHICLE DETAILS" rows={vehicleDetails} />
        <DetailSection title="BANK DETAILS" rows={bankDetails} />

        <Pressable
          style={styles.editButton}
          onPress={() => navigation.navigate(navigationStrings.EDITPROFILESCREEN)}
        >
          <Text style={styles.editIcon}>✎</Text>
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

