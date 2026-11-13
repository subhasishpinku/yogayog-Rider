import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
// import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { processFace } from '@rdnf-magiba/expo-face-recognition';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';

const steps = [
  { label: 'Profile', state: 'completed', symbol: '✓' },
  { label: 'Documents', state: 'completed', symbol: '✓' },
  // { label: 'Verification', state: 'active', symbol: '3' },
  // { label: 'Approved', state: 'pending', symbol: '4' },
];

const verificationSteps = [
  { icon: '✓', title: 'Basic Profile', subtitle: 'Name, address, contact details', status: 'Completed', state: 'completed' ,route: navigationStrings.PROFILESCREEN},
  { icon: '✓', title: 'Document Upload', subtitle: 'Aadhaar, PAN, DL, RC, Insurance', status: 'Uploaded', state: 'completed', route: navigationStrings.DOCUMENTSUPLOADSECTION },
  // { icon: '3', title: 'Identity Verification', subtitle: 'Selfie with Aadhaar card', status: 'In Progress', state: 'active' },
  // { icon: '4', title: 'Background Check', subtitle: 'Police verification · 3–5 days', status: 'Pending', state: 'pending' },
];

const IDENTITY_VERIFICATION_STORAGE_KEY = 'kycIdentityVerification';
const DOCUMENT_UPLOAD_STATUS_KEY = 'documentUploadStatus';

const getEmbeddingSimilarity = (firstEmbedding, secondEmbedding) => {
  if (!firstEmbedding?.length || firstEmbedding.length !== secondEmbedding?.length) return 0;

  let dot = 0;
  let firstMagnitude = 0;
  let secondMagnitude = 0;

  firstEmbedding.forEach((value, index) => {
    const firstValue = Number(value) || 0;
    const secondValue = Number(secondEmbedding[index]) || 0;
    dot += firstValue * secondValue;
    firstMagnitude += firstValue * firstValue;
    secondMagnitude += secondValue * secondValue;
  });

  if (!firstMagnitude || !secondMagnitude) return 0;
  return dot / (Math.sqrt(firstMagnitude) * Math.sqrt(secondMagnitude));
};

const getLocalImageUri = async (imageUri, filePrefix) => {
  if (!imageUri || !/^https?:\/\//i.test(imageUri)) return imageUri;

  const extension = imageUri.split('?')[0].split('.').pop() || 'jpg';
  const localUri = `${FileSystem.cacheDirectory}${filePrefix}-${Date.now()}.${extension}`;
  const download = await FileSystem.downloadAsync(imageUri, localUri);
  return download.uri;
};

const KYCPageVerification = () => {
  const navigation = useNavigation();
  const { fetchRiderProfile, riderProfile } = useHome();
  const [selfieUri, setSelfieUri] = useState(null);
  const [isRecognizingFace, setIsRecognizingFace] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isDocumentsUploaded, setIsDocumentsUploaded] = useState(false);
  const profileImageUri =
    riderProfile?.profile_picture || riderProfile?.profile_image_url;

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      AsyncStorage.getItem(DOCUMENT_UPLOAD_STATUS_KEY)
        .then((storedStatus) => {
          if (mounted) {
            setIsDocumentsUploaded(storedStatus === '1');
          }
        })
        .catch(() => {
          if (mounted) {
            setIsDocumentsUploaded(false);
          }
        });

      return () => {
        mounted = false;
      };
    }, [])
  );

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(IDENTITY_VERIFICATION_STORAGE_KEY)
      .then((storedRecord) => {
        if (mounted && storedRecord) {
          const record = JSON.parse(storedRecord);
          const storedSelfieUri = record?.selfieUri || null;
          setIsIdentityVerified(record?.verified === true && !!storedSelfieUri);
          setSelfieUri(storedSelfieUri);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // const takeSelfie = async () => {
  //   const permission = await ImagePicker.requestCameraPermissionsAsync();
  //   if (!permission.granted) {
  //     Alert.alert('Permission required', 'Please allow camera access for selfie verification.');
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [3, 4],
  //     cameraType: ImagePicker.CameraType.front,
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets?.[0]?.uri) {
  //     const selfieUri = result.assets[0].uri;

  //     if (!profileImageUri) {
  //       Alert.alert('Profile image required', 'Unable to compare the selfie without a profile image.');
  //       return;
  //     }

  //     setIsRecognizingFace(true);

  //     try {
  //       const fileExtension = selfieUri.split('.').pop()?.split('?')[0] || 'jpg';
  //       const stableSelfieUri = `${FileSystem.cacheDirectory}kyc-selfie-${Date.now()}.${fileExtension}`;

  //       await FileSystem.copyAsync({
  //         from: selfieUri,
  //         to: stableSelfieUri,
  //       });

  //       const localProfileImageUri = await getLocalImageUri(profileImageUri, 'kyc-profile');

  //       const [profileResult, selfieResult] = await Promise.all([
  //         processFace(localProfileImageUri),
  //         processFace(stableSelfieUri),
  //       ]);

  //       console.log('[KYCPageVerification] on-device face results:', {
  //         profile: profileResult,
  //         selfie: selfieResult,
  //       });

  //       if (!profileResult.success || !selfieResult.success) {
  //         Alert.alert('Face verification failed', 'Make sure both images contain one clear face.');
  //         return;
  //       }

  //       if (!profileResult.embedding || !selfieResult.embedding) {
  //         Alert.alert('Clear face required', 'Please remove glasses and take clear, front-facing photos.');
  //         return;
  //       }

  //       const similarity = getEmbeddingSimilarity(profileResult.embedding, selfieResult.embedding);
  //       console.log('[KYCPageVerification] FaceNet cosine similarity:', similarity);
  //       if (similarity < 0.65) {
  //         Alert.alert('Face does not match', 'The selfie does not match the profile image. Please try again.');
  //         return;
  //       }

  //       setSelfieUri(stableSelfieUri);
  //       setIsIdentityVerified(true);
  //       await AsyncStorage.setItem(
  //         IDENTITY_VERIFICATION_STORAGE_KEY,
  //         JSON.stringify({
  //           verified: true,
  //           selfieUri: stableSelfieUri,
  //           verifiedAt: new Date().toISOString(),
  //         })
  //       );
  //       Alert.alert(
  //         'Face verification successful',
  //         'Your face has been verified successfully.',
  //         [{
  //           text: 'OK',
  //           onPress: () => navigation.navigate(navigationStrings.KYCAPPROVED, { selfieUri: stableSelfieUri }),
  //         }]
  //       );
  //     } catch (error) {
  //       console.error('[KYCPageVerification] local face verification error:', error);
  //       Alert.alert('Face verification unavailable', 'Please try again with clear face images.');
  //     } finally {
  //       setIsRecognizingFace(false);
  //     }
  //   }
  // };

  // const handleVerificationDone = () => {
  //   if (isIdentityVerified) {
  //     navigation.navigate(navigationStrings.DASHBOARDSCREEN);
  //     return;
  //   }

  //   takeSelfie();
  // };

  const displayedVerificationSteps = verificationSteps.map((step) => {
    if (step.title === 'Document Upload') {
      return {
        ...step,
        icon: isDocumentsUploaded ? '✓' : '1',
        status: isDocumentsUploaded ? 'Uploaded' : 'Required',
        state: isDocumentsUploaded ? 'completed' : 'pending',
      };
    }

    return step.title === 'Identity Verification' && isIdentityVerified
      ? { ...step, icon: '✓', status: 'Verified', state: 'completed' }
      : step;
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
        <View style={styles.titleBar}>
        <Pressable style={styles.titleBarBack} onPress={() => navigation.goBack()}>
          <Text style={styles.titleBarBackText}>‹</Text>
        </Pressable>
        <Text style={styles.titleBarText}>KYC Verification</Text>
        <View style={styles.titleBarSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <Pressable style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>‹</Text>
          </Pressable> */}
          {/* <Text style={styles.title}>KYC Verification</Text> */}
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

        {displayedVerificationSteps.map((step) => (
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

        {/* <View style={styles.selfieCard}>
          <Text style={styles.selfieTitle}>📸 Step 3: Selfie Verification</Text>
          <Text style={styles.selfieDescription}>Take a clear selfie holding your Aadhaar card. Make sure your face and card details are clearly visible.</Text>
          <View style={styles.selfieDropzoneRow}>
            <View style={[styles.selfieDropzone, styles.selfieDropzoneHalf]}>
              {profileImageUri ? <Image source={{ uri: profileImageUri }} style={styles.selfieImage} /> : null}
            </View>
            <Pressable style={[styles.selfieDropzone, styles.selfieDropzoneHalf]} onPress={handleVerificationDone} disabled={isRecognizingFace || isIdentityVerified} accessibilityRole="button" accessibilityLabel="Take Selfie Face">
              {selfieUri ? <Image source={{ uri: selfieUri }} style={styles.selfieImage} /> : <><Text style={styles.cameraEmoji}>🤳</Text><Text style={styles.selfieAction}>Take Selfie Face</Text><Text style={styles.selfieHint}>Camera will open automatically</Text></>}
            </Pressable>
          </View>
          <Pressable style={[styles.cameraButton, isRecognizingFace && styles.cameraButtonDisabled]} onPress={handleVerificationDone} disabled={isRecognizingFace}>
            {isRecognizingFace ? (
              <View style={styles.recognitionLoader}>
                <ActivityIndicator size="small" color="#080808" />
                <Text style={styles.cameraButtonText}>Recognizing face...</Text>
              </View>
            ) : (
              <Text style={styles.cameraButtonText}>{isIdentityVerified ? 'Done' : selfieUri ? 'Retake Selfie' : 'Open Camera for Selfie'}</Text>
            )}
          </Pressable>
        </View> 

       <View style={styles.privacy}>
          <Text style={styles.privacyText}>✓  Your data is encrypted and only used for{`\n`}   verification. We do not share it with third parties.</Text>
        </View> */}
      </ScrollView>

      <Modal transparent visible={isRecognizingFace} animationType="fade">
        <View style={styles.recognitionOverlay}>
          <View style={styles.recognitionCard}>
            <ActivityIndicator size="large" color={styles.recognitionSpinner.color} />
            <Text style={styles.recognitionTitle}>Recognizing face...</Text>
            <Text style={styles.recognitionMessage}>Please wait while we verify your identity.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default KYCPageVerification;


