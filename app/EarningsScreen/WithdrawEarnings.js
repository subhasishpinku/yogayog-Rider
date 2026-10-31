import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import { useHome } from '../contexts/HomeContext';
import navigationStrings from '../constants/navigationStrings';

const WithdrawEarnings = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('0');
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState('');
  const { fetchRiderWalletBalance, makeRiderWithdrawalRequest, walletBalance } = useHome();
  const availableBalance = Number(walletBalance || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allAmount = Math.max(availableBalance - 2, 0);
  const quickAmounts = [
    { label: `₹${(availableBalance / 2).toFixed(2)}`, value: availableBalance / 2 },
    { label: `₹${(availableBalance / 3).toFixed(2)}`, value: availableBalance / 3 },
    { label: `₹${(availableBalance / 4).toFixed(2)}`, value: availableBalance / 4 },
    { label: `All ₹${allAmount.toFixed(2)}`, value: allAmount },
  ];

  useEffect(() => {
    let mounted = true;
    setIsBalanceLoading(true);
    setBalanceError('');

    fetchRiderWalletBalance().catch((error) => {
      if (mounted) {
        setBalanceError(error.response?.data?.message || 'Unable to load wallet balance.');
      }
    }).finally(() => {
      if (mounted) {
        setIsBalanceLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [fetchRiderWalletBalance]);

  const selectAmount = (value) => {
    setAmount(value.toFixed(2));
  };

  const handleWithdraw = async () => {
    const withdrawalAmount = Number(amount);

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawalAmount > availableBalance) {
      Alert.alert('Insufficient balance', 'Withdrawal amount cannot exceed your wallet balance.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await makeRiderWithdrawalRequest(withdrawalAmount);
      Alert.alert(
        'Withdrawal requested',
        response.message || `Withdrawal request for ₹${withdrawalAmount.toFixed(2)} submitted successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(navigationStrings.DASHBOARDSCREEN),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Withdrawal failed',
        error.response?.data?.message || error.message || 'Unable to submit withdrawal request.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={styles.available}>
          {balanceError || `Available: ₹${availableBalance.toFixed(2)}`}
        </Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>WITHDRAWABLE BALANCE</Text>
          <Text style={styles.balanceValue}>
            {isBalanceLoading ? 'Loading...' : `₹${availableBalance.toFixed(2)}`}
          </Text>
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
          {quickAmounts.map((quickAmount, index) => {
            const isSelected = amount === quickAmount.value.toFixed(2);

            return (
              <Pressable
                key={`${quickAmount.label}-${index}`}
                onPress={() => selectAmount(quickAmount.value)}
                style={[styles.quickAmount, isSelected && styles.quickAmountSelected]}
              >
                <Text style={[styles.quickAmountText, isSelected && styles.quickAmountTextSelected]}>
                  {quickAmount.label}
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

        <Pressable style={styles.withdrawAction} onPress={handleWithdraw} disabled={isSubmitting}>
          <Text style={styles.withdrawActionText}>
            {isSubmitting ? 'Submitting...' : `Withdraw ₹${Number(amount || 0).toLocaleString('en-IN')} →`}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default WithdrawEarnings;
