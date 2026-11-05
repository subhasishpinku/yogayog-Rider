import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useHome } from '../contexts/HomeContext';
import navigationStrings from '../constants/navigationStrings';
import styles from './styles/styles';
const STATUS_FLOW = [
  { key: 'rider_accepted', label: 'Rider Accepted', description: 'Order accepted' },
  { key: 'on_the_way', label: 'On the Way', description: 'Start pickup' },
  { key: 'reached', label: 'Reached', description: 'Reached pickup point' },
  { key: 'picked_up', label: 'Picked Up', description: 'Package collected' },
  { key: 'hand_over_branch', label: 'Hand Over Branch', description: 'Package handed to branch' },
  { key: 'delivery_started', label: 'Delivery Started', description: 'Delivery is in progress' },
  { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Heading to customer' },
  { key: 'at_your_door', label: 'At Your Door', description: 'Arrived at destination' },
  { key: 'delivered', label: 'Delivered', description: 'Order completed' },
];

const normalizeStatus = (status) => String(status || '').trim().toLowerCase();

const getMapDestination = (order) => {
  const location = order?.drop_location || order?.drop_coordinates;
  const latitude = Number(order?.drop_latitude ?? order?.drop_lat ?? location?.latitude);
  const longitude = Number(
    order?.drop_longitude ?? order?.drop_lng ?? order?.drop_long ?? location?.longitude,
  );

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? `${latitude},${longitude}`
    : order?.drop_area || 'Drop location';
};

const OrderChainScreen = ({ route, navigation }) => {
  const { updateRiderOrderStatus } = useHome();
  const order = route?.params?.order || {};
  const orderId = route?.params?.orderId || order.id || order.order_pk_id || order.order_id;
  const incomingStatus = normalizeStatus(order.status);
  const initialStatus = incomingStatus === 'assigned' || !STATUS_FLOW.some(({ key }) => key === incomingStatus)
    ? 'rider_accepted'
    : incomingStatus;
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentIndex = useMemo(
    () => STATUS_FLOW.findIndex(({ key }) => key === currentStatus),
    [currentStatus]
  );
  const isDelivered = currentStatus === 'delivered';
  const nextStatus = STATUS_FLOW[currentIndex + 1];

  const handleNextStatus = async () => {
    if (!nextStatus || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateRiderOrderStatus(orderId, nextStatus.key);
      setCurrentStatus(nextStatus.key);

      if (nextStatus.key === 'delivered') {
        navigation.replace(navigationStrings.DASHBOARDSCREEN);
      } else if (nextStatus.key === 'on_the_way') {
        openLiveLocationMap();
      }
    } catch (error) {
      Alert.alert('Status update failed', error.message || 'Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openLiveLocationMap = () => {
    //    navigation.navigate(navigationStrings.LIVELOCATIONMAP, { order, orderId });

    const destination = encodeURIComponent(getMapDestination(order));
    const mapsUrl = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destination}&dirflg=d`
      : `google.navigation:q=${destination}&mode=d`;
    const browserFallback = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    Linking.openURL(mapsUrl).catch(() => Linking.openURL(browserFallback)).catch(() => {
      Alert.alert('Map unavailable', 'Please install Google Maps or Apple Maps to navigate.');
    });
  };

  return (
    <View style={styles.chainScreen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.chainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ACCEPTED ORDER</Text>
            <Text style={styles.title}>Order Chain</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{STATUS_FLOW[currentIndex]?.label || 'In Progress'}</Text>
          </View>
        </View>

        <View style={styles.chainOrderCard}>
          <View style={styles.orderRow}>
            <View>
              <Text style={styles.orderLabel}>ORDER</Text>
              <Text style={styles.orderNumber}>#{order.code || order.order_id || orderId || '—'}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.orderLabel}>AMOUNT</Text>
              <Text style={styles.amount}>₹{Number(order.amount || 0).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.customerName}>{order.customer_name || 'Customer'}</Text>
          <Text style={styles.customerPhone}>{order.customer_phone || 'Phone unavailable'}</Text>
          <Text style={styles.chainRouteText}>
            {order.pickup_area || 'Pickup unavailable'} → {order.drop_area || 'Drop unavailable'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Delivery Progress</Text>
        <View style={styles.timelineCard}>
          {STATUS_FLOW.map((step, index) => {
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === STATUS_FLOW.length - 1;

            return (
              <View style={styles.stepRow} key={step.key}>
                <View style={styles.stepRail}>
                  <View style={[styles.stepDot, isComplete && styles.stepDotComplete, isCurrent && styles.stepDotCurrent]}>
                    {isComplete && <Text style={styles.check}>✓</Text>}
                  </View>
                  {!isLast && <View style={[styles.connector, index < currentIndex && styles.connectorComplete]} />}
                </View>
                <View style={styles.stepCopy}>
                  <View style={styles.stepHeader}>
                    <Text style={[styles.stepLabel, isComplete && styles.stepLabelComplete]}>{step.label}</Text>
                    {step.key === 'on_the_way' && currentStatus === 'on_the_way' && (
                      <Pressable style={styles.mapIconButton} onPress={openLiveLocationMap}>
                        <Image source={require('../../assets/google-maps-icon.png')} style={styles.mapIcon} />
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.stepDescription}>{isCurrent ? step.description : isComplete ? 'Completed' : 'Pending'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          style={[styles.nextButton, (!nextStatus || isUpdating) && styles.nextButtonDisabled]}
          onPress={handleNextStatus}
          disabled={!nextStatus || isUpdating}
        >
          {isUpdating ? <ActivityIndicator color="#111111" /> : <Text style={styles.nextButtonText}>{isDelivered ? 'Order Delivered' : `Update: ${nextStatus?.label || 'Complete'}`}</Text>}
        </Pressable>
        <Text style={styles.apiHint}>Status updates are saved after every step.</Text>
      </ScrollView>
    </View>
  );
};

export default OrderChainScreen;
