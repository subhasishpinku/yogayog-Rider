import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/styles';

const dates = [
  { day: 'Today', date: '31' },
  { day: 'Thu', date: '1' },
  { day: 'Fri', date: '2' },
  { day: 'Sat', date: '3' },
];

const timeSlots = [
  'Morning · 9 AM – 12 PM',
  'Afternoon · 12 PM – 4 PM',
  'Evening · 4 PM – 7 PM',
];

const RescheduleDelivery = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [note, setNote] = useState('');

  const confirmReschedule = () => {
    Alert.alert('Delivery rescheduled', 'The customer delivery slot has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
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
                key={slot}
                style={[styles.slotCard, selected && styles.slotCardSelected]}
                onPress={() => setSelectedSlot(index)}
              >
                <Text style={[styles.slotText, selected && styles.selectedText]}>{slot}</Text>
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

        <Pressable style={styles.confirmButton} onPress={confirmReschedule}>
          <Text style={styles.confirmText}>🗓️ Confirm Reschedule</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default RescheduleDelivery;
