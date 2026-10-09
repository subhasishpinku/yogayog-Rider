import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

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

const AcceptRejectOrder = () => {
  const navigation = useNavigation();
  const [secondsLeft, setSecondsLeft] = useState(18);

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
            initialRegion={{
              latitude: 22.5147,
              longitude: 88.3462,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            }}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={false}
            showsTraffic={false}
          >
            <Polyline
              coordinates={[pickup, drop]}
              strokeColor="#FFC800"
              strokeWidth={4}
              lineDashPattern={[8, 6]}
            />
            <Marker coordinate={pickup} title="Pickup" tracksViewChanges={false}>
              <View style={styles.mapMarkerPickup} />
            </Marker>
            <Marker coordinate={drop} title="Drop" tracksViewChanges={false}>
              <View style={styles.mapMarkerDrop} />
            </Marker>
          </MapView>

          <View style={styles.routePill}>
            <Text style={styles.routeText}>🛵 En route to pickup</Text>
            <View style={styles.routePillArrow} />
          </View>
        </View>

        <View style={styles.orderSection}>
          <View style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View>
                <Text style={styles.orderMeta}>Order #1222000010</Text>
                <Text style={styles.fare}>₹57.75 Est. Fare</Text>
              </View>
              <View style={styles.timer}>
                <Text style={styles.timerText}>{secondsLeft}s</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>●</Text>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>PICKUP · 0.8 KM AWAY</Text>
                <Text style={styles.locationAddress}>15, Chandra Nath Chatterjee St, Bhowanipore, Kolkata</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={[styles.locationIcon, styles.dropIcon]}>●</Text>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>DROP · 7.2 KM TOTAL</Text>
                <Text style={styles.locationAddress}>Kalighat Kali Mandir, Anami Sangha, Kalighat</Text>
              </View>
            </View>

            <View style={styles.orderTags}>
              <View style={[styles.tag, styles.goldTag]}><Text style={[styles.tagText, styles.goldTagText]}>📦 2 kg</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>COD</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>Local Bike</Text></View>
              <View style={[styles.tag, styles.greenTag]}><Text style={[styles.tagText, styles.greenTagText]}>Santanu Roy</Text></View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.rejectButton} onPress={() => navigation.goBack()}>
              <Text style={styles.rejectText}>✕ Reject</Text>
            </Pressable>
            <Pressable style={styles.acceptButton} onPress={() => navigation.goBack()}>
              <Text style={styles.acceptText}>✓ Accept</Text>
            </Pressable>
          </View>

          <View style={styles.progressTrack}><View style={styles.progress} /></View>
          <Text style={styles.autoReject}>Auto-reject in {secondsLeft} seconds</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AcceptRejectOrder;
