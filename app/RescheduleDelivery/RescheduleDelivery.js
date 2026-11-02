import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const formatDate = (date) => date.toISOString().split('T')[0];

const dates = Array.from({ length: 4 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);

  return {
    day: index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: String(date.getDate()),
    value: formatDate(date),
  };
});

const timeSlots = [
  { label: 'Morning · 9 AM – 12 PM', value: '09:00' },
  { label: 'Afternoon · 12 PM – 4 PM', value: '12:00' },
  { label: 'Evening · 4 PM – 7 PM', value: '16:00' },
];

const RescheduleDelivery = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rescheduleRiderOrder } = useHome();
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const confirmReschedule = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await rescheduleRiderOrder({
        orderId: route.params?.id || route.params?.orderId,
        requestedDeliveryDate: dates[selectedDate].value,
        requestedDeliveryTime: timeSlots[selectedSlot].value,
        reason: route.params?.reasonTitle || route.params?.reason || note.trim(),
      });

      console.log('[RescheduleDelivery] rider/reschedule-order API response:', response);

      Alert.alert('Delivery rescheduled', 'The customer delivery slot has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Unable to reschedule delivery', error.message || 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Reschedule Delivery</Text>
        <Text style={styles.subtitle}>Reason D · Customer wants different slot</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Select New Date</Text>
        <View style={styles.dateRow}>
          {dates.map((item, index) => {
            const selected = selectedDate === index;
            return (
              <Pressable
                key={item.date}
                style={[styles.dateCard, selected && styles.dateCardSelected]}
                onPress={() => setSelectedDate(index)}
              >
                <Text style={[styles.dateDay, selected && styles.selectedText]}>{item.day}</Text>
                <Text style={[styles.dateNumber, selected && styles.selectedText]}>{item.date}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Select Time Slot</Text>
        <View style={styles.slotList}>
          {timeSlots.map((slot, index) => {
            const selected = selectedSlot === index;
            return (
              <Pressable
                key={slot.value}
                style={[styles.slotCard, selected && styles.slotCardSelected]}
                onPress={() => setSelectedSlot(index)}
              >
                <Text style={[styles.slotText, selected && styles.selectedText]}>{slot.label}</Text>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>CUSTOMER&apos;S NOTE</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What did customer say?"
          placeholderTextColor="#77777F"
          style={styles.noteInput}
        />

        <Pressable style={styles.confirmButton} onPress={confirmReschedule} disabled={submitting}>
          <Text style={styles.confirmText}>{submitting ? 'Submitting...' : '🗓️ Confirm Reschedule'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default RescheduleDelivery;
