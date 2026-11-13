import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const reasonPresentation = {
  A: { tone: 'blue' },
  B: { tone: 'olive' },
  C: { tone: 'plum', },
  D: { tone: 'olive' , route: navigationStrings.RESCHEDULEDELIVERY},
  E: { tone: 'blue' },
  F: { tone: 'red' },
  G: { tone: 'olive' },
  H: { tone: 'purple' },
};

const NonDeliveryReport = ({ route }) => {
  const navigation = useNavigation();
  const { fetchNonDeliveryReasons, nonDeliveryReasons } = useHome();
  const [selectedReason, setSelectedReason] = useState('A');
  const orderId = route?.params?.id || route?.params?.orderId;
  const orderCode = route?.params?.orderId || orderId || '1222000010';
  const customerName = route?.params?.customerName || 'Priya Mehta';

  useEffect(() => {
    fetchNonDeliveryReasons().catch(() => {
      Alert.alert('Unable to load reasons', 'Please try again later.');
    });
  }, [fetchNonDeliveryReasons]);

  const reasons = useMemo(() => {
    return nonDeliveryReasons.map((reason) => ({
      ...reason,
      id: reason.code,
      reasonId: reason.id,
      title: `${reason.code} · ${reason.title}`,
      subtitle: reason.description,
      tone: reasonPresentation[reason.code]?.tone || 'blue',
      route: reasonPresentation[reason.code]?.route,
    }));
  }, [nonDeliveryReasons]);

  useEffect(() => {
    console.log('[NonDeliveryReport] reasons shown on screen:', reasons);
  }, [reasons]);

  const continueWithReason = () => {
    const selected = reasons.find((reason) => reason.id === selectedReason);
    navigation.navigate(selected?.route || navigationStrings.RTODETAILS, {
      id: orderId,
      orderId: orderCode,
      amount: route?.params?.amount,
      customerName: route?.params?.customerName,
      dropArea: route?.params?.dropArea,
      paymentMethod: route?.params?.paymentMethod,
      pickupArea: route?.params?.pickupArea,
      reason: selected?.id,
      reasonId: selected?.reasonId,
      reasonTitle: selected?.title,
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
        <View style={styles.titleBar}>
        <Pressable style={styles.titleBarBack} onPress={() => navigation.goBack()}>
          <Text style={styles.titleBarBackText}>‹</Text>
        </Pressable>
        <Text style={styles.titleBarText}>Non-Delivery Report1</Text>
        <View style={styles.titleBarSpacer} />
      </View>
      <View style={styles.headerBackground}>
        <View style={styles.headerOrb} />
        {/* <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable> */}
        {/* <Text style={styles.title}>Non-Delivery Report</Text> */}
        <Text style={styles.orderMeta}>{orderCode} · {customerName}</Text>
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
