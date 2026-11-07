import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const RTODetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cancelRiderDelivery } = useHome();
  const [attempt, setAttempt] = useState(1);
  const [notes, setNotes] = useState('');
  const [proofUploaded, setProofUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const reasonTitle = route.params?.reasonTitle || 'Reason A · Return to Origin';
  const shipmentId = route.params?.orderId || route.params?.id || 'Shipment';
  const customerName = route.params?.customerName || 'Customer';
  const deliveryArea = route.params?.dropArea || route.params?.pickupArea || 'Address unavailable';
  const paymentMethod = route.params?.paymentMethod || 'Payment';
  const amount = Number(route.params?.amount || 0);

  const confirmRto = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await cancelRiderDelivery({
        orderId: route.params?.id || route.params?.orderId,
        reasonId: route.params?.reasonId,
        remarks: notes.trim(),
      });

      console.log('[RTODetails] rider/cancel-deliver API response:', response);

      Alert.alert('RTO confirmed', 'The shipment has been marked for return to origin.', [
        { text: 'OK', onPress: () => navigation.navigate(navigationStrings.DASHBOARDSCREEN) },
      ]);
    } catch (error) {
      Alert.alert('Unable to submit RTO', error.message || 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
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
          <Text style={styles.confirmText}>{submitting ? 'Submitting...' : '↩ Confirm RTO'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default RTODetails;
