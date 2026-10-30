import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import { useHome } from '../contexts/HomeContext';
import colors from './styles/colors';
import styles from './styles/styles';
import { startLiveLocation } from '../Services/LocationService';

const fallbackLocation = { latitude: 22.5186, longitude: 88.3477 };

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const HomeScreen = ({ navigation }) => {
  const riderMarkerRef = useRef(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [riderAddress, setRiderAddress] = useState('');
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const assignedBlinkOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const logoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    logoAnimation.start();

    return () => logoAnimation.stop();
  }, [logoScale]);

  const [isOnline, setIsOnline] = useState(true);
  const {
    fetchRiderProfile,
    riderProfile,
  } = useAuth();
  const {
    fetchRiderOrders,
    fetchRiderTodaysEarnings,
    riderOrders,
    todayEarnings,
    todayDelivered,
  } = useHome();

  useEffect(() => {
    fetchRiderProfile().catch(() => {});
  }, [fetchRiderProfile]);

  useEffect(() => {
    fetchRiderOrders().catch(() => {});
  }, [fetchRiderOrders]);

  useEffect(() => {
    fetchRiderTodaysEarnings().catch(() => {});
  }, [fetchRiderTodaysEarnings]);
  useEffect(() => {
    let subscription;
    let mounted = true;

    async function trackLocation() {
      try {
        const sub = await startLiveLocation((lat, lng) => {
          if (mounted) {
            setLatitude(lat);
            setLongitude(lng);
            console.log('Updated Location:', lat, lng);
          }
        });

        if (mounted) {
          subscription = sub;
        } else {
          sub.remove();
        }
      } catch (error) {
        console.log('Location error:', error);
      }
    }

    trackLocation();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);
  const riderName = riderProfile?.name || 'Suresh Kumar';
  const riderInitials = riderName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const vehicleDetails = [riderProfile?.veh_type, riderProfile?.veh_number]
    .filter(Boolean)
    .join(' · ');
  const riderLocation = latitude !== null && longitude !== null
    ? { latitude, longitude }
    : fallbackLocation;
  const hasAssignedOrder = riderOrders.some(
    (order) => String(order.status || '').toLowerCase() === 'assigned'
  );

  useEffect(() => {
    if (!hasAssignedOrder) {
      assignedBlinkOpacity.setValue(1);
      return undefined;
    }

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(assignedBlinkOpacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(assignedBlinkOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [assignedBlinkOpacity, hasAssignedOrder]);

  const loadRiderAddress = async () => {
    setIsAddressLoading(true);

    try {
      const results = await Location.reverseGeocodeAsync(riderLocation);
      const place = results[0];
      const address = place
        ? [place.name, place.street, place.district, place.city, place.region, place.postalCode]
          .filter(Boolean)
          .join(', ')
        : 'Address unavailable';

      setRiderAddress(address);
      console.log('Rider marker pressed. Fetching address...address:', address);
      setIsLocationModalVisible(true);

    } catch (error) {
      console.log('Address lookup error:', error);
      setRiderAddress('Address unavailable');
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleRiderMarkerPress = () => {
    riderMarkerRef.current?.showCallout();
    loadRiderAddress();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.ring} />
      <Pressable
      style={styles.avatar}
      onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}>
      <Text style={styles.avatarText}>{riderInitials || 'SK'}</Text>
    </Pressable>
        <Text style={styles.greeting}>{getTimeBasedGreeting()} 👋</Text>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{riderName}</Text>
          <Animated.Image
            source={require('../../assets/yogayoglogo1.png')}
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          <Pressable
            style={styles.walletButton}
            onPress={() => navigation.navigate(navigationStrings.CODHANDOVER)}
          >
            <Text style={styles.walletButtonText}>Wallet</Text>
          </Pressable>
        </View>
        <Text style={styles.vehicle}>🏍️ {vehicleDetails || 'Bike · KA 01 AB 1234'}</Text>
      </View>

      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusTitle}>Status: <Text style={styles.online}>{isOnline ? 'Online' : 'Offline'}</Text></Text>
          <Text style={styles.statusSubtext}>You are receiving new orders</Text>
        </View>
        <Switch value={isOnline} onValueChange={setIsOnline} thumbColor={colors.white} trackColor={{ false: '#505055', true: colors.gold }} />
      </View>

      <Text style={styles.sectionTitle}>Today&apos;s Working Details</Text>
      <View style={styles.metrics}>
        <View style={styles.metricCard}><Text style={styles.earnings}>₹{todayEarnings.toFixed(2)}</Text><Text style={styles.metricLabel}>Today&apos;s Earnings</Text></View>
        <View style={styles.metricCard}><Text style={styles.deliveries}>{todayDelivered}</Text><Text style={styles.metricLabel}>Deliveries Done</Text></View>
        {/* <View style={styles.metricCard}><Text style={styles.metricValue}>⭐ 4.8</Text><Text style={styles.metricLabel}>Avg Rating</Text></View> */}
        {/* <View style={styles.metricCard}><Text style={styles.metricValue}>42 km</Text><Text style={styles.metricLabel}>Distance Today</Text></View> */}
      </View>

      <Text style={styles.sectionTitle}>Your Location</Text>
      <View style={styles.map}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapFill}
          initialRegion={{ ...fallbackLocation, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
          showsUserLocation={latitude !== null && longitude !== null}
          showsMyLocationButton={false}
          showsCompass={false}
          toolbarEnabled={false}
        >
          <Marker
            ref={riderMarkerRef}
            coordinate={riderLocation}
            title="Live rider location"
            onPress={handleRiderMarkerPress}
          >
            <Callout>
              <View style={styles.locationCallout}>
                <Text style={styles.calloutTitle}>Live rider location</Text>
                <Text style={styles.calloutCoordinates}>
                  {riderLocation.latitude.toFixed(6)}, {riderLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.calloutAddress}>
                  {isAddressLoading ? 'Loading address...' : riderAddress || 'Tap marker to load address'}
                </Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <Pressable style={styles.locationPill} onPress={handleRiderMarkerPress}>
          <Text style={styles.locationText}>
            📍 {latitude !== null && longitude !== null ? 'Live rider location' : 'Jodhpur Park, Kolkata'}
          </Text>
        </Pressable>
      </View>

      {isOnline ? (
        <>
          <View style={styles.orderHeading}><Text style={styles.sectionTitle}>Available Orders</Text><Text style={styles.nearby}>{riderOrders.length} orders</Text></View>
          {riderOrders.length > 0 ? riderOrders.map((order) => {
            const isAssigned = String(order.status || '').toLowerCase() === 'assigned';
            const statusText = order.status ? order.status.replace(/_/g, ' ') : 'Order';
            const statusStyle = [
              styles.orderStatus,
              order.status === 'delivered' && styles.deliveredStatus,
              isAssigned && styles.assignedStatus,
            ];

            return (
            <Pressable
              key={order.id}
              style={styles.orderCard}
              onPress={() => {
                // if (String(order.status || '').toLowerCase() === 'assigned') {
                //   navigation.navigate(navigationStrings.ACCEPTREJECTORDER, { order });
                // }
                 navigation.navigate(navigationStrings.ACCEPTREJECTORDER, { order });
              }}
            > 
              <Text style={styles.orderMeta}>Order #{order.code} · {order.customer_name || 'Customer'}</Text>
              <Text style={styles.orderDetail}>📞 {order.customer_phone || 'Phone unavailable'}</Text>
              <Text style={styles.orderDetail}>Pickup: {order.pickup_area || 'Not available'}</Text>
              <Text style={styles.orderDetail}>Drop: {order.drop_area || 'Not available'}</Text>
              <Text style={styles.fare}>₹{Number(order.amount || 0).toFixed(2)}</Text>
              <Text style={styles.fareLabel}>{order.status || 'Order'}</Text>
              <Text style={styles.orderDate}>
                {order.created_at || ''}
                {order.status ? (isAssigned ? (
                  <Animated.Text style={[statusStyle, { opacity: assignedBlinkOpacity }]}>
                    {'  '}{statusText}
                  </Animated.Text>
                ) : (
                  <Text style={statusStyle}>{'  '}{statusText}</Text>
                )) : null}
              </Text>
            </Pressable>
            );
          }) : (
            <View style={styles.offlineCard}>
              <Text style={styles.offlineTitle}>No orders available</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.offlineCard}>
          <Text style={styles.sleepingIcon}>😴</Text>
          <Text style={styles.offlineTitle}>You are Offline</Text>
          <Text style={styles.offlineText}>Go online to receive new orders</Text>
        </View>
      )}

      <Modal
        visible={isLocationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLocationModalVisible(false)}
      >
        <View style={styles.locationModalBackdrop}>
          <View style={styles.locationModalCard}>
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalIcon}>📍</Text>
              <View>
                <Text style={styles.locationModalTitle}>Live rider location</Text>
                <Text style={styles.locationModalSubtitle}>Current GPS position</Text>
              </View>
            </View>

            <Text style={styles.locationModalLabel}>ADDRESS</Text>
            <Text style={styles.locationModalAddress}>{riderAddress || 'Address unavailable'}</Text>

            {/* <View style={styles.coordinatesRow}>
              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateLabel}>LATITUDE</Text>
                <Text style={styles.coordinateValue}>{riderLocation.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateLabel}>LONGITUDE</Text>
                <Text style={styles.coordinateValue}>{riderLocation.longitude.toFixed(6)}</Text>
              </View>
            </View> */}

            <Pressable
              style={styles.locationModalButton}
              onPress={() => setIsLocationModalVisible(false)}
            >
              <Text style={styles.locationModalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;



