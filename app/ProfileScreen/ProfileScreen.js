import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';
import imagePath from '../constants/imagePath';
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
  const { fetchRiderProfile, riderProfile, uploadRiderDocument } = useHome();
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const [isUpdatingProfileImage, setIsUpdatingProfileImage] = useState(false);

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  const profile = riderProfile || {};
  const profileImageUrl = profile.profile_picture;

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImageUrl]);

  const riderName = profile.name || 'Suresh Kumar';
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

  const handleProfileImagePress = async () => {
    if (isUpdatingProfileImage) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow camera access to update your profile photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      cameraType: ImagePicker.CameraType.front,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setIsUpdatingProfileImage(true);

    try {
      await uploadRiderDocument(asset, 'profile_picture');
      await fetchRiderProfile();
      setProfileImageFailed(false);
      Alert.alert('Profile photo updated', 'Your profile photo has been updated successfully.');
    } catch (error) {
      Alert.alert(
        'Profile photo update failed',
        error.response?.data?.message || error.message || 'Unable to update profile photo.'
      );
    } finally {
      setIsUpdatingProfileImage(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* <StatusBar style="hidden" /> */}
       <StatusBar hidden={true} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRing} />
          <Pressable style={styles.avatar} onPress={handleProfileImagePress} disabled={isUpdatingProfileImage}>
            <Image
              source={profileImageUrl && !profileImageFailed ? { uri: profileImageUrl } : imagePath.demoImage}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setProfileImageFailed(true)}
            />
            <Pressable
              style={styles.avatarCameraButton}
              onPress={(event) => {
                event.stopPropagation?.();
                handleProfileImagePress();
              }}
              disabled={isUpdatingProfileImage}
              accessibilityRole="button"
              accessibilityLabel="Update profile photo"
            >
              <Text style={styles.avatarCameraIcon}>📷</Text>
            </Pressable>
          </Pressable>
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

