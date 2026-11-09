import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import {
  startBackgroundLocation,
  stopBackgroundLocation,
} from '../Services/BackgroundLocation';

const VerifyOtpScreen = ({ navigation, route }) => {
  const resendDelay = 28;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(resendDelay);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const inputRefs = useRef([]);
  const phone = route?.params?.phone || '98765 43210';
  const role = route?.params?.role === 'truck' ? 'Truck Driver' : 'Bike Rider';
  const {
    authError,
    clearAuthError,
    isVerifyingOtp,
    sendOtp,
    verifyOtp,
  } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateOtp = (value, index) => {
    const nextOtp = [...otp];
    nextOtp[index] = value.replace(/[^0-9]/g, '').slice(-1);
    setOtp(nextOtp);

    if (nextOtp[index] && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(phone, otp.join(''));
      startTracking();
      navigation.replace(navigationStrings.DASHBOARDSCREEN);
    } catch {
      // The error is exposed by AuthContext and rendered below the OTP fields.
    }
  };

  const handleResendOtp = async () => {
    if (seconds > 0 || isResendingOtp) return;

    setIsResendingOtp(true);

    try {
      await sendOtp(phone);
      setOtp(['', '', '', '']);
      setSeconds(resendDelay);
      inputRefs.current[0]?.focus();
    } catch {
      // The error is exposed by AuthContext and rendered above the resend link.
    } finally {
      setIsResendingOtp(false);
    }
  };

  const startTracking = async () => {
    try {
      await startBackgroundLocation();
      console.log('Background tracking started');
    } catch (error) {
      console.log('Tracking error:', error.message);
    }
  };
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.description}>
          Sent to +91 {phone} · {role}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.otpSection}>
          <View style={styles.otpRow}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              accessibilityLabel={`OTP digit ${index + 1}`}
              autoFocus={index === 0}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => updateOtp(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              onFocus={clearAuthError}
              style={styles.otpInput}
              value={value}
            />
          ))}
          </View>

          {!!authError && <Text style={styles.errorText}>{authError}</Text>}

          <Text style={styles.resendText}>
            Didn&apos;t receive?{' '}
            <Text
              accessibilityLabel={seconds > 0 ? `Resend in ${seconds} seconds` : 'Resend OTP'}
              accessibilityRole="link"
              disabled={seconds > 0 || isResendingOtp}
              onPress={handleResendOtp}
              style={[styles.resendLink, (seconds > 0 || isResendingOtp) && styles.resendLinkDisabled]}
            >
              {isResendingOtp
                ? 'Sending...'
                : seconds > 0
                  ? `Resend in ${seconds}s`
                  : 'Resend OTP'}
            </Text>
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isVerifyingOtp}
          onPress={handleVerifyOtp}
          style={[styles.button, isVerifyingOtp && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {isVerifyingOtp ? 'Verifying...' : 'Verify & Start Riding →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerifyOtpScreen


