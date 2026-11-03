import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

import styles from './styles/styles';
import colors from './styles/colors';
import {
  BACKGROUND_LOCATION_HISTORY_KEY,
  LAST_BACKGROUND_LOCATION_KEY,
} from '../Services/BackgroundLocation';

const fallbackLocation = { latitude: 22.5186, longitude: 88.3477 };
const fallbackPickup = { latitude: 22.5096, longitude: 88.3456 };
const fallbackDestination = { latitude: 22.5257, longitude: 88.3420 };

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

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: colors.mapSurface }] },
  { elementType: 'labels.text.fill', stylers: [{ color: colors.mapLabel }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: colors.mapSurface }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: colors.mapBoundary }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: colors.mapRoad }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: colors.mapRoadOutline }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: colors.mapRoadLabel }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: colors.mapWater }] },
];

const describeError = (error) => ({
  name: error?.name,
  message: error?.message || String(error),
  code: error?.code,
});

const LiveLocationMap = ({ route }) => {
  const mapRef = useRef(null);
  const order = useMemo(() => route?.params?.order || {}, [route?.params?.order]);
  const [pickupPoint, setPickupPoint] = useState(() => toCoordinate(order, 'pickup', fallbackPickup));
  const [destination, setDestination] = useState(() => toCoordinate(order, 'drop', fallbackDestination));
  const [riderLocation, setRiderLocation] = useState(fallbackLocation);
  const [riderPath, setRiderPath] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    setPickupPoint(toCoordinate(order, 'pickup', fallbackPickup));
    setDestination(toCoordinate(order, 'drop', fallbackDestination));
  }, [order]);

  const recordLocation = useCallback((coordinate) => {
    setRiderLocation(coordinate);
    setRiderPath((previousPath) => {
      const lastPoint = previousPath[previousPath.length - 1];
      if (lastPoint && lastPoint.latitude === coordinate.latitude && lastPoint.longitude === coordinate.longitude) {
        return previousPath;
      }

      return [...previousPath, coordinate].slice(-200);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncBackgroundLocation = async () => {
      try {
        const [historyValue, latestValue] = await Promise.all([
          AsyncStorage.getItem(BACKGROUND_LOCATION_HISTORY_KEY),
          AsyncStorage.getItem(LAST_BACKGROUND_LOCATION_KEY),
        ]);
        const storedHistory = historyValue ? JSON.parse(historyValue) : [];
        const history = Array.isArray(storedHistory)
          ? storedHistory.filter((point) => Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude))
          : [];
        const latest = latestValue ? JSON.parse(latestValue) : history[history.length - 1];

        if (!isMounted || !latest) return;

        setRiderPath(history.length ? history : [latest]);
        setRiderLocation({ latitude: latest.latitude, longitude: latest.longitude });
      } catch (error) {
        console.warn('[LiveLocationMap] Background location sync failed:', error.message);
      }
    };

    syncBackgroundLocation();
    const interval = setInterval(syncBackgroundLocation, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const fitRoute = (riderPoint = riderLocation) => {
    mapRef.current?.fitToCoordinates([riderPoint, pickupPoint, destination], {
      edgePadding: { top: 130, right: 45, bottom: 280, left: 45 },
      animated: true,
    });
  };

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      console.log('[LiveLocationMap] Requesting foreground location permission');
      const permission = await Location.requestForegroundPermissionsAsync();
      console.log('[LiveLocationMap] Permission result:', {
        status: permission.status,
        canAskAgain: permission.canAskAgain,
      });

      if (permission.status !== 'granted') {
        console.warn('[LiveLocationMap] Location permission was not granted');
        return;
      }

      setHasLocationPermission(true);
      console.log('[LiveLocationMap] Reading current position');
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const currentCoordinate = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      console.log('[LiveLocationMap] Current position:', currentCoordinate);
      recordLocation(currentCoordinate);
      mapRef.current?.animateToRegion({ ...currentCoordinate, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 500);

      console.log('[LiveLocationMap] Starting location watch');
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
        (location) => {
          const nextCoordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          console.log('[LiveLocationMap] Location update:', nextCoordinate);
          recordLocation(nextCoordinate);
        },
      );
      console.log('[LiveLocationMap] Location watch started');
    };

    startLocationTracking().catch((error) => {
      console.error('[LiveLocationMap] Location tracking failed:', describeError(error));
    });
    return () => {
      console.log('[LiveLocationMap] Cleaning up location watch');
      locationSubscription?.remove();
    };
  }, [recordLocation]);

  const navigateToCustomer = () => fitRoute();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        customMapStyle={darkMapStyle}
        style={styles.map}
        initialRegion={{
          latitude: (pickupPoint.latitude + destination.latitude) / 2,
          longitude: (pickupPoint.longitude + destination.longitude) / 2,
          latitudeDelta: Math.max(Math.abs(pickupPoint.latitude - destination.latitude) * 2.4, 0.025),
          longitudeDelta: Math.max(Math.abs(pickupPoint.longitude - destination.longitude) * 2.4, 0.025),
        }}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        onMapReady={() => {
          console.log('[LiveLocationMap] Google Map is ready');
          fitRoute();
        }}
        onMapLoaded={() => console.log('[LiveLocationMap] Google Map tiles loaded')}
      >
        <Marker coordinate={riderLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerRider}>
            <Text style={styles.riderEmoji}>🏍️</Text>
          </View>
        </Marker>
        <Marker coordinate={pickupPoint} anchor={{ x: 0.5, y: 0.9 }}>
          <View style={styles.markerPickup}>
            <Text style={styles.pickupPin}>P</Text>
          </View>
        </Marker>
        <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.9 }}>
          <View style={styles.markerDestination}>
            <Text style={styles.destinationPin}>⌖</Text>
          </View>
        </Marker>
        <Polyline coordinates={[riderLocation, pickupPoint, destination]} strokeColor="#C29E00" strokeWidth={3} lineDashPattern={[6, 6]} />
        {riderPath.length > 1 && (
          <Polyline coordinates={riderPath} strokeColor="#25D0FF" strokeWidth={5} lineCap="round" lineJoin="round" />
        )}
      </MapView>

      <View style={styles.mapOverlay} pointerEvents="box-none">
        <View>
          <View style={styles.routeCard}>
            <Text style={styles.routeLabel}>Heading to</Text>
            <Text style={styles.routeDestination}>{order.customer_name || 'Customer'} · {order.drop_area || 'Drop location'}</Text>
            <Text style={styles.routeDistance}>4.2 km</Text>
            <Text style={styles.routeTime}>~12 min</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.gpsStatus}>{hasLocationPermission ? '● GPS Active · ±5m' : '● GPS permission needed'}</Text>
            <Text style={styles.networkStatus}>▣ 4G</Text>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.locationHeader}>
            <View>
              <Text style={styles.bottomLabel}>Current Location</Text>
              <Text style={styles.currentLocation}>{order.pickup_area || 'Pickup location'} → {order.drop_area || 'Drop location'}</Text>
              <Text style={styles.coordinates}>{riderLocation.latitude.toFixed(4)}° N, {riderLocation.longitude.toFixed(4)}° E</Text>
            </View>
            <Pressable style={styles.navigateButton} onPress={navigateToCustomer}>
              <Text style={styles.navigateText}>🏍 Navigate</Text>
            </Pressable>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.orderButton} onPress={() => Alert.alert('Order details', 'Order details are coming soon.')}>
              <Text style={styles.actionText}>📦 View Order</Text>
            </Pressable>
            <Pressable style={styles.callButton} onPress={() => Alert.alert('Call Customer', 'Calling Priya Mehta...')}>
              <Text style={styles.callText}>📞 Call Customer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LiveLocationMap;
