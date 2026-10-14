import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/sryles';

const QRPayment = () => {
  const navigation = useNavigation();

  const markPaymentDone = () => {
    Alert.alert('Payment complete', 'The COD payment has been marked as collected.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>QR Payment</Text>
          <Text style={styles.subtitle}>Show this to customer to scan</Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.merchantName}>Yogayog Courier Pvt. Ltd.</Text>
          <View style={styles.qrFrame}>
            <View style={styles.qrPlaceholder} />
          </View>
          <Text style={styles.amount}>₹250.00</Text>
          <Text style={styles.awb}>AWB: YCG-2025-00921</Text>
          <View style={styles.upiRow}>
            {['GPay', 'PhonePe', 'Paytm', 'Any UPI'].map((label) => (
              <View key={label} style={styles.upiBadge}>
                <Text style={styles.upiText}>{label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.upiId}>UPI ID: yogayog.kol01@sbi</Text>
          <Text style={styles.validity}>Valid for this order only</Text>
        </View>

        <View style={styles.waitingCard}>
          <View style={styles.loadingRing}>
            <View style={styles.loadingArc} />
          </View>
          <Text style={styles.waitingTitle}>Waiting for Payment...</Text>
          <Text style={styles.waitingSubtitle}>Auto-confirms when customer pays</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.cashButton}
            onPress={() => navigation.navigate(navigationStrings.CASHCOLLECTION)}
          >
            <Text style={styles.cashButtonText}>Pay by Cash{ '\n' }instead</Text>
          </Pressable>
          <Pressable style={styles.doneButton} onPress={markPaymentDone}>
            <Text style={styles.doneButtonText}>✓ Payment Done</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRPayment;
