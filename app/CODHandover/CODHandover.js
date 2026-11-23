import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import SignatureCanvas from 'react-native-signature-canvas';

import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import styles from './styles/styles';
import homeStyles from '../HomeScreen/styles/styles';
import { useHome } from '../contexts/HomeContext';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const CODHandover = () => {
  const navigation = useNavigation();
  const { riderProfile } = useAuth();
  const { fetchRiderWalletLedger, submitRiderCod } = useHome();
  const [transactions, setTransactions] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staffName, setStaffName] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [signatureAdded, setSignatureAdded] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isSignatureModalVisible, setIsSignatureModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signatureRef = useRef(null);
  const logoScale = useRef(new Animated.Value(1)).current;
  const handWave = useRef(new Animated.Value(0)).current;
  const riderName = riderProfile?.name || 'Suresh Kumar';
  const riderInitials = riderName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const handRotation = handWave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  useEffect(() => {
    const logoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    const handAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(handWave, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: -1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.delay(1200),
      ])
    );

    logoAnimation.start();
    handAnimation.start();

    return () => {
      logoAnimation.stop();
      handAnimation.stop();
    };
  }, [handWave, logoScale]);

  const loadLedger = useCallback(async () => {
    setLoading(true);
    setError('');
    setShowAllTransactions(false);
    try {
      setTransactions(await fetchRiderWalletLedger());
    } catch (requestError) {
      setError(requestError.message || 'Unable to load wallet transactions.');
    } finally {
      setLoading(false);
    }
  }, [fetchRiderWalletLedger]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const totalAmount = useMemo(
    () => transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0),
    [transactions]
  );

  useEffect(() => {
    setAmount(totalAmount.toFixed(2));
  }, [totalAmount]);

  const confirmHandover = async () => {
    if (!staffName.trim()) {
      Alert.alert('Staff name required', 'Please enter the branch staff name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitRiderCod();

      Alert.alert(
        'Handover confirmed',
        response.message || `₹${amount} handed over to ${staffName}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (requestError) {
      Alert.alert('Handover failed', requestError.message || 'Unable to submit COD records.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignatureOK = (signature) => {
    setSignatureData(signature);
    setSignatureAdded(true);
    setIsSignatureModalVisible(false);
  };

  const handleSignatureEmpty = () => {
    Alert.alert('Signature required', 'Please draw your signature before saving.');
  };

  const saveSignature = () => {
    signatureRef.current?.readSignature();
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
    setSignatureData(null);
    setSignatureAdded(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={homeStyles.header}>
        <View style={homeStyles.ring} />
        <View style={homeStyles.greetingRow}>
          <Animated.Image
            source={require('../../assets/yogayoglogo1.png')}
            style={[homeStyles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          {/* <Text style={homeStyles.greeting}>
            {getTimeBasedGreeting()}{' '}
            <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
              ✋︎
            </Animated.Text>
          </Text> */}
          {/* <Pressable
            style={homeStyles.walletButton}
            onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
          >
            <Text style={homeStyles.walletButtonText}>Wallet</Text>
          </Pressable> */}
          <Pressable
            style={[homeStyles.avatar, homeStyles.headerAvatar, { marginLeft: 'auto', alignSelf: 'flex-end' }]}
            onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
          >
            <Text style={homeStyles.avatarText}>{riderInitials || 'SK'}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <Pressable accessibilityLabel="Go back" hitSlop={8} style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable> */}
          {/* <Text style={styles.title}>COD Handover</Text> */}
          <Text style={styles.subtitle}>Hand over collected cash to branch</Text>
        </View>

        <View style={[styles.totalCard, { minHeight: 96, padding: 14 }]}>
          <Text style={styles.totalLabel}>TOTAL COD COLLECTED TODAY</Text>
          <Text style={[styles.totalAmount, { marginTop: 0, fontSize: 32, lineHeight: 38 }]}>₹{totalAmount.toFixed(2)}</Text>
          <Text style={styles.totalMeta}>{transactions.length} wallet transaction{transactions.length === 1 ? '' : 's'}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Collected Breakdown</Text>
          {transactions.length > 2 ? (
            <Pressable onPress={() => setShowAllTransactions((current) => !current)}>
              <Text style={{ marginTop: 16, marginBottom: 8, color: '#FFC800', fontSize: 13, fontWeight: '800' }}>
                {showAllTransactions ? 'Show less' : 'More'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {loading ? (
          <ActivityIndicator color="#FFC800" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadLedger}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>No wallet transactions found.</Text>
          </View>
        ) : (
          <View style={styles.deliveryList}>
            {transactions.slice(0, showAllTransactions ? transactions.length : 2).map((transaction) => (
                <View key={transaction.id} style={[styles.deliveryCard, { minHeight: 92, paddingVertical: 12 }]}>
                <View>
                    <Text style={styles.deliveryAwb}>{transaction.description || 'COD Transaction'}</Text>
                    <Text style={styles.deliveryMeta}>Transaction Type: {transaction.transaction_type || 'N/A'}</Text>
                    <Text style={styles.deliveryMeta}>Debited From: {transaction.debited_from_type || 'N/A'}</Text>
                    <Text style={styles.deliveryMeta}>Credited To: {transaction.credited_to_type || 'N/A'}</Text>
                </View>
                <Text style={styles.deliveryAmount}>₹{Number(transaction.amount || 0).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.handoverCard}>
          <Text style={styles.formTitle}>HANDOVER TO BRANCH STAFF</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>STAFF NAME</Text>
              <TextInput
                value={staffName}
                onChangeText={(value) => setStaffName(value.replace(/[^a-zA-Z\s]/g, ''))}
                placeholder="Branch staff receiving"
                placeholderTextColor="#77777F"
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>AMOUNT HANDED OVER (₹)</Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.currency}>₹</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="number-pad"
                  style={styles.amountInput}
                />
              </View>
            </View>
          </View>

          <Pressable style={styles.signatureBox} onPress={() => setIsSignatureModalVisible(true)}>
            {signatureData ? (
              <Image source={{ uri: signatureData }} style={styles.signaturePreview} resizeMode="contain" />
            ) : (
              <Text style={styles.signatureIcon}>✍️</Text>
            )}
            <Text style={styles.signatureText}>
              {signatureAdded ? 'Branch Staff Signature Added' : 'Tap to add Branch Staff Signature'}
            </Text>
          </Pressable>
          <View style={styles.actionRow}>
            {/* <Pressable
              style={[styles.confirmButton, styles.actionButton]}
              onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
            >
              <Text style={styles.actionText}>☑ Withdraw From Wallet</Text>
            </Pressable> */}
            <Pressable
              style={[styles.confirmButton, styles.actionButton]}
              onPress={confirmHandover}
              disabled={isSubmitting}
            >
              <Text style={styles.actionText}>☑ Confirm Handover</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          visible={isSignatureModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsSignatureModalVisible(false)}
        >
          <View style={styles.signatureModalBackdrop}>
            <View style={styles.signatureModalCard}>
              <Text style={styles.signatureModalTitle}>Branch Staff Signature</Text>
              <Text style={styles.signatureModalSubtitle}>Draw your signature below</Text>
              <View style={styles.signatureCanvasWrap}>
                <SignatureCanvas
                  ref={signatureRef}
                  onOK={handleSignatureOK}
                  onEmpty={handleSignatureEmpty}
                  onClear={() => {
                    setSignatureData(null);
                    setSignatureAdded(false);
                  }}
                  descriptionText="Sign here"
                  clearText="Clear"
                  confirmText="Save"
                  autoClear={false}
                  penColor="#111111"
                  backgroundColor="#FFFFFF"
                />
              </View>
              <View style={styles.signatureModalActions}>
                <Pressable
                  style={styles.signatureClearButton}
                  onPress={saveSignature}
                >
                  <Text style={styles.signatureClearText}>Save</Text>
                </Pressable>
                <Pressable style={styles.signatureClearButton} onPress={clearSignature}>
                  <Text style={styles.signatureClearText}>Clear</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default CODHandover;
