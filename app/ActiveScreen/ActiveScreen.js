import React, { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import colors from './styles/colors';
import styles from './styles/styles';
import navigationStrings from '../constants/navigationStrings'; 
import { useHome } from '../contexts/HomeContext';
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

const ActiveScreen = ({ route }) => {
  const navigation = useNavigation();
  const { fetchRiderOrderById } = useHome();
  const orderId = route?.params?.orderId;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    fetchRiderOrderById(orderId)
      .then(setOrder)
      .catch(() => {});
  }, [fetchRiderOrderById, orderId]);

  const orderCode = order?.order_id || orderId || '1222000010';
  const rawOrderStatus = order?.status || order?.order_status || order?.delivery_status || order?.orderStatus || '';
  const normalizedOrderStatus = String(rawOrderStatus).trim().toLowerCase();
  const pickupStatusesWithoutCheck = [
    'assigned',
    'on_the_way',
    'on the way',
    'reached',
  ];
  const isPickedUp = !pickupStatusesWithoutCheck.includes(normalizedOrderStatus);
  const isDelivered = normalizedOrderStatus === 'delivered';
  const isPaymentDone = String(order?.payment_status || '').trim().toLowerCase() === 'done';
  const orderStatus = isDelivered
    ? 'Delivered'
    : normalizedOrderStatus
      ? normalizedOrderStatus.replace(/[_-]+/g, ' ')
      : 'Heading to Drop Point';
  const paymentMethod = String(order?.payment_method || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
  const isCodOrder = ['cod', 'cashondelivery', 'cash'].includes(paymentMethod);
  const isPrepaidOrder = ['prepaid', 'online', 'upi', 'card', 'digital'].includes(paymentMethod);
  const isWalletOrder = paymentMethod === 'wallet';
  const canUseDeliveryActions = isPaymentDone && (isWalletOrder || isPrepaidOrder);
  const isDeliveryActionDisabled = !canUseDeliveryActions && (!isDelivered || isPaymentDone);
  const deliveryParams = {
    orderId: orderCode,
    id: order?.id || order?.order_pk_id || orderId,
    amount: Number(order?.amount || 0),
    paymentMethod: order?.payment_method,
    customerName: order?.customer_name,
    pickupArea: order?.pickup_area,
    dropArea: order?.drop_area,
  };

  const handleDeliveryAction = () => {
    if (isCodOrder) {
      navigation.navigate(navigationStrings.CODAMOUNTCOLLECT, deliveryParams);
      return;
    }

    if (isWalletOrder) {
      navigation.navigate(navigationStrings.WALLETSCREEN, deliveryParams);
      return;
    }

    navigation.navigate(navigationStrings.ONLINEPAYMENT, deliveryParams);
  };

  const handleNonDeliveryAction = () => {
    navigation.navigate(navigationStrings.NONDELIVERYREPORT, {
      ...deliveryParams,
      id: order?.id || order?.order_pk_id || orderId,
    });
  };

  const handleNavigate = async () => {
    const dropLocation = order?.drop_location || order?.drop_coordinates;
    const latitude = Number(
      order?.drop_latitude ?? order?.drop_lat ?? dropLocation?.latitude ?? drop.latitude
    );
    const longitude = Number(
      order?.drop_longitude ??
        order?.drop_lng ??
        order?.drop_long ??
        dropLocation?.longitude ??
        drop.longitude
    );
    const destination = Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `${latitude},${longitude}`
      : order?.drop_area;

    if (!destination) return;

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    await Linking.openURL(mapsUrl);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
  <View style={styles.titleBar}>
        <Pressable style={styles.titleBarBack} onPress={() => navigation.goBack()}>
          <Text style={styles.titleBarBackText}>‹</Text>
        </Pressable>
        <Text style={styles.titleBarText}>Order Active</Text>
        <View style={styles.titleBarSpacer} />
      </View>
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
          <Text style={styles.etaLabel}>{order?.payment_method || 'Order'} · {order?.payment_status || 'Pending'}</Text>
          <Text style={styles.etaValue}>₹{Number(order?.amount || 0).toFixed(2)}</Text>
        </View>
        <Pressable style={styles.navigateButton} onPress={handleNavigate}>
          <Text style={styles.navigateText}>🛵 Navigate</Text>
        </Pressable>
        {/* <View style={styles.herePill}>
          <Text style={styles.hereText}>🛵 You are here</Text>
          <View style={styles.hereArrow} />
        </View> */}
      </View>

      <View style={styles.orderPanel}>
        <View style={styles.orderActionRow}>
          {isCodOrder && (
            <Pressable
              style={[styles.orderActionButton, styles.codButton]}
              onPress={() => navigation.navigate(navigationStrings.CODAMOUNTCOLLECT, deliveryParams)}
            >
              <Text style={styles.orderActionText}>{isPaymentDone ? 'Collected ✓' : 'Collect payment'}</Text>
            </Pressable>
          )}
          {/* <Pressable
            style={[styles.orderActionButton, styles.nonDeliveryButton]}
            onPress={() => navigation.navigate(navigationStrings.NONDELIVERYREPORT, deliveryParams)}
          >
            <Text style={styles.orderActionText}>Non-delivery</Text>
          </Pressable> */}
          {isWalletOrder && (
            <Pressable
              style={[styles.orderActionButton, styles.prepaidButton]}
              onPress={() => navigation.navigate(navigationStrings.WALLETSCREEN, deliveryParams)}
            >
              <Text style={styles.orderActionText}>Wallet</Text>
            </Pressable>
          )}
          {isPrepaidOrder && (
            <Pressable
              style={[styles.orderActionButton, styles.prepaidButton]}
              onPress={() => navigation.navigate(navigationStrings.ONLINEPAYMENT, deliveryParams)}
            >
              <Text style={styles.orderActionText}>Online</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{orderCode}</Text>
            <Text style={styles.orderTitle}>{orderStatus}</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>• Active</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <Text style={styles.pickupDot}>●</Text>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>{isPickedUp ? 'PICKED UP ✓' : 'PICKUP'}</Text>
              <Text style={styles.routeAddress}>{order?.pickup_area || 'Pickup address unavailable'}</Text>
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <Text style={styles.dropDot}>●</Text>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>DROPPING AT</Text>
              <Text style={styles.routeAddress}>{order?.drop_area || 'Drop address unavailable'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}><Text style={styles.customerIcon}>♟</Text></View>
          <View style={styles.customerCopy}>
            <Text style={styles.customerName}>{order?.customer_name || 'Customer'}</Text>
            <Text style={styles.customerPhone}>{order?.customer_phone || 'Phone unavailable'}</Text>
          </View>
          <Pressable
            style={styles.callButton}
            onPress={() =>
              navigation.navigate(navigationStrings.CALLCUSTOMER, {
                customerName: order?.customer_name,
                customerPhone: order?.customer_phone,
                orderId: orderCode,
                dropArea: order?.drop_area,
              })
            }
          >
            <Text style={styles.callText}>📞 Call</Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Est. Earning</Text>
            <Text style={styles.summaryValueGold}>₹{Number(order?.amount || 0).toFixed(2)}</Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Package Weight</Text>
            <Text style={styles.summaryValue}>{order?.pack_weight || 0} kg</Text>
          </View>
        </View>
        <View style={styles.deliveryButtonRow}>
          <Pressable
            style={[
              styles.deliveredButton,
              styles.deliveryActionButton,
              styles.nonDeliveryActionButton,
              (!isDelivered || isPaymentDone) && styles.disabledDeliveryActionButton,
            ]}
            onPress={handleNonDeliveryAction}
            disabled={!isDelivered || isPaymentDone}
          >
            <Text style={styles.deliveredText}>Non-delivery</Text>
          </Pressable>
          <Pressable
            style={[
              styles.deliveredButton,
              styles.deliveryActionButton,
              !canUseDeliveryActions && (!isDelivered || isPaymentDone) && styles.disabledDeliveryActionButton,
            ]}
            onPress={handleDeliveryAction}
            disabled={!canUseDeliveryActions && (!isDelivered || isPaymentDone)}
          >
            <Text style={styles.deliveredText}>
              {isDeliveryActionDisabled ? 'Collected ✓' : isPaymentDone ? 'View payment ✓' : 'Collect payment X'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ActiveScreen;


