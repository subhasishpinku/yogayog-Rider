import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { recognizeText } from 'expo-ocr-kit';
import { StatusBar } from 'expo-status-bar';

import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import styles from './styles/styles';

const logo = require('../image/rider-YogaYog.png');
const accountTypes = [
  { label: 'Bike', value: 'bike' },
  { label: 'Truck', value: 'truck' },
];

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');
  const [isEmailOtpOpen, setIsEmailOtpOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [accountType, setAccountType] = useState(() => (
    route?.params?.role === 'truck' || route?.params?.role === 'bike'
      ? route.params.role
      : ''
  ));
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
  const {
    authError,
    isRegistering,
    isSendingEmailOtp,
    isVerifyingEmailOtp,
    registerRider,
    sendEmailOtp,
    verifyEmailOtp,
  } = useAuth();

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

  const checkDocumentWithOcr = async (uri, documentType) => {
    const result = await recognizeText(uri);
    const ocrText = String(result?.text || '').toUpperCase();
    const compactText = ocrText.replace(/[^A-Z0-9]/g, '');
    let isValid = false;

    if (documentType === 'pan') {
      isValid = /[A-Z]{5}\d{4}[A-Z]/.test(compactText);
    } else if (documentType === 'aadhaar') {
      isValid = /\d{12}/.test(compactText);
    } else if (documentType === 'drivingLicence') {
      isValid = /[A-Z]{2}\d{13,17}/.test(compactText) || /DRIVING|LICEN[CS]E/.test(ocrText);
    }

    console.log(`[RegisterScreen] ${documentType} OCR response:`, result);

    if (!isValid) {
      throw new Error(`Could not verify the ${documentType} image. Please upload a clear document.`);
    }
  };

  const pickDocument = async (setImage, documentType) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (documentType) await checkDocumentWithOcr(uri, documentType);
        setImage(uri);
      }
    } catch (error) {
      Alert.alert('Document check failed', error.message || 'Unable to verify this document image.');
    }
  };

  const takeDocumentPhoto = async (setImage, documentType) => {
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

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (documentType) await checkDocumentWithOcr(uri, documentType);
        setImage(uri);
      }
    } catch (error) {
      Alert.alert('Document check failed', error.message || 'Unable to verify this document image.');
    }
  };

  const chooseDocumentSource = (setImage, documentType) => {
    Alert.alert('Upload document', 'Choose an image source', [
      { text: 'Gallery', onPress: () => pickDocument(setImage, documentType) },
      { text: 'Camera', onPress: () => takeDocumentPhoto(setImage, documentType) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCreateAccount = () => {
    const requiredFields = [
      [profileImage, 'Upload Photo'],
      [drivingLicenceImage, 'Upload Driving Licence'],
      [panImage, 'Upload PAN Image'],
      [aadhaarImage, 'Upload Aadhaar Image'],
      [fullName, 'Full Name'],
      [phone, 'Primary No'],
      [secondaryPhone, 'Secondary No'],
      [dateOfBirth, 'Date of Birth'],
      [accountType, 'Select Account Type'],
      [email, 'Email'],
      [pincode, 'Pin Code'],
      [city, 'City'],
      [state, 'State'],
      [address, 'Address'],
      [bankAccountNumber, 'Bank Account Number'],
      [bankIfscCode, 'IFSC Code'],
      [secondaryAccountNumber, 'Secondary Account Number'],
      [secondaryIfscCode, 'Secondary IFSC Code'],
      [upiId, 'UPI ID'],
      [vehicleNumber, 'Vehicle Number'],
      [drivingLicenceNumber, 'Driving Licence Number'],
      [panNumber, 'PAN Number'],
      [aadhaarNumber, 'Aadhaar Number'],
    ];
    const missingField = requiredFields.find(([value]) => !String(value || '').trim());

    if (missingField) {
      Alert.alert('Required field missing', `Please complete: ${missingField[1]}`);
      return;
    }

    if (!fullName || !dateOfBirth || !email || !accountType || !pincode || !city || !state || !address) {
      Alert.alert('Required details missing', 'Please complete your basic and address details.');
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Terms required', 'Please accept the terms and conditions to continue.');
      return;
    }

    if (!isEmailVerified) {
      Alert.alert('Verify email', 'Please verify your email before creating an account.');
      return;
    }
    const [day, month, year] = dateOfBirth.split('/');
    const payload = {
      name: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      state: state.trim(),
      mobile: phone.replace(/\D/g, ''),
      sec_mobile: secondaryPhone.replace(/\D/g, ''),
      email: email.trim(),
      veh_type: accountType === 'truck' ? 'Truck' : 'Bike',
      veh_number: vehicleNumber.trim(),
      upi: upiId.trim(),
      ac_numb: bankAccountNumber.trim(),
      ifsc_c: bankIfscCode.trim().toUpperCase(),
      second_acc: secondaryAccountNumber.trim(),
      second_ifsc: secondaryIfscCode.trim().toUpperCase(),
      aadhar_no: aadhaarNumber.trim(),
      pan_no: panNumber.trim().toUpperCase(),
      dl_no: drivingLicenceNumber.trim().toUpperCase(),
      dob: `${year}-${month}-${day}`,
      profile_pic: profileImage,
      dl_pic: drivingLicenceImage,
      pan_pic: panImage,
      aadaar_pic: aadhaarImage,
    };

    registerRider(payload)
      .then(() => navigation.replace(navigationStrings.DASHBOARDSCREEN))
      .catch(() => {
        // The registration error is exposed by AuthContext and rendered below.
      });
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setIsEmailVerified(false);
    setAcceptedTerms(false);
  };

  const handleSendEmailOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address first.');
      return;
    }

    try {
      await sendEmailOtp(email, fullName);
      setEmailOtp('');
      setEmailOtpError('');
      setIsEmailOtpOpen(true);
    } catch (error) {
      Alert.alert('Email verification', error.message);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtp.trim().length !== 6) {
      setEmailOtpError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      await verifyEmailOtp(email, emailOtp);
      setIsEmailVerified(true);
      setIsEmailOtpOpen(false);
      setEmailOtpError('');
    } catch (error) {
      setEmailOtpError(error.message);
    }
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
            <TextInput
              editable={false}
              placeholder="Primary No"
              placeholderTextColor="#777777"
              style={[styles.input, styles.readOnlyInput]}
              value={phone}
            />
            {renderInput('Secondary No', secondaryPhone, setSecondaryPhone, { keyboardType: 'phone-pad', maxLength: 10 })}
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

            {renderInput('Enter Email', email, handleEmailChange, { keyboardType: 'email-address', autoCapitalize: 'none' })}
            <Pressable accessibilityRole="button" disabled={isSendingEmailOtp || isEmailVerified} onPress={handleSendEmailOtp} style={[styles.verifyButton, isEmailVerified && styles.verifiedButton]}>
              <Text style={styles.verifyButtonText}>{isEmailVerified ? 'Verified ✓' : isSendingEmailOtp ? 'Sending...' : 'Verify Mail'}</Text>
            </Pressable>

            <Modal animationType="fade" transparent visible={isEmailOtpOpen} onRequestClose={() => setIsEmailOtpOpen(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setIsEmailOtpOpen(false)}>
                <View style={styles.otpDialog}>
                  <Text style={styles.dropdownTitle}>Verify Your Email</Text>
                  <Text style={styles.otpDescription}>Enter the OTP sent to {email}</Text>
                  <TextInput
                    autoFocus
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={(value) => { setEmailOtp(value.replace(/\D/g, '')); setEmailOtpError(''); }}
                    placeholder="Enter OTP"
                    placeholderTextColor="#777777"
                    style={styles.otpInput}
                    value={emailOtp}
                  />
                  {!!emailOtpError && <Text style={styles.errorText}>{emailOtpError}</Text>}
                  <Pressable accessibilityRole="button" disabled={isVerifyingEmailOtp} onPress={handleVerifyEmailOtp} style={styles.otpVerifyButton}>
                    <Text style={styles.dateDoneText}>{isVerifyingEmailOtp ? 'Verifying...' : 'Verify OTP'}</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>

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
            {renderUpload('Upload Driving Licence', drivingLicenceImage, () => chooseDocumentSource(setDrivingLicenceImage, 'drivingLicence'))}

            <Text style={styles.sectionTitle}>▤  KYC Details</Text>
            {renderInput('PAN Number', panNumber, setPanNumber, { autoCapitalize: 'characters', maxLength: 10 })}
            {renderInput('Aadhaar Number', aadhaarNumber, setAadhaarNumber, { keyboardType: 'number-pad', maxLength: 12 })}
            {renderUpload('Upload PAN Image', panImage, () => chooseDocumentSource(setPanImage, 'pan'))}
            {renderUpload('Upload Aadhaar Image', aadhaarImage, () => chooseDocumentSource(setAadhaarImage, 'aadhaar'))}

            <Pressable onPress={() => {
              if (!isEmailVerified) {
                Alert.alert('Verify email', 'Please verify your email before accepting the terms.');
                return;
              }
              setAcceptedTerms((value) => !value);
            }} style={styles.termsRow}>
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected, !isEmailVerified && styles.checkboxDisabled]}>{acceptedTerms && <Text style={styles.checkmark}>✓</Text>}</View>
              <Text style={styles.termsText}>I accept the terms and conditions</Text>
            </Pressable>
            {!!authError && <Text style={styles.errorText}>{authError}</Text>}
            <Pressable accessibilityRole="button" disabled={isRegistering} onPress={handleCreateAccount} style={[styles.createButton, acceptedTerms && styles.createButtonActive, isRegistering && styles.createButtonDisabled]}>
              <Text style={[styles.createButtonText, acceptedTerms && styles.createButtonTextActive]}>{isRegistering ? 'Creating Account...' : 'Create Account'}</Text>
            </Pressable>
            {!!phone && <Text style={styles.phoneHint}>Registered mobile: +91 {phone}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
