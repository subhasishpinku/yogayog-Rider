import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';

const logo = require('../image/rider-YogaYog.png');
const accountTypes = [
  { label: 'Bike', value: 'bike' },
  { label: 'Truck', value: 'truck' },
];

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [secondaryAccountNumber, setSecondaryAccountNumber] = useState('');
  const [secondaryIfscCode, setSecondaryIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [drivingLicenceImage, setDrivingLicenceImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const phone = route?.params?.phone || '';

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const handleDateChange = (event, date) => {
    if (event.type === 'dismissed') {
      setIsDatePickerOpen(false);
      return;
    }

    if (date) {
      setSelectedDate(date);
      setDateOfBirth(formatDate(date));
    }

    if (Platform.OS === 'android') setIsDatePickerOpen(false);
  };

  const pickDocument = async (setImage) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) setImage(result.assets[0].uri);
    } catch {
      Alert.alert('Upload failed', 'Unable to select this document image.');
    }
  };

  const takeDocumentPhoto = async (setImage) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera permission is required to take a document photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) setImage(result.assets[0].uri);
    } catch {
      Alert.alert('Camera failed', 'Unable to take this document image.');
    }
  };

  const chooseDocumentSource = (setImage) => {
    Alert.alert('Upload document', 'Choose an image source', [
      { text: 'Gallery', onPress: () => pickDocument(setImage) },
      { text: 'Camera', onPress: () => takeDocumentPhoto(setImage) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCreateAccount = () => {
    if (!fullName || !dateOfBirth || !email || !accountType || !pincode || !city || !state || !address) {
      Alert.alert('Required details missing', 'Please complete your basic and address details.');
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Terms required', 'Please accept the terms and conditions to continue.');
      return;
    }
    Alert.alert('Registration details saved', 'Your profile is ready for verification.');
  };

  const renderInput = (placeholder, value, onChangeText, options = {}) => {
    const { containerStyle, ...inputOptions } = options;
    return (
      <TextInput
        {...inputOptions}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        style={[styles.input, options.multiline && styles.multilineInput, containerStyle]}
        value={value}
        onChangeText={onChangeText}
      />
    );
  };

  const renderUpload = (label, image, onPress) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.uploadBox}>
      {image ? <Image source={{ uri: image }} style={styles.uploadPreview} /> : <Text style={styles.uploadIcon}>↑</Text>}
      <View style={styles.uploadTextWrap}>
        <Text style={styles.uploadTitle}>{image ? 'Image selected' : label}</Text>
        <Text style={styles.uploadHint}>{image ? 'Tap to replace image' : 'JPG or PNG, up to 5 MB'}</Text>
      </View>
      <Text style={styles.uploadAction}>{image ? 'Replace' : 'Upload'}</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>
            <View style={styles.logoRow}>
              <Image accessibilityLabel="Yogayog logo" source={logo} style={styles.logo} resizeMode="contain" />
              <Pressable accessibilityRole="button" onPress={() => pickDocument(setProfileImage)} style={styles.profileUpload}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profilePreview} />
                ) : (
                  <Text style={styles.profileUploadIcon}>↑</Text>
                )}
                <Text style={styles.profileUploadText}>{profileImage ? 'Replace' : 'Upload Photo'}</Text>
              </Pressable>
            </View>
            <Text style={styles.title}>Create Your Profile</Text>
            {/* <Text style={styles.subtitle}>Join us to securely manage your shipments</Text> */}
          </View>

          <View style={styles.form}>
            {renderInput('Enter Full Name', fullName, setFullName, { autoCapitalize: 'words' })}
            <Pressable accessibilityRole="button" onPress={() => setIsDatePickerOpen(true)} style={styles.dateInput}>
              <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
                {dateOfBirth || 'Date of Birth (DD/MM/YYYY)'}
              </Text>
              <Text style={styles.calendarIcon}>▣</Text>
            </Pressable>

            <Modal animationType="fade" transparent visible={isDatePickerOpen} onRequestClose={() => setIsDatePickerOpen(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setIsDatePickerOpen(false)}>
                <View style={styles.datePickerCard}>
                  <Text style={styles.dropdownTitle}>Select Date of Birth</Text>
                  <DateTimePicker
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    maximumDate={new Date()}
                    minimumDate={new Date(1940, 0, 1)}
                    mode="date"
                    onChange={handleDateChange}
                    value={selectedDate}
                  />
                  {Platform.OS === 'ios' && (
                    <Pressable onPress={() => setIsDatePickerOpen(false)} style={styles.dateDoneButton}>
                      <Text style={styles.dateDoneText}>Done</Text>
                    </Pressable>
                  )}
                </View>
              </Pressable>
            </Modal>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: isAccountTypeOpen }} onPress={() => setIsAccountTypeOpen(true)} style={styles.selectInput}>
              <Text style={[styles.selectText, !accountType && styles.placeholderText]}>
                {accountType ? accountTypes.find((item) => item.value === accountType)?.label : 'Select Account Type'}
              </Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>

            <Modal animationType="fade" transparent visible={isAccountTypeOpen} onRequestClose={() => setIsAccountTypeOpen(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setIsAccountTypeOpen(false)}>
                <View style={styles.dropdown}>
                  <Text style={styles.dropdownTitle}>Select Account Type</Text>
                  {accountTypes.map((item) => (
                    <Pressable key={item.value} onPress={() => { setAccountType(item.value); setIsAccountTypeOpen(false); }} style={styles.dropdownOption}>
                      <Text style={styles.dropdownOptionText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal>

            {renderInput('Enter Email', email, setEmail, { keyboardType: 'email-address', autoCapitalize: 'none' })}
            <Pressable accessibilityRole="button" onPress={() => Alert.alert('Verify Mail', 'Email verification will be connected to the registration API.')} style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify Mail</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>⌖  Address Details</Text>
            {renderInput('Enter Pin Code', pincode, setPincode, { keyboardType: 'number-pad', maxLength: 6 })}
            <View style={styles.row}>
              {renderInput('Enter City', city, setCity, { containerStyle: styles.halfInput })}
              {renderInput('Enter State', state, setState, { containerStyle: styles.halfInput })}
            </View>
            {renderInput('Enter Address', address, setAddress, { multiline: true, numberOfLines: 3 })}

            <Text style={styles.sectionTitle}>▣  Bank Details</Text>
            {renderInput('Bank Account Number', bankAccountNumber, setBankAccountNumber, { keyboardType: 'number-pad' })}
            {renderInput('IFSC Code', bankIfscCode, setBankIfscCode, { autoCapitalize: 'characters' })}
            {renderInput('Secondary Account Number', secondaryAccountNumber, setSecondaryAccountNumber, { keyboardType: 'number-pad' })}
            {renderInput('Secondary IFSC Code', secondaryIfscCode, setSecondaryIfscCode, { autoCapitalize: 'characters' })}

            <Text style={styles.sectionTitle}>◉  UPI Details</Text>
            {renderInput('Enter UPI ID', upiId, setUpiId, { autoCapitalize: 'none', keyboardType: 'email-address' })}

            <Text style={styles.sectionTitle}>▱  Vehicle Details</Text>
            {renderInput('Vehicle Number', vehicleNumber, setVehicleNumber, { autoCapitalize: 'characters' })}
            {renderInput('Driving Licence Number', drivingLicenceNumber, setDrivingLicenceNumber, { autoCapitalize: 'characters' })}
            {renderUpload('Upload Driving Licence', drivingLicenceImage, () => chooseDocumentSource(setDrivingLicenceImage))}

            <Text style={styles.sectionTitle}>▤  KYC Details</Text>
            {renderInput('PAN Number', panNumber, setPanNumber, { autoCapitalize: 'characters', maxLength: 10 })}
            {renderInput('Aadhaar Number', aadhaarNumber, setAadhaarNumber, { keyboardType: 'number-pad', maxLength: 12 })}
            {renderUpload('Upload PAN Image', panImage, () => chooseDocumentSource(setPanImage))}
            {renderUpload('Upload Aadhaar Image', aadhaarImage, () => chooseDocumentSource(setAadhaarImage))}

            <Pressable onPress={() => setAcceptedTerms((value) => !value)} style={styles.termsRow}>
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}>{acceptedTerms && <Text style={styles.checkmark}>✓</Text>}</View>
              <Text style={styles.termsText}>I accept the terms and conditions</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={handleCreateAccount} style={[styles.createButton, acceptedTerms && styles.createButtonActive]}>
              <Text style={[styles.createButtonText, acceptedTerms && styles.createButtonTextActive]}>Create Account</Text>
            </Pressable>
            {!!phone && <Text style={styles.phoneHint}>Registered mobile: +91 {phone}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
