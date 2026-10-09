import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import colors from './styles/colors';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const bikeLogo = require('../../assets/bike_logo.png');
const yogayogLogo = require('../../assets/yogayoglogo.png');

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('98765 43210');
  const [role, setRole] = useState('bike');

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerRing} />
        <Text style={styles.welcomeEmoji}>👋</Text>
        <Text style={styles.title}>Welcome, Rider!</Text>
        <Text style={styles.description}>Enter your mobile number to continue</Text>
        <Image
          source={yogayogLogo}
          style={styles.headerLogo}
          resizeMode="contain"
          accessibilityLabel="Yogayog logo"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>I AM A</Text>

        <View style={styles.roleRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: role === 'bike' }}
            onPress={() => setRole('bike')}
            style={[styles.roleCard, role === 'bike' && styles.roleCardSelected]}
          >
            <Image source={bikeLogo} style={styles.roleIcon} resizeMode="contain" />
            <Text style={[styles.roleText, role === 'bike' && styles.roleTextSelected]}>
              Bike Rider
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: role === 'truck' }}
            onPress={() => setRole('truck')}
            style={[styles.roleCard, role === 'truck' && styles.roleCardSelected]}
          >
            <Text style={styles.roleIcon}>🚚</Text>
            <Text style={[styles.roleText, role === 'truck' && styles.roleTextSelected]}>
              Truck Driver
            </Text>
          </Pressable>
        </View>

        <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Text style={styles.countryCode}>IN</Text>
            <Text style={styles.countryPrefix}>+91</Text>
          </View>
          <TextInput
            accessibilityLabel="Mobile number"
            keyboardType="phone-pad"
            maxLength={11}
            onChangeText={setPhone}
            placeholder="Mobile number"
            placeholderTextColor={colors.mutedLight}
            style={styles.phoneInput}
            value={phone}
          />
        </View>

        <Text style={styles.terms}>
          By continuing you agree to Yogayog&apos;s{' '}
          <Text style={styles.termsLink}>Partner Terms</Text> &amp;{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate(navigationStrings.VERIFYOTP, {
              phone,
              role,
            })
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Send OTP  →</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
