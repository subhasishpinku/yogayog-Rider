import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import navigationStrings from '../constants/navigationStrings';
import colors from './styles/colors';
import styles from './styles/styles';

const HomeScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.ring} />
      <Pressable
      style={styles.avatar}
      onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}>
      <Text style={styles.avatarText}>SK</Text>
    </Pressable>
        <Text style={styles.greeting}>Good morning 👋</Text>
        <Text style={styles.name}>Suresh Kumar</Text>
        <Text style={styles.vehicle}>🏍️ Bike · KA 01 AB 1234</Text>
      </View>

      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusTitle}>Status: <Text style={styles.online}>{isOnline ? 'Online' : 'Offline'}</Text></Text>
          <Text style={styles.statusSubtext}>You are receiving new orders</Text>
        </View>
        <Switch value={isOnline} onValueChange={setIsOnline} thumbColor={colors.white} trackColor={{ false: '#505055', true: colors.gold }} />
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCard}><Text style={styles.earnings}>₹847</Text><Text style={styles.metricLabel}>Today&apos;s Earnings</Text></View>
        <View style={styles.metricCard}><Text style={styles.deliveries}>6</Text><Text style={styles.metricLabel}>Deliveries Done</Text></View>
        <View style={styles.metricCard}><Text style={styles.metricValue}>⭐ 4.8</Text><Text style={styles.metricLabel}>Avg Rating</Text></View>
        <View style={styles.metricCard}><Text style={styles.metricValue}>42 km</Text><Text style={styles.metricLabel}>Distance Today</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Your Location</Text>
      <View style={styles.map}><View style={styles.locationPill}><Text style={styles.locationText}>📍 Jodhpur Park, Kolkata</Text></View></View>

      {isOnline ? (
        <>
          <View style={styles.orderHeading}><Text style={styles.sectionTitle}>Available Orders</Text><Text style={styles.nearby}>2 nearby</Text></View>
          <Pressable
            style={styles.orderCard}
            onPress={() => navigation.navigate(navigationStrings.ACCEPTREJECTORDER)}
          >
            <Text style={styles.orderMeta}>Order #1222000010</Text>
            <Text style={styles.orderTitle}>Local Delivery · Bike</Text>
            <Text style={styles.fare}>₹57.75</Text>
            <Text style={styles.fareLabel}>Est. fare</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.offlineCard}>
          <Text style={styles.sleepingIcon}>😴</Text>
          <Text style={styles.offlineTitle}>You are Offline</Text>
          <Text style={styles.offlineText}>Go online to receive new orders</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;



