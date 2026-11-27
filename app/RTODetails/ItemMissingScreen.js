import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHome } from '../contexts/HomeContext';
import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const  ItemMissingScreen =() => {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const deviceWidth = windowWidth || Dimensions.get('window').width;
  const isCompactWidth = deviceWidth <= 360;
  const responsiveContentStyle = { paddingHorizontal: isCompactWidth ? 6 : 10 };
  const route = useRoute();
  console.log('ItemMissingScreen route.params:', route.params);
  const { markItemMissing } = useHome();
  const [attempt, setAttempt] = useState(1);
  const [missingPieces, setMissingPieces] = useState('');
  const [notes, setNotes] = useState('');
  const [proofUploaded, setProofUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'error' });
  const reasonTitle = route.params?.reasonTitle || 'Reason A · Return to Origin';
  const shipmentId = route.params?.orderId || route.params?.id || 'Shipment';
  const orderId = route.params?.id || route.params?.orderId;
  const customerName = route.params?.customerName || 'Customer';
  const pickupAddress = route.params?.pickupAddress || route.params?.pickupArea || 'Pickup address unavailable';
  const dropAddress = route.params?.dropAddress || route.params?.dropArea || 'Drop address unavailable';
  const deliveryArea = dropAddress || pickupAddress;
  const paymentMethod = route.params?.paymentMethod || 'Payment';
  const amount = Number(route.params?.amount || 0);

  const confirmRto = async () => {
    if (submitting) return;

    const missingPiecesCount = Number(missingPieces.trim());

    if (!missingPieces.trim() || !Number.isInteger(missingPiecesCount) || missingPiecesCount <= 0) {
      setDialog({
        visible: true,
        title: 'Missing pieces required',
        message: 'Please enter a valid whole number greater than 0.',
        type: 'error',
      });
      return;
    }

    if (!notes.trim()) {
      setDialog({
        visible: true,
        title: 'Additional notes required',
        message: 'Please describe what happened before returning to branch.',
        type: 'error',
      });
      return;
    }

    if (!orderId) {
      setDialog({
        visible: true,
        title: 'Order ID missing',
        message: 'Unable to submit the missing item report for this shipment.',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);

    try {
      await markItemMissing({
        orderId,
        piece: missingPiecesCount,
        notes: notes.trim(),
      });

      setDialog({
        visible: true,
        title: 'Report submitted',
        message: `${missingPiecesCount} missing piece${missingPiecesCount === 1 ? '' : 's'} recorded successfully.`,
        type: 'success',
      });
    } catch (error) {
      setDialog({
        visible: true,
        title: 'Unable to submit report',
        message: error?.response?.data?.message || error?.message || 'Please try again later.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeDialog = () => {
    const shouldGoToDashboard = dialog.type === 'success';
    setDialog((currentDialog) => ({ ...currentDialog, visible: false }));

    if (shouldGoToDashboard) {
      navigation.navigate(navigationStrings.DASHBOARDSCREEN);
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.72)' }}>
          <View style={{ width: '100%', padding: 22, borderWidth: 1, borderColor: dialog.type === 'success' ? '#FFC800' : '#D94B4B', borderRadius: 20, backgroundColor: '#242426' }}>
            <Text style={{ color: dialog.type === 'success' ? '#FFC800' : '#FF7777', fontSize: 20, fontWeight: '900' }}>
              {dialog.type === 'success' ? '✓ ' : '⚠ '}{dialog.title}
            </Text>
            <Text style={{ marginTop: 10, color: '#FFFFFF', fontSize: 14, lineHeight: 21 }}>
              {dialog.message}
            </Text>
            <Pressable
              style={{ alignItems: 'center', marginTop: 20, paddingVertical: 13, borderRadius: 12, backgroundColor: dialog.type === 'success' ? '#FFC800' : '#3A3A3D' }}
              onPress={closeDialog}
            >
              <Text style={{ color: dialog.type === 'success' ? '#171719' : '#FFFFFF', fontSize: 14, fontWeight: '900' }}>OK</Text>
            </Pressable>
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

      <ScrollView contentContainerStyle={[styles.content, responsiveContentStyle]} showsVerticalScrollIndicator={false}>
        <View style={styles.shipmentCard}>
          <Text style={styles.cardLabel}>SHIPMENT</Text>
          <Text style={styles.shipmentId}>{shipmentId}</Text>
          <Text style={styles.shipmentMeta}>{customerName} · {deliveryArea} · {paymentMethod} ₹{amount.toFixed(2)}</Text>
        </View>

        <View style={styles.shipmentCard}>
          <Text style={styles.cardLabel}>PICKUP ADDRESS</Text>
          <Text style={styles.shipmentMeta}>{pickupAddress}</Text>
          <Text style={[styles.cardLabel, { marginTop: 12 }]}>DROP ADDRESS</Text>
          <Text style={styles.shipmentMeta}>{dropAddress}</Text>
        </View>

        <Text style={styles.fieldLabel}>DELIVERY ATTEMPT COUNT</Text>
        {/* <View style={styles.attemptRow}>
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

        {/* <Pressable style={styles.proofCard} onPress={() => setProofUploaded(true)}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.proofTitle}>{proofUploaded ? 'Location Proof Added' : 'Upload Location Proof Photo'}</Text>
          <Text style={styles.proofSubtitle}>{proofUploaded ? 'Photo attached successfully' : 'Take photo of address / building'}</Text>
        </Pressable> */}

        <Text style={styles.fieldLabel}>MISSING PIECES</Text>
        <TextInput
          value={missingPieces}
          onChangeText={setMissingPieces}
          placeholder="Enter number of missing pieces"
          placeholderTextColor="#77777F"
          keyboardType="number-pad"
          style={styles.notesInput}
        />

        <Text style={styles.fieldLabel}>ADDITIONAL NOTES</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe what happened..."
          placeholderTextColor="#77777F"
          multiline
          style={styles.notesInput}
        />

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

export default ItemMissingScreen
