import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

import styles from './styles/styles';

const RTODetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [attempt, setAttempt] = useState(1);
  const [notes, setNotes] = useState('');
  const [proofUploaded, setProofUploaded] = useState(false);
  const reasonTitle = route.params?.reasonTitle || 'Reason A · Return to Origin';

  const confirmRto = () => {
    Alert.alert('RTO confirmed', 'The shipment has been marked for return to origin.', [
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
        <Text style={styles.title}>RTO Details</Text>
        <Text style={styles.subtitle}>{reasonTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shipmentCard}>
          <Text style={styles.cardLabel}>SHIPMENT</Text>
          <Text style={styles.shipmentId}>YCG-2025-00921</Text>
          <Text style={styles.shipmentMeta}>Priya Mehta · Kalighat · COD ₹250</Text>
        </View>

        <Text style={styles.fieldLabel}>DELIVERY ATTEMPT COUNT</Text>
        <View style={styles.attemptRow}>
          {[1, 2, 3].map((value) => (
            <Pressable
              key={value}
              style={[styles.attemptButton, attempt === value && styles.attemptSelected]}
              onPress={() => setAttempt(value)}
            >
              <Text style={[styles.attemptText, attempt === value && styles.attemptTextSelected]}>
                {value === 1 ? '1st' : value === 2 ? '2nd' : '3rd'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.proofCard} onPress={() => setProofUploaded(true)}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.proofTitle}>{proofUploaded ? 'Location Proof Added' : 'Upload Location Proof Photo'}</Text>
          <Text style={styles.proofSubtitle}>{proofUploaded ? 'Photo attached successfully' : 'Take photo of address / building'}</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>ADDITIONAL NOTES</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe what happened..."
          placeholderTextColor="#77777F"
          multiline
          style={styles.notesInput}
        />

        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningText}>This will initiate an RTO. The shipment will be{ '\n' }returned to origin branch.</Text>
        </View>

        <Pressable style={styles.confirmButton} onPress={confirmRto}>
          <Text style={styles.confirmText}>↩ Confirm RTO</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default RTODetails;
