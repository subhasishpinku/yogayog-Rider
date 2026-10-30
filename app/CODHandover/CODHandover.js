import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';
import { useHome } from '../contexts/HomeContext';

const CODHandover = () => {
  const navigation = useNavigation();
  const { fetchRiderWalletLedger } = useHome();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staffName, setStaffName] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [signatureAdded, setSignatureAdded] = useState(false);

  const loadLedger = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTransactions(await fetchRiderWalletLedger());
    } catch (requestError) {
      setError(requestError.message || 'Unable to load wallet transactions.');
    } finally {
      setLoading(false);
    }
  }, [fetchRiderWalletLedger]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const totalAmount = useMemo(
    () => transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0),
    [transactions]
  );

  useEffect(() => {
    setAmount(totalAmount.toFixed(2));
  }, [totalAmount]);

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
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
          <Text style={styles.totalMeta}>{transactions.length} wallet transaction{transactions.length === 1 ? '' : 's'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Collected Breakdown</Text>
        {loading ? (
          <ActivityIndicator color="#FFC800" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadLedger}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>No wallet transactions found.</Text>
          </View>
        ) : (
          <View style={styles.deliveryList}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.deliveryCard}>
                <View>
                  <Text style={styles.deliveryAwb}>Order #{transaction.order_no || transaction.order_id || 'N/A'}</Text>
                  <Text style={styles.deliveryMeta}>{transaction.counter_party_name || 'Unknown'} · {transaction.payment_mode || 'Wallet'}</Text>
                </View>
                <Text style={styles.deliveryAmount}>₹{Number(transaction.amount || 0).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

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
