import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';

import styles from './styles/styles';

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
  const { fetchRiderProfile, riderProfile } = useHome();

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  const profile = riderProfile || {};
  const riderName = profile.name || 'Suresh Kumar';
  const riderInitials = riderName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const formattedDob = profile.dob
    ? new Date(`${profile.dob}T00:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '15 Mar 1995';
  const accountNumber = profile.ac_numb
    ? `•••• •••• ${String(profile.ac_numb).slice(-4)}`
    : '•••• •••• 4821';
  const personalInformation = [
    ['Full Name', riderName],
    ['Date of Birth', formattedDob],
    ['Gender', 'Not available'],
    ['Address', [profile.address, profile.city].filter(Boolean).join(', ') || 'Not available'],
    ['City / State', [profile.city, profile.state].filter(Boolean).join(', ') || 'Not available'],
    ['PIN Code', profile.pincode || 'Not available'],
  ];
  const contactNumbers = [
    ['Primary Mobile', profile.phone ? `+91 ${profile.phone}` : 'Not available', 'highlight'],
    ['Alternate Mobile', profile.sec_phone || 'Not available'],
    ['Emergency Contact', 'Not available'],
    ['Email', profile.email || 'Not available'],
  ];
  const vehicleDetails = [
    ['Vehicle Type', `🛵 ${profile.veh_type || 'Bike'}`],
    ['Registration No.', profile.veh_number || 'Not available', 'highlight'],
    ['Make / Model', 'Not available'],
    ['Year', profile.created_at ? profile.created_at.slice(0, 4) : 'Not available'],
    ['Insurance Expiry', 'Not available', 'warning'],
  ];
  const bankDetails = [
    ['Account Name', riderName],
    ['Bank Name', 'Not available'],
    ['Account No.', accountNumber],
    ['IFSC Code', profile.ifsc_c || 'Not available'],
    ['Account Type', 'Not available'],
    ['UPI ID', profile.upi || 'Not available', 'highlight'],
  ];

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
            <Text style={styles.avatarText}>{riderInitials || 'SK'}</Text>
          </View>
          <Text style={styles.name}>{riderName}</Text>
          <Text style={styles.role}>🛵 {profile.veh_type || 'Bike'} · {profile.rider_code || 'YCG-RDR-0042'}</Text>
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
          onPress={() => navigation.navigate(navigationStrings.EDITPROFILESCREEN, { profile })}
        >
          <Text style={styles.editIcon}>✎</Text>
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

