
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

const fallbackLocation = {
  latitude: 22.5186,
  longitude: 88.3477,
};

const destination = {
  latitude: 22.5257,
  longitude: 88.3420,
};

const LiveLocationShow = () => {
  const mapRef = useRef(null);

  const [riderLocation, setRiderLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let subscription;

    const startTracking = async () => {
      try {
        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') {
          setRiderLocation(fallbackLocation);
          Alert.alert(
            'Location Permission',
            'Location permission দিন, যাতে rider-এর live location দেখা যায়।'
          );
          return;
        }

        setLocationPermission(true);

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setRiderLocation(coords);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          location => {
            setRiderLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
      } catch (error) {
        console.log('Location error:', error);
        setRiderLocation(fallbackLocation);
      }
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  const navigateToCustomer = () => {
    mapRef.current?.fitToCoordinates(
      [riderLocation || fallbackLocation, destination],
      {
        edgePadding: {
          top: 100,
          right: 60,
          bottom: 280,
          left: 60,
        },
        animated: true,
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          ...fallbackLocation,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        onMapReady={() => {
          console.log('Google Map ready');
          // Android can fire onMapReady without firing onMapLoaded.
          // The native map is usable at this point, so remove the blocker.
          setMapLoaded(true);
        }}
        onMapLoaded={() => {
          console.log('Google Map tiles loaded');
          setMapLoaded(true);
        }}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {riderLocation && (
          <Marker
            coordinate={riderLocation}
            title="Rider Location"
            description="Current rider position"
          >
            <View style={styles.riderMarker}>
              <Text style={styles.riderEmoji}>🏍️</Text>
            </View>
          </Marker>
        )}

        <Marker
          coordinate={destination}
          title="Customer Location"
          description="Kalighat, Kolkata"
          pinColor="red"
        />

        <Polyline
          coordinates={[
            riderLocation || fallbackLocation,
            destination,
          ]}
          strokeColor="#C29E00"
          strokeWidth={4}
          lineDashPattern={[8, 6]}
        />
      </MapView>

      {!mapLoaded && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#C29E00" />
          <Text style={styles.loadingText}>Loading Google Map...</Text>
        </View>
      )}

      <View style={styles.topCard}>
        <Text style={styles.heading}>Live Rider Location</Text>
        <Text style={styles.subtitle}>
          {locationPermission ? '● GPS Active' : '○ Waiting for GPS'}
        </Text>
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.label}>Customer Destination</Text>
        <Text style={styles.address}>Kalighat, Kolkata</Text>

        <Text style={styles.coordinates}>
          Rider: {(riderLocation || fallbackLocation).latitude.toFixed(5)},
          {' '}{(riderLocation || fallbackLocation).longitude.toFixed(5)}
        </Text>

        <Pressable
          style={styles.button}
          onPress={navigateToCustomer}
        >
          <Text style={styles.buttonText}>🏍 Show Rider & Destination</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LiveLocationShow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
  loadingText: {
    marginTop: 10,
    color: '#222222',
    fontSize: 14,
  },
  topCard: {
    position: 'absolute',
    top: 45,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  subtitle: {
    marginTop: 6,
    color: '#16834A',
    fontSize: 13,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 18,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    color: '#777777',
  },
  address: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: '#171717',
  },
  coordinates: {
    marginTop: 8,
    fontSize: 12,
    color: '#555555',
  },
  button: {
    backgroundColor: '#C29E00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  riderMarker: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 8,
    borderWidth: 2,
    borderColor: '#C29E00',
  },
  riderEmoji: {
    fontSize: 24,
  },
});
