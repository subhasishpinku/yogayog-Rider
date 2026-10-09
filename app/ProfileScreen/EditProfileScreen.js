import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

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

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    fullName: 'Suresh Kumar',
    address: '14/2, Tollygunge Main Rd',
    city: 'Kolkata',
    pin: '700033',
    primaryMobile: '+91 98765 43210',
    alternateMobile: '+91 87654 32109',
    email: 'suresh.k@gmail.com',
    accountNumber: 'XXXX XXXX 4821',
    ifscCode: 'SBIN0000421',
    upiId: 'suresh@sbi',
  });

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
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
        <Field label="FULL NAME" value={form.fullName} onChangeText={updateField('fullName')} highlighted />
        <Field label="ADDRESS LINE 1" value={form.address} onChangeText={updateField('address')} />

        <View style={styles.splitFields}>
          <View style={styles.cityField}>
            <Field label="CITY / PIN" value={form.city} onChangeText={updateField('city')} />
          </View>
          <View style={styles.pinField}>
            <Field label=" " value={form.pin} onChangeText={updateField('pin')} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>CONTACT</Text>
        <Field label="PRIMARY MOBILE" value={form.primaryMobile} onChangeText={updateField('primaryMobile')} highlighted />
        <Field label="ALTERNATE MOBILE" value={form.alternateMobile} onChangeText={updateField('alternateMobile')} />
        <Field label="EMAIL" value={form.email} onChangeText={updateField('email')} />

        <Text style={styles.sectionTitle}>BANK DETAILS</Text>
        <Field label="ACCOUNT NUMBER" value={form.accountNumber} onChangeText={updateField('accountNumber')} />
        <Field label="IFSC CODE" value={form.ifscCode} onChangeText={updateField('ifscCode')} />
        <Field label="UPI ID" value={form.upiId} onChangeText={updateField('upiId')} />

        <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
