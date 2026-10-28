import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { useHome } from '../contexts/HomeContext';
import colors from './styles/EditProfileColors';
import styles from './styles/EditProfilestyles';

const Field = ({ label, value, onChangeText, highlighted = false }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, highlighted && styles.highlightedInput]}
      placeholderTextColor={colors.mutedLight}
    />
  </View>
);

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { updateRiderProfile } = useHome();
  const profile = route?.params?.profile || {};
  const noAvailable = 'No Available';
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    riderCode: profile.rider_code || noAvailable,
    fullName: profile.name || noAvailable,
    dateOfBirth: profile.dob || noAvailable,
    address: profile.address || noAvailable,
    city: profile.city || noAvailable,
    state: profile.state || noAvailable,
    pin: profile.pincode || noAvailable,
    primaryMobile: profile.phone ? `+91 ${profile.phone}` : noAvailable,
    alternateMobile: profile.sec_phone || noAvailable,
    email: profile.email || noAvailable,
    vehicleType: profile.veh_type || noAvailable,
    vehicleNumber: profile.veh_number || noAvailable,
    accountNumber: profile.ac_numb || noAvailable,
    secondAccount: profile.second_acc || noAvailable,
    ifscCode: profile.ifsc_c || noAvailable,
    secondIfsc: profile.second_ifsc || noAvailable,
    upiId: profile.upi || noAvailable,
    phonePay: profile.phone_pay || noAvailable,
    aadharNumber: profile.aadhar_no || noAvailable,
    panNumber: profile.pan_no || noAvailable,
    drivingLicense: profile.dl_no || noAvailable,
  });

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const valueOrEmpty = (value) => (value === noAvailable ? '' : value.trim());
  const normalizePhone = (value) => {
    const digits = valueOrEmpty(value).replace(/\D/g, '');
    return digits.replace(/^91(?=\d{10}$)/, '');
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateRiderProfile({
        name: valueOrEmpty(form.fullName),
        address: valueOrEmpty(form.address),
        city: valueOrEmpty(form.city),
        phone: normalizePhone(form.primaryMobile),
        email: valueOrEmpty(form.email),
        veh_type: valueOrEmpty(form.vehicleType),
        veh_number: valueOrEmpty(form.vehicleNumber),
        phone_pay: valueOrEmpty(form.phonePay),
        dl_no: valueOrEmpty(form.drivingLicense),
        pan_no: valueOrEmpty(form.panNumber),
        dob: valueOrEmpty(form.dateOfBirth),
        ac_numb: valueOrEmpty(form.accountNumber),
        ifsc_c: valueOrEmpty(form.ifscCode),
        second_acc: valueOrEmpty(form.secondAccount),
        second_ifsc: valueOrEmpty(form.secondIfsc),
      });

      Alert.alert('Profile updated', 'Your profile has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Update failed',
        error.response?.data?.message || error.message || 'Unable to update profile.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Update your credentials</Text>

        <Text style={styles.sectionTitle}>PERSONAL</Text>
        <Field label="RIDER CODE" value={form.riderCode} onChangeText={updateField('riderCode')} />
        <Field label="FULL NAME" value={form.fullName} onChangeText={updateField('fullName')} highlighted />
        <Field label="DATE OF BIRTH" value={form.dateOfBirth} onChangeText={updateField('dateOfBirth')} />
        <Field label="ADDRESS LINE 1" value={form.address} onChangeText={updateField('address')} />

        <View style={styles.splitFields}>
          <View style={styles.cityField}>
            <Field label="CITY / PIN" value={form.city} onChangeText={updateField('city')} />
          </View>
          <View style={styles.pinField}>
            <Field label=" " value={form.pin} onChangeText={updateField('pin')} />
          </View>
        </View>
        <Field label="STATE" value={form.state} onChangeText={updateField('state')} />

        <Text style={styles.sectionTitle}>CONTACT</Text>
        <Field label="PRIMARY MOBILE" value={form.primaryMobile} onChangeText={updateField('primaryMobile')} highlighted />
        <Field label="ALTERNATE MOBILE" value={form.alternateMobile} onChangeText={updateField('alternateMobile')} />
        <Field label="EMAIL" value={form.email} onChangeText={updateField('email')} />

        <Text style={styles.sectionTitle}>VEHICLE</Text>
        <Field label="VEHICLE TYPE" value={form.vehicleType} onChangeText={updateField('vehicleType')} />
        <Field label="VEHICLE NUMBER" value={form.vehicleNumber} onChangeText={updateField('vehicleNumber')} highlighted />

        <Text style={styles.sectionTitle}>BANK DETAILS</Text>
        <Field label="ACCOUNT NUMBER" value={form.accountNumber} onChangeText={updateField('accountNumber')} />
        <Field label="SECOND ACCOUNT" value={form.secondAccount} onChangeText={updateField('secondAccount')} />
        <Field label="IFSC CODE" value={form.ifscCode} onChangeText={updateField('ifscCode')} />
        <Field label="SECOND IFSC CODE" value={form.secondIfsc} onChangeText={updateField('secondIfsc')} />
        <Field label="UPI ID" value={form.upiId} onChangeText={updateField('upiId')} />
        <Field label="PHONEPE" value={form.phonePay} onChangeText={updateField('phonePay')} />

        <Text style={styles.sectionTitle}>DOCUMENTS</Text>
        <Field label="AADHAAR NUMBER" value={form.aadharNumber} onChangeText={updateField('aadharNumber')} />
        <Field label="PAN NUMBER" value={form.panNumber} onChangeText={updateField('panNumber')} />
        <Field label="DRIVING LICENSE" value={form.drivingLicense} onChangeText={updateField('drivingLicense')} />

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
