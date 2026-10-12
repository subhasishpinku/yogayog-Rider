import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const steps = [
  { label: 'Profile', state: 'completed', symbol: '✓' },
  { label: 'Documents', state: 'completed', symbol: '✓' },
  { label: 'Verification', state: 'active', symbol: '3' },
  { label: 'Approved', state: 'pending', symbol: '4' },
];

const verificationSteps = [
  { icon: '✓', title: 'Basic Profile', subtitle: 'Name, address, contact details', status: 'Completed', state: 'completed' ,route: navigationStrings.EDITPROFILESCREEN},
  { icon: '✓', title: 'Document Upload', subtitle: 'Aadhaar, PAN, DL, RC, Insurance', status: 'Uploaded', state: 'completed', route: navigationStrings.DOCUMENTSUPLOADSECTION },
  { icon: '3', title: 'Identity Verification', subtitle: 'Selfie with Aadhaar card', status: 'In Progress', state: 'active' },
  { icon: '4', title: 'Background Check', subtitle: 'Police verification · 3–5 days', status: 'Pending', state: 'pending' },
];

const KYCPageVerification = () => {
  const navigation = useNavigation();
  const [selfieUri, setSelfieUri] = useState(null);

  const takeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow camera access for selfie verification.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selfieUri = result.assets[0].uri;
      setSelfieUri(selfieUri);
      navigation.navigate(navigationStrings.KYCAPPROVED, { selfieUri });
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>KYC Verification</Text>
          <Text style={styles.subtitle}>Complete all steps to start earning</Text>

          <View style={styles.progress}>
            {steps.map((step, index) => (
              <View key={step.label} style={styles.progressStep}>
                {index < steps.length - 1 && <View style={[styles.progressLine, index < 2 && styles.completedLine, index === 2 && styles.activeLine]} />}
                <View style={[styles.progressDot, step.state === 'completed' && styles.completedDot, step.state === 'active' && styles.activeDot]}>
                  <Text style={[styles.progressDotText, step.state === 'active' && styles.activeDotText]}>{step.symbol}</Text>
                </View>
                <Text style={[styles.progressLabel, step.state === 'completed' && styles.completedLabel, step.state === 'active' && styles.activeLabel]}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {verificationSteps.map((step) => (
          <Pressable
            key={step.title}
            style={styles.stepCard}
            onPress={() => step.route && navigation.navigate(step.route)}
            disabled={!step.route}
          >
            <View style={[styles.stepIcon, step.state === 'completed' && styles.completedIcon, step.state === 'active' && styles.activeIcon]}>
              <Text style={[styles.stepIconText, step.state === 'completed' && styles.completedIconText, step.state === 'active' && styles.activeIconText]}>{step.icon}</Text>
            </View>
            <View style={styles.stepCopy}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>
            <Text style={[styles.stepBadge, step.state === 'completed' && styles.completedBadge, step.state === 'active' && styles.activeBadge, step.state === 'pending' && styles.pendingBadge]}>{step.status}</Text>
          </Pressable>
        ))}

        <View style={styles.selfieCard}>
          <Text style={styles.selfieTitle}>📸 Step 3: Selfie Verification</Text>
          <Text style={styles.selfieDescription}>Take a clear selfie holding your Aadhaar card. Make sure your face and card details are clearly visible.</Text>
          <Pressable style={styles.selfieDropzone} onPress={takeSelfie} accessibilityRole="button" accessibilityLabel="Take selfie with Aadhaar">
            {selfieUri ? <Image source={{ uri: selfieUri }} style={styles.selfieImage} /> : <><Text style={styles.cameraEmoji}>🤳</Text><Text style={styles.selfieAction}>Take Selfie with Aadhaar</Text><Text style={styles.selfieHint}>Camera will open automatically</Text></>}
          </Pressable>
          <Pressable style={styles.cameraButton} onPress={takeSelfie}>
            <Text style={styles.cameraButtonText}>{selfieUri ? 'Retake Selfie' : 'Open Camera for Selfie'}</Text>
          </Pressable>
        </View>

        <View style={styles.privacy}>
          <Text style={styles.privacyText}>✓  Your data is encrypted and only used for{`\n`}   verification. We do not share it with third parties.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default KYCPageVerification;


