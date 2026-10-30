import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const CollectedCash = ({ route }) => {
  const navigation = useNavigation();
  const order = route?.params?.order || {};
  const orderId = route?.params?.orderId || order?.ord_id || order?.id || 'Order';
  const amount = Number(order?.original_price || route?.params?.amount || 0);
  const paymentMethod = route?.params?.paymentMethod || order?.payment_method || 'COD';
  const paymentStatus = route?.params?.paymentStatus || order?.payment_status || 'Collected';
  const customerName = route?.params?.customerName || 'Customer';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.moneyBag}>💰</Text>
        </View>

        <Text style={styles.successTitle}>₹{amount.toFixed(2)} <Text style={styles.successTitleAccent}>Collected!</Text></Text>
        <Text style={styles.subtitle}>Payment received from {customerName}</Text>
        <Text style={styles.subtitle}>via {paymentMethod} · {paymentStatus}</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>AWB</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={[styles.detailValue, styles.greenValue]}>₹{amount.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>{paymentMethod} · {paymentStatus}</Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate(navigationStrings.ACTIVEDELIVERY, route?.params)}
        >
          <Text style={styles.primaryButtonText}>→ Mark Delivered</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate(navigationStrings.DASHBOARDSCREEN)}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CollectedCash;
