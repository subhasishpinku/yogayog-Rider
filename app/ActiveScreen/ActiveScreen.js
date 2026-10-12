import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import colors from './styles/colors';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings'; 
const pickup = { latitude: 22.5096, longitude: 88.3456 };
const drop = { latitude: 22.5198, longitude: 88.3469 };

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#12121d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#77777d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#12121d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#242433' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#181824' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c0c16' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const ActiveScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

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
            strokeColor={colors.gold}
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
          <Marker coordinate={pickup} title="Pickup" tracksViewChanges={false}>
            <View style={styles.pickupMarker} />
          </Marker>
          <Marker coordinate={drop} title="Drop" tracksViewChanges={false}>
            <View style={styles.dropMarker} />
          </Marker>
        </MapView>

        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>ETA to Drop</Text>
          <Text style={styles.etaValue}>~12 min</Text>
        </View>
        <Pressable style={styles.navigateButton}>
          <Text style={styles.navigateText}>🛵 Navigate</Text>
        </Pressable>
        <View style={styles.herePill}>
          <Text style={styles.hereText}>🛵 You are here</Text>
          <View style={styles.hereArrow} />
        </View>
      </View>

      <View style={styles.orderPanel}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #1222000010</Text>
            <Text style={styles.orderTitle}>Heading to Drop Point</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>• Active</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <Text style={styles.pickupDot}>●</Text>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>PICKED UP ✓</Text>
              <Text style={styles.routeAddress}>15, Chandra Nath Chatterjee St</Text>
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <Text style={styles.dropDot}>●</Text>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>DROPPING AT</Text>
              <Text style={styles.routeAddress}>Kalighat Kali Mandir, Anami Sangha</Text>
            </View>
          </View>
        </View>

        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}><Text style={styles.customerIcon}>♟</Text></View>
          <View style={styles.customerCopy}>
            <Text style={styles.customerName}>Saheli Das</Text>
            <Text style={styles.customerPhone}>8975989667</Text>
          </View>
          <Pressable style={styles.callButton}>
            <Text style={styles.callText}>📞 Call</Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Est. Earning</Text>
            <Text style={styles.summaryValueGold}>₹57.75</Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Distance Left</Text>
            <Text style={styles.summaryValue}>4.2 km</Text>
          </View>
        </View>

        <Pressable
          style={styles.deliveredButton}
          onPress={() => navigation.navigate(navigationStrings.ACTIVEDELIVERY)}
        >
          <Text style={styles.deliveredText}>Mark as Delivered ✓</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ActiveScreen;


