import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';

const CallCustomers = ({ route }) => {
  const navigation = useNavigation();
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const customerName = route?.params?.customerName || 'Customer';
  const customerPhone = route?.params?.customerPhone || 'Phone unavailable';
  const orderId = route?.params?.orderId || 'Order';
  const dropArea = route?.params?.dropArea || 'Destination unavailable';
  const customerInitials = customerName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const phoneNumber = String(route?.params?.customerPhone || '').trim();
    if (!phoneNumber || !/\d/.test(phoneNumber)) return;

    const startCall = async () => {
      try {
        const phoneUri = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
        await Linking.openURL(phoneUri);
      } catch {
        Alert.alert('Unable to call', 'The phone app could not be opened.');
      }
    };

    startCall();
  }, [route?.params?.customerPhone]);

  const endCall = () => {
    Alert.alert('Call ended', `The call with ${customerName} has ended.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customerInitials || 'CU'}</Text>
          </View>
        </View>

        <Text style={styles.customerName}>{customerName}</Text>
        <Text style={styles.phoneNumber}>{customerPhone}</Text>
        <Text style={styles.callingText}>• Calling...</Text>
        <Text style={styles.orderMeta}>{orderId} · {dropArea}</Text>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyText}>🔒 Your number is masked for privacy.{ '\n' }Customer sees Yogayog&apos;s number.</Text>
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.controlItem}>
            <Pressable style={[styles.controlButton, muted && styles.controlButtonActive]} onPress={() => setMuted(!muted)}>
              <Text style={styles.controlIcon}>{muted ? '🔇' : '🔕'}</Text>
            </Pressable>
            <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
          </View>

          <View style={styles.controlItem}>
            <Pressable style={styles.endCallButton} onPress={endCall}>
              <Text style={styles.endCallIcon}>📱</Text>
            </Pressable>
            <Text style={styles.controlLabel}>End Call</Text>
          </View>

          <View style={styles.controlItem}>
            <Pressable style={[styles.controlButton, speakerOn && styles.controlButtonActive]} onPress={() => setSpeakerOn(!speakerOn)}>
              <Text style={styles.controlIcon}>🔊</Text>
            </Pressable>
            <Text style={styles.controlLabel}>{speakerOn ? 'Speaker On' : 'Speaker'}</Text>
          </View>
        </View>

        <Text style={styles.unreachableText}>Can&apos;t reach customer?</Text>
        <Pressable
          style={styles.nonDeliveryButton}
          onPress={() => navigation.navigate(navigationStrings.NONDELIVERYREPORT)}
        >
          <Text style={styles.nonDeliveryText}>Mark Non-Delivery</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CallCustomers;
