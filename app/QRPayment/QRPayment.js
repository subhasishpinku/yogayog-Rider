import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';
import styles from './styles/sryles';

const QRPayment = ({ route }) => {
  const navigation = useNavigation();
  const { createRiderBillDeskPayment, riderProfile } = useHome();
  const orderId = route?.params?.orderId || 'Order';
  const amount = Number(route?.params?.amount || 0);
  const [paying, setPaying] = useState(false);

  const startBillDeskPayment = async () => {
    const orderMasterId = route?.params?.orderMasterId || route?.params?.id || orderId;

    try {
      setPaying(true);
      const storedUserValue = await AsyncStorage.getItem('authUser');
      const storedUser = storedUserValue ? JSON.parse(storedUserValue) : {};
      const userId = route?.params?.userId
        || riderProfile?.id
        || riderProfile?.user_id
        || riderProfile?.user?.id
        || storedUser.id
        || storedUser.user_id
        || storedUser.userId;

      console.log('BillDesk Payment Result:', orderMasterId, userId, amount);
      const result = await createRiderBillDeskPayment({ orderMasterId, userId, amount });
      navigation.navigate(navigationStrings.BILLDESKPAYMENT, {
        billdesk: result.data,
        orderId,
        amount,
      });
    } catch (error) {
      Alert.alert('Payment Error', error.message || 'Unable to create payment order.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>🔒 SECURE PAYMENT</Text>
          </View>
          <Text style={styles.title}>Collect payment</Text>
          <Text style={styles.subtitle}>Choose BillDesk UPI or collect cash from the customer.</Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.merchantName}>Yogayog Courier Pvt. Ltd.</Text>
          <Text style={styles.cardLabel}>AMOUNT TO COLLECT</Text>
          <Text style={styles.amount}>₹{amount.toFixed(2)}</Text>
          <View style={styles.orderInfo}>
            <View>
              <Text style={styles.infoLabel}>ORDER</Text>
              <Text style={styles.infoValue}>#{orderId}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoLabel}>CUSTOMER</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{route?.params?.customerName || 'Customer'}</Text>
            </View>
          </View>
          <Text style={styles.validity}>Payment is valid for this order only</Text>
        </View>

        <View style={styles.waitingCard}>
          <View style={styles.loadingRing}>
            <View style={styles.loadingArc} />
          </View>
          <Text style={styles.waitingTitle}>Ready to collect</Text>
          <Text style={styles.waitingSubtitle}>BillDesk opens securely to complete the UPI payment</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.cashButton}
            onPress={() => navigation.navigate(navigationStrings.CASHCOLLECTION, route?.params)}
          >
            <Text style={styles.cashButtonText}>Pay by Cash{ '\n' }instead</Text>
          </Pressable>
          <Pressable style={styles.doneButton} onPress={startBillDeskPayment} disabled={paying}>
            <Text style={styles.doneButtonText}>{paying ? 'Opening Payment...' : '✓ Pay with BillDesk'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRPayment;
