import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

import styles from './styles/styles';

const fallbackLocation = { latitude: 22.5186, longitude: 88.3477 };
const destination = { latitude: 22.5257, longitude: 88.3420 };

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#080812' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#77777D' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#080812' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#191925' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#252535' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080812' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const LiveLocationMap = () => {
  const mapRef = useRef(null);
  const [riderLocation, setRiderLocation] = useState(fallbackLocation);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') return;

      setHasLocationPermission(true);
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const currentCoordinate = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      setRiderLocation(currentCoordinate);
      mapRef.current?.animateToRegion({ ...currentCoordinate, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 500);

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
        (location) => setRiderLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude }),
      );
    };

    startLocationTracking().catch(() => {});
    return () => locationSubscription?.remove();
  }, []);

  const navigateToCustomer = () => {
    mapRef.current?.animateToRegion({ ...destination, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 600);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ ...fallbackLocation, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
        customMapStyle={mapStyle}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        onMapReady={() => console.log('Google Map is ready')}
        onMapLoaded={() => console.log('Map tiles loaded')}
      >
        <Marker coordinate={riderLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerRider}>
            <Text style={styles.riderEmoji}>🏍️</Text>
          </View>
        </Marker>
        <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.9 }}>
          <View style={styles.markerDestination}>
            <Text style={styles.destinationPin}>⌖</Text>
          </View>
        </Marker>
        <Polyline coordinates={[riderLocation, destination]} strokeColor="#C29E00" strokeWidth={2} lineDashPattern={[6, 6]} />
      </MapView>

      <View style={styles.mapOverlay} pointerEvents="box-none">
        <View>
          <View style={styles.routeCard}>
            <Text style={styles.routeLabel}>Heading to</Text>
            <Text style={styles.routeDestination}>Priya Mehta · Kalighat</Text>
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
              <Text style={styles.currentLocation}>Rashbehari Ave, Kolkata</Text>
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
