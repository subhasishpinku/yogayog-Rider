import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const reasons = [
  { id: 'rto', icon: '↩️', title: 'A · RTO – Return to Origin', subtitle: 'Send shipment back to sender', tone: 'blue' },
  { id: 'address', icon: '🗺️', title: 'B · Address Not Found', subtitle: 'Could not locate delivery address', tone: 'olive' },
  { id: 'refused', icon: '🧑‍🦱', title: 'C · Party Refused', subtitle: 'Receiver refused to accept shipment', tone: 'plum' , route: navigationStrings.RESCHEDULEDELIVERY},
  { id: 'reschedule', icon: '🗓️', title: 'D · Reschedule Delivery', subtitle: 'Customer wants different date / time', tone: 'olive' },
  { id: 'not-home', icon: '🏠', title: 'E · Customer Not at Home', subtitle: 'No one available at address', tone: 'blue' },
  { id: 'cod-refused', icon: '💸', title: 'F · Refused to Pay COD', subtitle: 'Customer refused COD payment', tone: 'red' },
  { id: 'damaged', icon: '⚠️', title: 'G · Shipment Damaged', subtitle: 'Package damaged, cannot deliver', tone: 'olive' },
  { id: 'branch', icon: '🏢', title: 'H · Returned to Branch', subtitle: 'Taken back to Yogayog branch', tone: 'purple' },
];

const NonDeliveryReport = () => {
  const navigation = useNavigation();
  const [selectedReason, setSelectedReason] = useState('rto');

  const continueWithReason = () => {
    const selected = reasons.find((reason) => reason.id === selectedReason);
    navigation.navigate(selected?.route || navigationStrings.RTODETAILS, {
      reason: selected?.id,
      reasonTitle: selected?.title,
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.headerBackground}>
        <View style={styles.headerOrb} />
        <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Non-Delivery Report</Text>
        <Text style={styles.orderMeta}>YCG-2025-00921 · Priya Mehta</Text>
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>Select the reason why this shipment could not be{ '\n' }delivered</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {reasons.map((reason) => {
          const isSelected = reason.id === selectedReason;

          return (
            <Pressable
              key={reason.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[styles.reasonCard, isSelected && styles.reasonCardSelected]}
              onPress={() => setSelectedReason(reason.id)}
            >
              <View style={[styles.reasonIcon, styles[`${reason.tone}Icon`]]}>
                <Text style={styles.reasonEmoji}>{reason.icon}</Text>
              </View>
              <View style={styles.reasonCopy}>
                <Text style={styles.reasonTitle}>{reason.title}</Text>
                <Text style={styles.reasonSubtitle}>{reason.subtitle}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}

        <Pressable style={styles.continueButton} onPress={continueWithReason}>
          <Text style={styles.continueText}>Continue with Selected Reason →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default NonDeliveryReport;
