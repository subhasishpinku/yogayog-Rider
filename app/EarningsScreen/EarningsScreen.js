import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings';

const periods = ['Today', 'Week', 'Month'];
const chartData = [
  { day: 'Mon', value: 0.34 },
  { day: 'Tue', value: 0.5 },
  { day: 'Wed', value: 0.28 },
  { day: 'Thu', value: 0.72 },
  { day: 'Fri', value: 0.42 },
  { day: 'Sat', value: 0.96 },
  { day: 'Sun', value: 0.58 },
];

const EarningsScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

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
          <View style={styles.headerRing} />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceValue}>₹12,450</Text>
          <Text style={styles.payoutText}>Last payout: Jul 28, 2026</Text>
          <Pressable
            style={styles.withdrawButton}
            onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
          >
            <Text style={styles.withdrawText}>Withdraw Earnings →</Text>
          </Pressable>
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
            <Text style={styles.metricValueGold}>₹847</Text>
            <Text style={styles.metricLabel}>Today&apos;s Earnings</Text>
          </View>
          <View style={[styles.metricCard, styles.metricCardGreen]}>
            <Text style={styles.metricValueGreen}>6</Text>
            <Text style={styles.metricLabel}>Deliveries</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>₹141</Text>
            <Text style={styles.metricLabel}>Avg per Delivery</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>42 km</Text>
            <Text style={styles.metricLabel}>Distance Covered</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>This Week</Text>

        <View style={styles.chartCard}>
          <View style={styles.chartArea}>
            {chartData.map((item) => (
              <View key={item.day} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: `${item.value * 100}%` }]} />
                </View>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EarningsScreen;



