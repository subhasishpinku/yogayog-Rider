import React, { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useHome } from '../contexts/HomeContext';
import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const ShipmentDamagedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log('ShipmentDamagedScreen route.params:', route.params);
  const { reportDamagedItem } = useHome();
  const [attempt, setAttempt] = useState(1);
  const [notes, setNotes] = useState('');
  const [proofUploaded, setProofUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedPhotoUris, setCapturedPhotoUris] = useState([]);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'error' });
  const cameraRef = useRef(null);
  const reasonTitle = route.params?.reasonTitle || 'Reason A · Return to Origin';
  const shipmentId = route.params?.orderId || route.params?.id || 'Shipment';
  const orderId = route.params?.id || route.params?.orderId;
  const customerName = route.params?.customerName || 'Customer';
  const deliveryArea = route.params?.dropArea || route.params?.pickupArea || 'Address unavailable';
  const paymentMethod = route.params?.paymentMethod || 'Payment';
  const amount = Number(route.params?.amount || 0);

  const showDialog = (title, message, type = 'error') => {
    setDialog({ visible: true, title, message, type });
  };

  const closeDialog = () => {
    const shouldGoToDashboard = dialog.type === 'success';
    setDialog((currentDialog) => ({ ...currentDialog, visible: false }));

    if (shouldGoToDashboard) {
      navigation.navigate(navigationStrings.DASHBOARDSCREEN);
    }
  };

  useEffect(() => {
    const reason = String(route.params?.reasonTitle || '').toLowerCase();

    if (reason.includes('item missing')) {
      navigation.replace(navigationStrings.ITEMMISSINGSCREEN, route.params);
    }
  }, [navigation, route.params]);

  const confirmRto = async () => {
    if (submitting) return;

    if (capturedPhotoUris.length === 0) {
      showDialog(
        'Damage photo required',
        'Please take at least 1 damage proof photo before submitting the report.'
      );
      return;
    }

    if (!notes.trim()) {
      showDialog(
        'Additional notes required',
        'Please describe the shipment damage before submitting the report.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await reportDamagedItem({
        orderId,
        notes: notes.trim(),
        imageUris: capturedPhotoUris,
      });

      showDialog('Report submitted', 'The damaged shipment report has been submitted.', 'success');
    } catch (error) {
      showDialog(
        'Unable to submit report',
        error?.response?.data?.message || error?.message || 'Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCamera = async () => {
    if (capturedPhotoUris.length >= 4) {
      showDialog('Photo limit reached', 'You can upload up to 4 damage proof photos.');
      return;
    }

    const permission = cameraPermission?.granted
      ? cameraPermission
      : await requestCameraPermission();

    if (!permission?.granted) {
      showDialog('Camera permission required', 'Please allow camera access to upload shipment damage proof.');
      return;
    }

    setCameraReady(false);
    setCameraVisible(true);
  };

  const takeDamagePhoto = async () => {
    if (!cameraReady) return;

    const photo = await cameraRef.current?.takePictureAsync();

    if (photo?.uri) {
      setCapturedPhotoUris((currentPhotos) => [...currentPhotos, photo.uri].slice(0, 4));
      setProofUploaded(true);
      setCameraVisible(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Modal
        visible={dialog.visible}
        transparent
        animationType="fade"
        onRequestClose={closeDialog}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.78)' }}>
          <View style={{ width: '100%', padding: 24, borderWidth: 1, borderColor: dialog.type === 'success' ? '#FFC800' : '#D94B4B', borderRadius: 24, backgroundColor: '#242426', shadowColor: '#000000', shadowOpacity: 0.35, shadowRadius: 20, elevation: 12 }}>
            <View style={{ width: 58, height: 58, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderRadius: 29, backgroundColor: dialog.type === 'success' ? '#4A3D08' : '#4A2020' }}>
              <Text style={{ color: dialog.type === 'success' ? '#FFC800' : '#FF7777', fontSize: 28, fontWeight: '900' }}>
                {dialog.type === 'success' ? '✓' : '!'}
              </Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 21, fontWeight: '900' }}>{dialog.title}</Text>
            <Text style={{ marginTop: 10, color: '#C9C9D0', fontSize: 14, lineHeight: 21 }}>{dialog.message}</Text>
            <Pressable
              style={{ alignItems: 'center', marginTop: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: dialog.type === 'success' ? '#FFC800' : '#3A3A3D' }}
              onPress={closeDialog}
            >
              <Text style={{ color: dialog.type === 'success' ? '#171719' : '#FFFFFF', fontSize: 15, fontWeight: '900' }}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={() => setCameraVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#111113' }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            onCameraReady={() => setCameraReady(true)}
          />
          <View style={{ position: 'absolute', right: 0, bottom: 0, left: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 28, backgroundColor: 'rgba(0, 0, 0, 0.55)' }}>
            <Pressable
              style={{ paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: '#3A3A3D' }}
              onPress={() => setCameraVisible(false)}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Cancel</Text>
            </Pressable>
            <Pressable
              style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#FFFFFF', borderRadius: 34, backgroundColor: '#FFC800' }}
              onPress={takeDamagePhoto}
              disabled={!cameraReady}
            >
              <Text style={{ color: '#171719', fontSize: 22 }}>📷</Text>
            </Pressable>
            <View style={{ width: 62 }} />
          </View>
        </View>
      </Modal>
      <View style={styles.titleBar}>
        <Pressable style={styles.titleBarBack} onPress={() => navigation.goBack()}>
          <Text style={styles.titleBarBackText}>‹</Text>
        </Pressable>
        <Text style={styles.titleBarText}>RTO Details</Text>
        <View style={styles.titleBarSpacer} />
      </View>
      <View style={styles.header}>
        {/* <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable> */}
        {/* <Text style={styles.title}>RTO Details</Text> */}
        <Text style={styles.subtitle}>{reasonTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shipmentCard}>
          <Text style={styles.cardLabel}>SHIPMENT</Text>
          <Text style={styles.shipmentId}>{shipmentId}</Text>
          <Text style={styles.shipmentMeta}>{customerName} · {deliveryArea} · {paymentMethod} ₹{amount.toFixed(2)}</Text>
        </View>

        {/* <Text style={styles.fieldLabel}>DELIVERY ATTEMPT COUNT</Text>
        <View style={styles.attemptRow}>
          {[1, 2, 3].map((value) => (
            <Pressable
              key={value}
              style={[styles.attemptButton, attempt === value && styles.attemptSelected]}
              onPress={() => setAttempt(value)}
            >
              <Text style={[styles.attemptText, attempt === value && styles.attemptTextSelected]}>
                {value === 1 ? '1st' : value === 2 ? '2nd' : '3rd'}
              </Text>
            </Pressable>
          ))}
        </View> */}

        <Text style={styles.fieldLabel}>ADDITIONAL NOTES</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe what happened..."
          placeholderTextColor="#77777F"
          multiline
          style={styles.notesInput}
        />

        <Pressable style={styles.proofCard} onPress={openCamera}>
          {capturedPhotoUris.length > 0 ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {capturedPhotoUris.map((photoUri) => (
                <Image key={photoUri} source={{ uri: photoUri }} style={{ width: 54, height: 54, borderRadius: 12 }} />
              ))}
            </View>
          ) : (
            <Text style={styles.cameraIcon}>📷</Text>
          )}
          <Text style={styles.proofTitle}>{proofUploaded ? `${capturedPhotoUris.length}/4 Damage Photos Added` : 'Upload Damage Proof Photos'}</Text>
          <Text style={styles.proofSubtitle}>{capturedPhotoUris.length >= 4 ? 'Maximum 4 photos added' : 'Take up to 4 photos of the damaged shipment'}</Text>
        </Pressable>

        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningText}>This will initiate an RTO. The shipment will be{ '\n' }returned to origin branch.</Text>
        </View>

        <Pressable style={styles.confirmButton} onPress={confirmRto} disabled={submitting}>
          <Text style={styles.confirmText}>{submitting ? 'Submitting...' : '↩ Return to branch'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
export default ShipmentDamagedScreen
