import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import colors from './styles/colors';
import styles from './styles/withdrawStyles';

const quickAmounts = ['₹500', '₹1,000', '₹5,000', 'All'];

const WithdrawEarnings = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('5000');

  const selectAmount = (value) => {
    setAmount(value === 'All' ? '12450' : value.replace(/[^0-9]/g, ''));
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.title}>Withdraw Earnings</Text>
        <Text style={styles.available}>Available: ₹12,450</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>WITHDRAWABLE BALANCE</Text>
          <Text style={styles.balanceValue}>₹12,450.00</Text>
        </View>

        <Text style={styles.fieldLabel}>ENTER WITHDRAWAL AMOUNT</Text>
        <View style={styles.amountInputWrap}>
          <Text style={styles.rupeeSymbol}>₹</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={colors.mutedLight}
            maxLength={6}
          />
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map((quickAmount) => {
            const normalized = quickAmount.replace(/[^0-9]/g, '');
            const isSelected = quickAmount === 'All'
              ? amount === '12450'
              : amount === normalized;

            return (
              <Pressable
                key={quickAmount}
                onPress={() => selectAmount(quickAmount)}
                style={[styles.quickAmount, isSelected && styles.quickAmountSelected]}
              >
                <Text style={[styles.quickAmountText, isSelected && styles.quickAmountTextSelected]}>
                  {quickAmount}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bankCard}>
          <View style={styles.bankIconWrap}>
            <Text style={styles.bankIcon}>🏦</Text>
          </View>
          <View style={styles.bankCopy}>
            <Text style={styles.bankName}>SBI Savings Account</Text>
            <Text style={styles.accountNumber}>•••• •••• •••• 4821</Text>
          </View>
          <Pressable>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>ⓘ Withdrawals processed within 24 hours on business days.</Text>
        </View>

        <Pressable style={styles.withdrawAction}>
          <Text style={styles.withdrawActionText}>Withdraw ₹{Number(amount || 0).toLocaleString('en-IN')} →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default WithdrawEarnings;
