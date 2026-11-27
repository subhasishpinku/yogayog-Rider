import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, Platform, Pressable, ScrollView, Text, ToastAndroid, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import navigationStrings from '../constants/navigationStrings';
import { useAuth } from '../contexts/AuthContext';
import { useHome } from '../contexts/HomeContext';
import homeStyles from '../HomeScreen/styles/styles';
import reportStyles from './styles/styles';

const reasonPresentation = {
  A: { tone: 'blue' },
  B: { tone: 'olive' },
  C: { tone: 'plum' },
  D: { tone: 'olive', route: navigationStrings.RESCHEDULEDELIVERY },
  E: { tone: 'blue' },
  F: { tone: 'red' },
  G: { tone: 'olive' },
  H: { tone: 'purple' },
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const NonDeliveryReportBottom = () => {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const deviceWidth = windowWidth || Dimensions.get('window').width;
  const isCompactWidth = deviceWidth <= 360;
  const responsiveContentStyle = { paddingHorizontal: isCompactWidth ? 6 : 10 };
  const { riderProfile } = useAuth();
  const { fetchNonDeliveryReasons, fetchRiderOrders, nonDeliveryReasons } = useHome();
  const [selectedReason, setSelectedReason] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [isOrderPickerVisible, setIsOrderPickerVisible] = useState(false);
  const [isNoOrdersAlertVisible, setIsNoOrdersAlertVisible] = useState(false);
  const [isReasonsLoading, setIsReasonsLoading] = useState(true);
  const logoScale = useRef(new Animated.Value(1)).current;
  const handWave = useRef(new Animated.Value(0)).current;
  const riderName = riderProfile?.name || 'Suresh Kumar';
  const riderInitials = riderName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const handRotation = handWave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });
  const selectedOrderId = selectedOrder?.id || selectedOrder?.order_pk_id || selectedOrder?.order_id;
  const orderCode = selectedOrder?.code || selectedOrder?.order_no || selectedOrderId || 'Select order';
  const customerName = selectedOrder?.customer_name || selectedOrder?.customerName || 'Customer';
  const pickupAddress = selectedOrder?.pickup_address || selectedOrder?.pickup_area || selectedOrder?.pickup_location_name || 'Pickup address unavailable';
  const dropAddress = selectedOrder?.drop_address || selectedOrder?.drop_area || selectedOrder?.drop_location_name || 'Drop address unavailable';

  const showValidationToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Required', message);
    }
  };

  const handleOrderPickerPress = () => {
    if (isOrdersLoading) return;

    if (availableOrders.length === 0) {
      setIsNoOrdersAlertVisible(true);
      return;
    }

    setIsOrderPickerVisible(true);
  };

  useEffect(() => {
    setIsReasonsLoading(true);
    fetchNonDeliveryReasons()
      .catch(() => {
        Alert.alert('Unable to load reasons', 'Please try again later.');
      })
      .finally(() => setIsReasonsLoading(false));
  }, [fetchNonDeliveryReasons]);

  useEffect(() => {
    let mounted = true;
    setIsOrdersLoading(true);

    fetchRiderOrders()
      .then((orders) => {
        if (!mounted) return;

        const ordersAtYourDoor = (orders || []).filter(
          (order) => String(order.status || '').toLowerCase() === 'at_your_door'
        );
        setAvailableOrders(ordersAtYourDoor);
        setSelectedOrder(null);
      })
      .catch(() => {
        if (mounted) {
          setAvailableOrders([]);
          setSelectedOrder(null);
        }
      })
      .finally(() => {
        if (mounted) setIsOrdersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [fetchRiderOrders]);

  const reasons = useMemo(() => (
    nonDeliveryReasons.map((reason) => {
        const code = reason.code || String.fromCharCode(64 + Number(reason.id));

        return {
          ...reason,
          reasonId: reason.id,
          title: reason.title,
          subtitle: reason.description,
          tone: reasonPresentation[code]?.tone || 'blue',
          route: reasonPresentation[code]?.route,
        };
      })
  ), [nonDeliveryReasons]);

  const continueWithReason = () => {
    if (!selectedOrder) {
      showValidationToast('Please choose an order first.');
      return;
    }

    if (selectedReason === null) {
      showValidationToast('Please select a reason first.');
      return;
    }

    const selected = reasons.find((reason) => reason.id === selectedReason);
    navigation.navigate(selected?.route || navigationStrings.RTODETAILS, {
      id: selectedOrderId,
      orderId: orderCode,
      customerName,
      pickupAddress,
      dropAddress,
      pickupArea: pickupAddress,
      dropArea: dropAddress,
      reason: selected?.id,
      reasonId: selected?.reasonId,
      reasonTitle: selected?.title,
    });
  };

  useEffect(() => {
    const logoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    const handAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(handWave, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: -1, duration: 180, useNativeDriver: true }),
        Animated.timing(handWave, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.delay(1200),
      ])
    );

    logoAnimation.start();
    handAnimation.start();

    return () => {
      logoAnimation.stop();
      handAnimation.stop();
    };
  }, [handWave, logoScale]);

  if (isOrdersLoading || isReasonsLoading) {
    return (
      <View style={[homeStyles.screen, reportStyles.page]}>
        <StatusBar style="dark" />
        <View style={homeStyles.header}>
          <View style={homeStyles.ring} />
          <View style={homeStyles.greetingRow}>
            <Animated.Image
              source={require('../../assets/yogayoglogo2.png')}
              style={[homeStyles.logo, { transform: [{ scale: logoScale }] }]}
              resizeMode="contain"
            />
            {/* <Text style={homeStyles.greeting}>
              {getTimeBasedGreeting()}{' '}
              <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
                ✋︎
              </Animated.Text>
            </Text> */}
            {/* <Pressable
              style={homeStyles.walletButton}
              onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
            >
              <Text style={homeStyles.walletButtonText}>Wallet</Text>
            </Pressable> */}
            <Pressable
              style={[homeStyles.avatar, homeStyles.headerAvatar, { marginLeft: 'auto', alignSelf: 'flex-end' }]}
              onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
            >
              <Text style={homeStyles.avatarText}>{riderInitials || 'SK'}</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#FFC800" />
        </View>
      </View>
    );
  }

  return (
    <View style={[homeStyles.screen, reportStyles.page]}>
      <StatusBar style="dark" />
      <View style={homeStyles.header}>
        <View style={homeStyles.ring} />
        <View style={homeStyles.greetingRow}>
          <Animated.Image
            source={require('../../assets/yogayoglogo2.png')}
            style={[homeStyles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          {/* <Text style={homeStyles.greeting}>
            {getTimeBasedGreeting()}{' '}
            <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
              ✋︎
            </Animated.Text>
          </Text> */}
          {/* <Pressable
            style={homeStyles.walletButton}
            onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
          >
            <Text style={homeStyles.walletButtonText}>Wallet</Text>
          </Pressable> */}
          <Pressable
            style={[homeStyles.avatar, homeStyles.headerAvatar, { marginLeft: 'auto', alignSelf: 'flex-end' }]}
            onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
          >
            <Text style={homeStyles.avatarText}>{riderInitials || 'SK'}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 14 }}
        showsVerticalScrollIndicator={false}
      >
      <Modal
        visible={isNoOrdersAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNoOrdersAlertVisible(false)}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.58)' }}>
          <View style={{ width: '100%', maxWidth: 340, alignItems: 'center', padding: 22, borderWidth: 2, borderColor: '#FFC800', borderRadius: 22, backgroundColor: '#FFFFFF', elevation: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 12 }}>
            <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 28, backgroundColor: '#FFF7CC' }}>
              <Text style={{ color: '#B7791F', fontSize: 28, fontWeight: '900' }}>!</Text>
            </View>
            <Text style={{ marginTop: 14, color: '#111827', fontSize: 20, fontWeight: '900' }}>No orders available</Text>
            <Text style={{ marginTop: 7, color: '#4B5563', fontSize: 13, lineHeight: 19, textAlign: 'center' }}>
              There are no at-your-door orders to choose from.
            </Text>
            <Pressable
              style={{ width: '100%', alignItems: 'center', marginTop: 20, paddingVertical: 12, borderRadius: 13, backgroundColor: '#FFC800', elevation: 3, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 3 }}
              onPress={() => setIsNoOrdersAlertVisible(false)}
            >
              <Text style={{ color: '#111827', fontSize: 14, fontWeight: '900' }}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isOrderPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOrderPickerVisible(false)}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.58)' }}>
          <View style={{ width: '100%', maxHeight: '70%', padding: 18, borderWidth: 2, borderColor: '#FFC800', borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 10, shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 10 }}>
            <Text style={{ color: '#111827', fontSize: 20, fontWeight: '900' }}>Choose your order</Text>
            <Text style={{ marginTop: 4, marginBottom: 14, color: '#4B5563', fontSize: 12 }}>
              Select an order to continue
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {availableOrders.map((order) => {
                const optionId = order.id || order.order_pk_id || order.order_id;
                const optionCode = order.code || order.order_no || optionId;

                return (
                  <Pressable
                    key={String(optionId)}
                    style={{ minHeight: 52, justifyContent: 'center', marginBottom: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#FFC800', borderRadius: 12, backgroundColor: '#FFFDF0', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 3 }}
                    onPress={() => {
                      setSelectedOrder(order);
                      setSelectedReason(null);
                      setIsOrderPickerVisible(false);
                    }}
                  >
                    <Text style={{ color: '#111827', fontSize: 15, fontWeight: '800' }}>{optionCode}</Text>
                    <Text style={{ marginTop: 2, color: '#4B5563', fontSize: 11 }}>
                      {order.customer_name || order.customerName || 'Customer'} · {order.status}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              style={{ alignItems: 'center', marginTop: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FFC800', elevation: 3, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 3 }}
              onPress={() => setIsOrderPickerVisible(false)}
            >
              <Text style={{ color: '#111827', fontSize: 14, fontWeight: '900' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    <View style={{ zIndex: 2, marginHorizontal: 8, padding: 8, paddingHorizontal: 16, backgroundColor: '#FFFFFF' }}>
        <Pressable
        style={{ minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderWidth: 2, borderColor: '#FFC800', borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 6, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 }}
          onPress={handleOrderPickerPress}
          disabled={isOrdersLoading}
        >
          {isOrdersLoading ? (
            <ActivityIndicator color="#FFC800" />
          ) : (
            <Text style={{ color: '#111827', fontSize: 14, fontWeight: '700' }}>
              {selectedOrder ? orderCode : 'Choose your order'}
            </Text>
          )}
          <Text style={{ color: '#FFC800', fontSize: 18 }}>⌄</Text>
        </Pressable>
      </View>
      {/* <View style={[reportStyles.headerBackground, { minHeight: 58, paddingHorizontal: 12, paddingTop: 3 }]}>
        <View style={reportStyles.headerOrb} />
        <Text style={reportStyles.orderMeta}>{orderCode} · {customerName}</Text>
        <View style={[reportStyles.warningCard, { marginTop: 2, paddingVertical: 3 }]}>
          <Text style={reportStyles.warningText}>Select the reason why this shipment could not be{ '\n' }delivered</Text>
        </View>
      </View> */}
      <View style={[reportStyles.listContent, { marginHorizontal: 15, paddingTop: 0, paddingBottom: 14 }, responsiveContentStyle]}>
        {reasons.map((reason) => {
          const isSelected = reason.id === selectedReason;

          return (
            <Pressable
              key={reason.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[reportStyles.reasonCard, { minHeight: 60, marginTop: 6, paddingHorizontal: 12 }, isSelected && reportStyles.reasonCardSelected]}
              onPress={() => setSelectedReason(reason.id)}
            >
              <View style={[reportStyles.reasonIcon, { width: 34, height: 34, borderRadius: 10 }, reportStyles[`${reason.tone}Icon`]]}>
                <Text style={reportStyles.reasonEmoji}>{reason.icon}</Text>
              </View>
              <View style={reportStyles.reasonCopy}>
                <Text style={reportStyles.reasonTitle}>{reason.title}</Text>
                <Text style={reportStyles.reasonSubtitle}>{reason.subtitle}</Text>
              </View>
              <View style={[reportStyles.radio, isSelected && reportStyles.radioSelected]}>
                {isSelected && <View style={reportStyles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
        <Pressable
          style={[reportStyles.continueButton, { height: 48, marginTop: 10 }]}
          onPress={continueWithReason}
        >
          <Text style={reportStyles.continueText}>Continue with Selected Reason →</Text>
        </Pressable>
      </View>
      </ScrollView>
    </View>
  );
};

export default NonDeliveryReportBottom;
