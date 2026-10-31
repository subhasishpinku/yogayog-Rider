import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import colors from './styles/colors';
import navigationStrings from '../constants/navigationStrings';
import { useHome } from '../contexts/HomeContext';

const periods = ['Today', 'Week', 'Month', 'Year'];

const EarningsScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { fetchRiderEarnings, earningsByPeriod } = useHome();
  const periodKey = selectedPeriod.toLowerCase();
  const selectedEarnings = earningsByPeriod[periodKey];

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
  const chartLabels = selectedPeriod === 'Today'
    ? ['Today']
    : selectedPeriod === 'Week'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : selectedPeriod === 'Month'
        ? ['W1', 'W2', 'W3', 'W4', 'W5']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
        
          <View style={styles.headerCopy}>
            <Text style={styles.title}>My Earnings</Text>
            <Text style={styles.subtitle}>Suresh Kumar · 🛵 Bike</Text>
          </View>
          <Pressable
            style={styles.headerAction}
            onPress={() => navigation.navigate(navigationStrings.CODHANDOVER)}
          >
            <Text style={styles.headerActionText}>COD Handover</Text>
          </Pressable>
          <View style={styles.headerRing} />
        </View>

        <View style={styles.balanceCard}>
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
            {chartLabels.map((label) => (
              <View key={label} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: '100%', backgroundColor: chartBarColor }]} />
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



