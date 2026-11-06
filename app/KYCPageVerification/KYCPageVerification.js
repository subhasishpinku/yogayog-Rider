import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import FaceDetection from '@react-native-ml-kit/face-detection';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';

const steps = [
  { label: 'Profile', state: 'completed', symbol: '✓' },
  { label: 'Documents', state: 'completed', symbol: '✓' },
  { label: 'Verification', state: 'active', symbol: '3' },
  { label: 'Approved', state: 'pending', symbol: '4' },
];

const verificationSteps = [
  { icon: '✓', title: 'Basic Profile', subtitle: 'Name, address, contact details', status: 'Completed', state: 'completed' ,route: navigationStrings.PROFILESCREEN},
   { icon: '✓', title: 'Document Upload', subtitle: 'Aadhaar, PAN, DL, RC, Insurance', status: 'Uploaded', state: 'completed', route: navigationStrings.DOCUMENTSUPLOADSECTION },
  { icon: '3', title: 'Identity Verification', subtitle: 'Selfie with Aadhaar card', status: 'In Progress', state: 'active' },
  { icon: '4', title: 'Background Check', subtitle: 'Police verification · 3–5 days', status: 'Pending', state: 'pending' },
];

const faceLandmarkNames = [
  'leftEye',
  'rightEye',
  'noseBase',
  'leftCheek',
  'rightCheek',
  'mouthLeft',
  'mouthRight',
  'mouthBottom',
];

const getFaceLandmarkSignature = (face, mirror = false) => {
  const frame = face?.frame;
  if (!frame?.width || !frame?.height) return null;

  const signature = {};
  faceLandmarkNames.forEach((name) => {
    const point = face.landmarks?.[name]?.position;
    if (!point) return;

    const normalizedX = (point.x - frame.left) / frame.width;
    signature[name] = {
      x: mirror ? 1 - normalizedX : normalizedX,
      y: (point.y - frame.top) / frame.height,
    };
  });

  return signature;
};

const getLargestFace = (faces) => faces.reduce((largest, face) => {
  if (!largest) return face;

  const largestArea = (largest.frame?.width || 0) * (largest.frame?.height || 0);
  const faceArea = (face.frame?.width || 0) * (face.frame?.height || 0);
  return faceArea > largestArea ? face : largest;
}, null);

const getFaceSimilarity = (profileFace, selfieFace) => {
  const compareSignatures = (profileMirror, selfieMirror) => {
    const profileSignature = getFaceLandmarkSignature(profileFace, profileMirror);
    const selfieSignature = getFaceLandmarkSignature(selfieFace, selfieMirror);
    const names = faceLandmarkNames.filter(
      (name) => profileSignature?.[name] && selfieSignature?.[name]
    );

    if (names.length < 4) return 0;

    const averageDistance = names.reduce((total, name) => {
      const profilePoint = profileSignature[name];
      const selfiePoint = selfieSignature[name];
      return total + Math.hypot(profilePoint.x - selfiePoint.x, profilePoint.y - selfiePoint.y);
    }, 0) / names.length;

    return Math.max(0, 1 - averageDistance / 0.35);
  };

  return Math.max(
    compareSignatures(false, false),
    compareSignatures(true, false),
    compareSignatures(false, true),
    compareSignatures(true, true)
  );
};

const KYCPageVerification = () => {
  const navigation = useNavigation();
  const { fetchRiderProfile, riderProfile } = useHome();
  const [selfieUri, setSelfieUri] = useState(null);
  const profileImageUri =
    riderProfile?.profile_picture || riderProfile?.profile_image_url;

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  const takeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow camera access for selfie verification.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      cameraType: ImagePicker.CameraType.front,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selfieUri = result.assets[0].uri;

      if (!profileImageUri) {
        Alert.alert('Profile image required', 'Unable to compare the selfie without a profile image.');
        return;
      }

      try {
        const [profileFaces, selfieFaces] = await Promise.all([
          FaceDetection.detect(profileImageUri, {
            performanceMode: 'accurate',
            landmarkMode: 'all',
            minFaceSize: 0.05,
          }),
          FaceDetection.detect(selfieUri, {
            performanceMode: 'accurate',
            landmarkMode: 'all',
            minFaceSize: 0.05,
          }),
        ]);

        console.log('[KYCPageVerification] detected faces:', {
          profile: profileFaces.length,
          selfie: selfieFaces.length,
        });

        const profileFace = getLargestFace(profileFaces);
        const selfieFace = getLargestFace(selfieFaces);

        if (!profileFace || !selfieFace) {
          Alert.alert('Face verification failed', 'Make sure a clear face is visible in both images.');
          return;
        }

        const similarity = getFaceSimilarity(profileFace, selfieFace);
        console.log('[KYCPageVerification] face similarity:', similarity);
        if (similarity < 0.45) {
          Alert.alert('Face does not match', 'The selfie does not match the profile image. Please try again.');
          return;
        }

        setSelfieUri(selfieUri);
        navigation.navigate(navigationStrings.KYCAPPROVED, { selfieUri });
      } catch (error) {
        console.error('[KYCPageVerification] local face verification error:', error);
        Alert.alert('Face verification unavailable', 'Please try again with clear face images.');
      }
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
          <View style={styles.selfieDropzoneRow}>
            <View style={[styles.selfieDropzone, styles.selfieDropzoneHalf]}>
              {profileImageUri ? <Image source={{ uri: profileImageUri }} style={styles.selfieImage} /> : null}
            </View>
            <Pressable style={[styles.selfieDropzone, styles.selfieDropzoneHalf]} onPress={takeSelfie} accessibilityRole="button" accessibilityLabel="Take Selfie Face">
              {selfieUri ? <Image source={{ uri: selfieUri }} style={styles.selfieImage} /> : <><Text style={styles.cameraEmoji}>🤳</Text><Text style={styles.selfieAction}>Take Selfie Face</Text><Text style={styles.selfieHint}>Camera will open automatically</Text></>}
            </Pressable>
          </View>
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


