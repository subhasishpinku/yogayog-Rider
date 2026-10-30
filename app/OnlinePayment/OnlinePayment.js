import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useHome } from '../contexts/HomeContext';
import colors from './styles/colors';
import styles from './styles/styles';

const OnlinePayment = ({ route }) => {
  const navigation = useNavigation();
  const { fetchRiderOrderPaymentDetails } = useHome();
  const internalOrderId = route?.params?.id;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPaymentDetails = useCallback(async () => {
    if (!internalOrderId) {
      setError('Internal order ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const details = await fetchRiderOrderPaymentDetails(internalOrderId);
      setPaymentDetails(details);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load payment details.');
    } finally {
      setLoading(false);
    }
  }, [fetchRiderOrderPaymentDetails, internalOrderId]);

  useEffect(() => {
    loadPaymentDetails();
  }, [loadPaymentDetails]);

  const amount = Number(paymentDetails?.original_price || route?.params?.amount || 0);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>ONLINE PAYMENT</Text>
          <Text style={styles.title}>Payment Details</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.gold} style={styles.loading} />
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load payment details</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadPaymentDetails}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>PAYMENT AMOUNT</Text>
            <Text style={styles.amount}>₹{amount.toFixed(2)}</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{paymentDetails?.payment_status || 'Pending'}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Order information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{paymentDetails?.order_id || route?.params?.orderId || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment method</Text>
              <Text style={styles.detailValue}>{paymentDetails?.payment_method || 'N/A'}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Internal order ID</Text>
              <Text style={styles.detailValue}>{internalOrderId || 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OnlinePayment;
