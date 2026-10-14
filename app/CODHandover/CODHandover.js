import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';

const deliveries = [
  { awb: 'YCG-2025-00921', customer: 'Priya Mehta', mode: 'UPI', amount: '₹250' },
  { awb: 'YCG-2025-00917', customer: 'Mohan Roy', mode: 'Cash', amount: '₹1,100' },
  { awb: 'YCG-2025-00913', customer: 'Raju Ghosh', mode: 'UPI', amount: '₹500' },
  { awb: 'YCG-2025-00908', customer: 'Anita Bose', mode: 'Cash', amount: '₹750' },
  { awb: 'YCG-2025-00904', customer: 'Dev Sharma', mode: 'UPI', amount: '₹150' },
  { awb: 'YCG-2025-00899', customer: 'Rita Sen', mode: 'UPI', amount: '₹100' },
];

const CODHandover = () => {
  const navigation = useNavigation();
  const [staffName, setStaffName] = useState('');
  const [amount, setAmount] = useState('2850');
  const [signatureAdded, setSignatureAdded] = useState(false);

  const confirmHandover = () => {
    if (!staffName.trim()) {
      Alert.alert('Staff name required', 'Please enter the branch staff name.');
      return;
    }

    Alert.alert('Handover confirmed', `₹${amount} handed over to ${staffName}.`, [
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
          <Text style={styles.title}>COD Handover</Text>
          <Text style={styles.subtitle}>Hand over collected cash to branch</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL COD COLLECTED TODAY</Text>
          <Text style={styles.totalAmount}>₹2,850</Text>
          <Text style={styles.totalMeta}>6 deliveries · 4 UPI + 2 Cash</Text>
        </View>

        <Text style={styles.sectionTitle}>Collected Breakdown</Text>
        <View style={styles.deliveryList}>
          {deliveries.map((delivery) => (
            <View key={delivery.awb} style={styles.deliveryCard}>
              <View>
                <Text style={styles.deliveryAwb}>{delivery.awb}</Text>
                <Text style={styles.deliveryMeta}>{delivery.customer} · {delivery.mode}</Text>
              </View>
              <Text style={styles.deliveryAmount}>{delivery.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.handoverCard}>
          <Text style={styles.formTitle}>HANDOVER TO BRANCH STAFF</Text>
          <Text style={styles.fieldLabel}>STAFF NAME</Text>
          <TextInput
            value={staffName}
            onChangeText={setStaffName}
            placeholder="Branch staff receiving"
            placeholderTextColor="#77777F"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>AMOUNT HANDED OVER (₹)</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              style={styles.amountInput}
            />
          </View>

          <Pressable style={styles.signatureBox} onPress={() => setSignatureAdded(true)}>
            <Text style={styles.signatureIcon}>✍️</Text>
            <Text style={styles.signatureText}>{signatureAdded ? 'Branch Staff Signature Added' : 'Branch Staff Signature'}</Text>
          </Pressable>

          <Pressable style={styles.confirmButton} onPress={confirmHandover}>
            <Text style={styles.confirmText}>☑ Confirm Handover</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default CODHandover;
