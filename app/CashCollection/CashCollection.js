import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';

const CashCollection = ({ route }) => {
  const navigation = useNavigation();
  const { collectRiderCod } = useHome();
  const orderId = route?.params?.orderId || 'Order';
  const internalOrderId = route?.params?.id;
  const amountToCollect = Number(route?.params?.amount || 250);
  const [receivedAmount, setReceivedAmount] = useState(amountToCollect.toFixed(2));
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const changeToReturn = useMemo(() => {
    const received = Number(receivedAmount) || 0;
    return Math.max(received - amountToCollect, 0);
  }, [amountToCollect, receivedAmount]);

const confirmCashReceived = async () => {
  if (Number(receivedAmount) < amountToCollect || receivedAmount.trim() === '') {
    Alert.alert(
      'Amount incomplete',
      `Please enter at least ₹${amountToCollect}.`
    );
    return;
  }

  if (!internalOrderId) {
    Alert.alert('Order ID missing', 'Unable to collect COD for this order.');
    return;
  }

  setSubmitting(true);
  try {
    const response = await collectRiderCod(internalOrderId);
    const collectedOrder = response?.order || {};
    const collectedParams = {
      orderId,
      id: internalOrderId,
      amount: Number(collectedOrder.original_price || amountToCollect),
      customerName: route?.params?.customerName,
      paymentMethod: collectedOrder.payment_method || 'COD',
      paymentStatus: collectedOrder.payment_status || 'Collected',
      order: collectedOrder,
      message: response?.message,
    };
    Alert.alert(
      'Cash received',
      'The cash payment has been recorded.',
      [{ text: 'OK', onPress: () => navigation.navigate(navigationStrings.COLLECTEDCASH, collectedParams) }],
      { cancelable: false }
    );
  } catch (error) {
    Alert.alert('Collection failed', error.message || 'Unable to collect COD.');
  } finally {
    setSubmitting(false);
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
          <Text style={styles.title}>Cash Collection</Text>
          <Text style={styles.subtitle}>Order #{orderId} · Collect from customer</Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>AMOUNT TO COLLECT</Text>
          <Text style={styles.amount}>₹{amountToCollect.toFixed(2)}</Text>
        </View>

        <Text style={styles.fieldLabel}>AMOUNT RECEIVED FROM CUSTOMER</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currency}>₹</Text>
          <TextInput
            accessibilityLabel="Amount received from customer"
            value={receivedAmount}
            onChangeText={setReceivedAmount}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#6D6D76"
            style={styles.amountInput}
          />
        </View>

        <Text style={styles.fieldLabel}>CHANGE TO RETURN</Text>
        <View style={styles.changeCard}>
          <Text style={styles.changeAmount}>₹{changeToReturn}</Text>
        </View>

        <Text style={styles.fieldLabel}>CUSTOMER SIGNATURE</Text>
        <Pressable style={styles.signatureBox} onPress={() => setHasSignature(true)}>
          <Text style={styles.signatureLabel}>CUSTOMER SIGNATURE</Text>
          <Text style={[styles.signaturePrompt, hasSignature && styles.signatureCaptured]}>
            {hasSignature ? '✓ Signature captured' : 'Touch here to sign'}
          </Text>
        </Pressable>

          <Pressable style={styles.confirmButton} onPress={confirmCashReceived} disabled={submitting}>
            <Text style={styles.confirmText}>{submitting ? 'Submitting...' : '☑ Confirm Cash Received'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CashCollection;
