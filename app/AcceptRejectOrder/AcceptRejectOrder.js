import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import { useHome } from '../contexts/HomeContext';
import styles from './styles/styles';

const pickup = {
  latitude: 22.5096,
  longitude: 88.3456,
};

const drop = {
  latitude: 22.5198,
  longitude: 88.3469,
};

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#12121d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#77777d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#12121d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#242433' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#181824' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c0c16' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const toCoordinate = (order, prefix, fallback) => {
  const location = order?.[`${prefix}_location`];
  const coordinates = order?.[`${prefix}_coordinates`];
  const latitude = Number(
    order?.[`${prefix}_latitude`] ??
      order?.[`${prefix}_lat`] ??
      location?.latitude ??
      coordinates?.latitude
  );
  const longitude = Number(
    order?.[`${prefix}_longitude`] ??
      order?.[`${prefix}_lng`] ??
      order?.[`${prefix}_long`] ??
      location?.longitude ??
      coordinates?.longitude
  );

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : fallback;
};

const getAddress = (order, prefix) =>
  order?.[`${prefix}_address`] ||
  order?.[`${prefix}_area`] ||
  order?.[`${prefix}_location_name`] ||
  'Address not available';

const AcceptRejectOrder = ({ route }) => {
  const navigation = useNavigation();
  const routeOrder = useMemo(() => route?.params?.order || {}, [route?.params?.order]);
  const [order, setOrder] = useState(routeOrder);
  const { acceptRiderOrder, fetchRiderTripDetails } = useHome();
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isFullMapVisible, setIsFullMapVisible] = useState(false);
  const [pickupPoint, setPickupPoint] = useState(() =>
    toCoordinate(order, 'pickup', pickup)
  );
  const [dropPoint, setDropPoint] = useState(() =>
    toCoordinate(order, 'drop', drop)
  );

  useEffect(() => {
    let isMounted = true;
    const orderId = routeOrder.id || routeOrder.order_pk_id;

    setOrder(routeOrder);

    if (!orderId) {
      return () => {
        isMounted = false;
      };
    }

    fetchRiderTripDetails(orderId)
      .then((tripDetails) => {
        if (isMounted && tripDetails) {
          setOrder(tripDetails);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [fetchRiderTripDetails, routeOrder]);

  const pickupAddress = getAddress(order, 'pickup');
  const dropAddress = getAddress(order, 'drop');
  const isAssigned = String(order.status || '').toLowerCase() === 'assigned';

  const handleAcceptOrder = async () => {
    if (isAccepting) return;

    setIsAccepting(true);
    try {
      await acceptRiderOrder(order.id || order.order_pk_id);
      navigation.goBack();
    } catch (error) {
      console.log('[AcceptRejectOrder] accept order error:', error);
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const resolveRoutePoints = async () => {
      const resolvedPickup = toCoordinate(order, 'pickup', null);
      const resolvedDrop = toCoordinate(order, 'drop', null);

      try {
        const [pickupResult, dropResult] = await Promise.all([
          resolvedPickup
            ? Promise.resolve([resolvedPickup])
            : Location.geocodeAsync(pickupAddress),
          resolvedDrop
            ? Promise.resolve([resolvedDrop])
            : Location.geocodeAsync(dropAddress),
        ]);

        if (!isMounted) return;

        const geocodedPickup = pickupResult[0];
        const geocodedDrop = dropResult[0];

        setPickupPoint(
          resolvedPickup ||
            (geocodedPickup
              ? { latitude: geocodedPickup.latitude, longitude: geocodedPickup.longitude }
              : pickup)
        );
        setDropPoint(
          resolvedDrop ||
            (geocodedDrop
              ? { latitude: geocodedDrop.latitude, longitude: geocodedDrop.longitude }
              : drop)
        );
      } catch (error) {
        console.log('[AcceptRejectOrder] route lookup error:', error);
      }
    };

    resolveRoutePoints();

    return () => {
      isMounted = false;
    };
  }, [order, pickupAddress, dropAddress]);

  const mapRegion = {
    latitude: (pickupPoint.latitude + dropPoint.latitude) / 2,
    longitude: (pickupPoint.longitude + dropPoint.longitude) / 2,
    latitudeDelta: Math.max(Math.abs(pickupPoint.latitude - dropPoint.latitude) * 2.2, 0.025),
    longitudeDelta: Math.max(Math.abs(pickupPoint.longitude - dropPoint.longitude) * 2.2, 0.025),
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapArea}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            region={mapRegion}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={false}
            showsTraffic={false}
          >
            <Polyline
              coordinates={[pickupPoint, dropPoint]}
              strokeColor="#FFC800"
              strokeWidth={4}
              lineDashPattern={[8, 6]}
            />
            <Marker coordinate={pickupPoint} title="Pickup" tracksViewChanges={false}>
              <View style={styles.mapMarkerPickup} />
            </Marker>
            <Marker coordinate={dropPoint} title="Drop" tracksViewChanges={false}>
              <View style={styles.mapMarkerDrop} />
            </Marker>
          </MapView>

          <Pressable style={styles.routePill} onPress={() => setIsFullMapVisible(true)}>
            <Text style={styles.routeText}>🛵 En route to pickup</Text>
            <View style={styles.routePillArrow} />
          </Pressable>
        </View>

        <View style={styles.orderSection}>
          <View style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View>
                <Text style={styles.orderMeta}>Order #{order.code || order.id || 'Order'}</Text>
                <Text style={styles.fare}>₹{Number(order.amount || 0).toFixed(2)} Est. Fare</Text>
              </View>
              <View style={styles.timer}>
                <Text style={styles.timerText}>{secondsLeft}s</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>●</Text>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>PICKUP · 0.8 KM AWAY</Text>
                <Text style={styles.locationAddress}>{pickupAddress}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={[styles.locationIcon, styles.dropIcon]}>●</Text>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>DROP · 7.2 KM TOTAL</Text>
                <Text style={styles.locationAddress}>{dropAddress}</Text>
              </View>
            </View>

            <View style={styles.orderTags}>
              <View style={[styles.tag, styles.goldTag]}><Text style={[styles.tagText, styles.goldTagText]}>📦 2 kg</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>COD</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>Local Bike</Text></View>
              <View style={[styles.tag, styles.greenTag]}><Text style={[styles.tagText, styles.greenTagText]}>{order.customer_name || 'Customer'}</Text></View>
            </View>
          </View>

          {isAssigned && (
            <>
              <View style={styles.actionRow}>
                <Pressable style={styles.rejectButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.rejectText}>✕ Reject</Text>
                </Pressable>
                <Pressable style={styles.acceptButton} onPress={handleAcceptOrder} disabled={isAccepting}>
                  <Text style={styles.acceptText}>{isAccepting ? 'Accepting...' : '✓ Accept'}</Text>
                </Pressable>
              </View>

              <View style={styles.progressTrack}><View style={styles.progress} /></View>
              <Text style={styles.autoReject}>Auto-reject in {secondsLeft} seconds</Text>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isFullMapVisible}
        animationType="slide"
        onRequestClose={() => setIsFullMapVisible(false)}
      >
        <View style={styles.fullMapScreen}>
          <MapView
            style={styles.fullMap}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            region={mapRegion}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={false}
            showsTraffic={false}
          >
            <Polyline
              coordinates={[pickupPoint, dropPoint]}
              strokeColor="#FFC800"
              strokeWidth={4}
              lineDashPattern={[8, 6]}
            />
            <Marker coordinate={pickupPoint} title="Pickup" tracksViewChanges={false}>
              <View style={styles.mapMarkerPickup} />
            </Marker>
            <Marker coordinate={dropPoint} title="Drop" tracksViewChanges={false}>
              <View style={styles.mapMarkerDrop} />
            </Marker>
          </MapView>

          <View style={styles.fullMapHeader}>
            <Text style={styles.fullMapTitle}>Route to pickup</Text>
            <Pressable
              style={styles.fullMapCloseButton}
              onPress={() => setIsFullMapVisible(false)}
            >
              <Text style={styles.fullMapCloseText}>✕ Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AcceptRejectOrder;
