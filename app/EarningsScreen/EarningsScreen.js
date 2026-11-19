import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import colors from './styles/colors';
import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import { useHome } from '../contexts/HomeContext';

const periods = ['Today', 'Week', 'Month', 'Year'];

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const EarningsScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { fetchRiderEarnings, earningsByPeriod } = useHome();
  const { fetchRiderProfile, riderProfile } = useAuth();
  const logoScale = useRef(new Animated.Value(1)).current;
  const handWave = useRef(new Animated.Value(0)).current;
  const periodKey = selectedPeriod.toLowerCase();
  const selectedEarnings = earningsByPeriod[periodKey];
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

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage('');

    fetchRiderEarnings(periodKey)
      .catch((error) => {
        if (mounted) {
          setErrorMessage(error.response?.data?.message || 'Unable to load earnings.');
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [fetchRiderEarnings, periodKey]);

  const totalEarnings = selectedEarnings?.total_earnings || 0;
  const totalOrders = selectedEarnings?.total_orders || 0;
  const totalCodAmount = selectedEarnings?.total_cod_amount || 0;
  const averageEarnings = totalOrders ? totalEarnings / totalOrders : 0;
  const chartBarColor = totalEarnings > 0 ? colors.gold : '#000000';
  const chartLabels = useMemo(() => (
    selectedPeriod === 'Today'
      ? ['Today']
      : selectedPeriod === 'Week'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : selectedPeriod === 'Month'
          ? ['W1', 'W2', 'W3', 'W4', 'W5']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  ), [selectedPeriod]);
  const barAnimations = useMemo(
    () => chartLabels.map(() => new Animated.Value(0)),
    [chartLabels]
  );

  useEffect(() => {
    const animation = Animated.stagger(
      80,
      barAnimations.map((barAnimation) =>
        Animated.timing(barAnimation, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [barAnimations]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.ring} />
          <View style={styles.greetingRow}>
            <Animated.Image
              source={require('../../assets/yogayoglogo1.png')}
              style={[styles.logo, { transform: [{ scale: logoScale }] }]}
              resizeMode="contain"
            />
            <Text style={styles.greeting}>
              {getTimeBasedGreeting()}{' '}
              <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
                ✋︎
              </Animated.Text>
            </Text>
            <Pressable
              style={styles.walletButton}
              onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
            >
              <Text style={styles.walletButtonText}>Wallet</Text>
            </Pressable>
            <Pressable
              style={[styles.avatar, styles.headerAvatar]}
              onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
            >
              <Text style={styles.avatarText}>{riderInitials || 'SK'}</Text>
            </Pressable>
          </View>
          {/* <View style={styles.nameRow}>
            <Text style={styles.name}>{riderName}</Text>
          </View> */}
          {/* <Text style={styles.vehicle}>🏍️ {vehicleDetails || 'Bike · KA 01 AB 1234'}</Text> */}
          
      
          
        </View>

        <View style={styles.balanceCard}>
          <Pressable
            style={[styles.headerAction, styles.balanceCardAction]}
            onPress={() => navigation.navigate(navigationStrings.CODLEDGERSCREEN)}
          >
            <Text style={styles.headerActionText}>COD LEDGER</Text>
          </Pressable>
          <Text style={styles.balanceLabel}>{selectedPeriod.toUpperCase()} EARNINGS</Text>
          <Text style={styles.balanceValue}>₹{totalEarnings.toFixed(2)}</Text>
          <Text style={styles.payoutText}>
            {selectedEarnings?.start_date || '—'} to {selectedEarnings?.end_date || '—'}
          </Text>
         
        </View>

        <View style={styles.periodTabs}>
          {periods.map((period) => {
            const isSelected = selectedPeriod === period;

            return (
              <Pressable
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={[styles.periodTab, isSelected && styles.periodTabActive]}
              >
                <Text style={[styles.periodText, isSelected && styles.periodTextActive]}>
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.metricCardGold]}>
            <Text style={styles.metricValueGold}>₹{totalEarnings.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>{selectedPeriod} Earnings</Text>
          </View>
          <View style={[styles.metricCard, styles.metricCardGreen]}>
            <Text style={styles.metricValueGreen}>{totalOrders}</Text>
            <Text style={styles.metricLabel}>Deliveries</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>₹{averageEarnings.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Avg per Delivery</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>₹{totalCodAmount.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>COD Collected</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{selectedPeriod} Chart</Text>

        <View style={styles.chartCard}>
          {isLoading ? <Text style={styles.payoutText}>Loading earnings...</Text> : null}
          {errorMessage ? <Text style={styles.payoutText}>{errorMessage}</Text> : null}
          <View style={styles.chartArea}>
            {chartLabels.map((label, index) => (
              <View key={label} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        height: '100%',
                        backgroundColor: chartBarColor,
                        transform: [{ scaleY: barAnimations[index] }],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EarningsScreen;



