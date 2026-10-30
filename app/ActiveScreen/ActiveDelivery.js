import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import styles from './styles/ActiveDeliverystyles';

const ActiveDelivery = ({ route }) => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(5);
  const orderId = route?.params?.orderId || '1222000010';
  const amount = Number(route?.params?.amount || 0);
  const id = route?.params?.id;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <View style={styles.checkBox}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Delivered!</Text>
        <Text style={styles.orderText}>Order #{orderId} completed successfully</Text>

        <View style={styles.earnedCard}>
          <Text style={styles.earnedLabel}>YOU EARNED</Text>
          <Text style={styles.earnedValue}>₹{amount.toFixed(2)}</Text>
          <Text style={styles.walletText}>Added to your wallet</Text>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingQuestion}>How was the delivery experience?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, star <= rating && styles.starSelected]}>★</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={styles.homeButton}
          onPress={() => navigation.navigate(navigationStrings.DASHBOARDSCREEN)}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ActiveDelivery;
