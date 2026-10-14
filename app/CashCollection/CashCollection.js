import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const amountToCollect = 250;

const CashCollection = () => {
  const navigation = useNavigation();
  const [receivedAmount, setReceivedAmount] = useState('');
  const [hasSignature, setHasSignature] = useState(false);

  const changeToReturn = useMemo(() => {
    const received = Number(receivedAmount) || 0;
    return Math.max(received - amountToCollect, 0);
  }, [receivedAmount]);

const confirmCashReceived = () => {
  if (Number(receivedAmount) < amountToCollect || receivedAmount.trim() === '') {
    Alert.alert(
      'Amount incomplete',
      `Please enter at least ₹${amountToCollect}.`
    );
    return;
  }

  Alert.alert(
    'Cash received',
    'The cash payment has been recorded.',
    [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate(navigationStrings.COLLECTEDCASH);
        },
      },
    ],
    { cancelable: false }
  );
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
          <Text style={styles.subtitle}>Collect ₹250 from customer</Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>AMOUNT TO COLLECT</Text>
          <Text style={styles.amount}>₹250</Text>
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

        <Pressable style={styles.confirmButton} onPress={confirmCashReceived}>
          <Text style={styles.confirmText}>☑ Confirm Cash Received</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CashCollection;
