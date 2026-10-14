import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const paymentMethods = [
  {
    id: 'qr',
    route: navigationStrings.QRPAYMENT,
    icon: '📱',
    title: 'Scan & Pay (QR)',
    description: 'Customer scans your QR — GPay\nPhonePe, any UPI',
  },
  {
    id: 'cash',
    route: navigationStrings.CASHCOLLECTION,
    icon: '💵',
    title: 'Cash',
    description: 'Accept physical cash from\ncustomer',
  },
];

const CodAmountCollect = () => {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState('qr');

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            hitSlop={8}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Collect Payment</Text>
          <Text style={styles.orderMeta}>YCG-2025-00921 · Priya Mehta</Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>COD AMOUNT TO COLLECT</Text>
          <Text style={styles.amount}>₹250</Text>
          <Text style={styles.amountMeta}>From: Priya Mehta · Kalighat</Text>
        </View>

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        <View style={styles.methods}>
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;

            return (
              <Pressable
                key={method.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                onPress={() => {
                  setSelectedMethod(method.id);
                  navigation.navigate(method.route);
                }}
              >
                <View style={[styles.methodIcon, method.id === 'cash' && styles.cashIcon]}>
                  <Text style={styles.methodEmoji}>{method.icon}</Text>
                </View>
                <View style={styles.methodCopy}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            QR payment is instant and auto-confirmed. Cash requires manual entry and signature.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CodAmountCollect;
