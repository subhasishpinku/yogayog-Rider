import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useHome } from '../contexts/HomeContext';
import { useAuth } from '../contexts/AuthContext';
import navigationStrings from '../constants/navigationStrings';
import colors from './styles/colors';
import styles from './styles/ActiveListstyles';
import homeStyles from '../HomeScreen/styles/styles';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'rider_accepted', label: 'Rider\nAccepted' },
  { key: 'on_the_way', label: 'On the\nWay' },
  { key: 'reached', label: 'Reached' },
  { key: 'picked_up', label: 'Picked\nUp' },
  { key: 'delivery_started', label: 'Delivery\nStarted' },
  { key: 'out_for_delivery', label: 'Out for\nDelivery' },
  { key: 'at_your_door', label: 'At Your\nDoor' },
];

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const statusLabel = (status) => {
  if (status === 'rider_accepted') return 'Accepted';
  if (status === 'order_in_queue') return 'In queue';
  if (status === 'out_for_delivery') return 'Out for delivery';
  if (status === 'delivered') return 'Delivered';
  return String(status || 'Unknown').replace(/_/g, ' ');
};

const isOrderToday = (createdAt) => {
  if (!createdAt) return false;

  const today = new Date();
  const todayKey = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
    .map((value) => String(value).padStart(2, '0'))
    .join('-');
  const dateText = String(createdAt);

  if (/^\d{4}-\d{2}-\d{2}/.test(dateText)) {
    return dateText.slice(0, 10) === todayKey;
  }

  const parsedDate = new Date(createdAt);
  return !Number.isNaN(parsedDate.getTime())
    && parsedDate.getFullYear() === today.getFullYear()
    && parsedDate.getMonth() === today.getMonth()
    && parsedDate.getDate() === today.getDate();
};

const ActiveList = ({ initialStatus = 'all' }) => {
  const navigation = useNavigation();
  const { riderProfile } = useAuth();
  const { fetchRiderOrders, riderOrders } = useHome();
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [listTab, setListTab] = useState('pending');
  const [activeTabGroup, setActiveTabGroup] = useState(initialStatus === 'all' ? 'list' : 'status');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const pendingPaymentOpacity = React.useRef(new Animated.Value(1)).current;
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

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pendingPaymentOpacity, { toValue: 0.35, duration: 650, useNativeDriver: true }),
        Animated.timing(pendingPaymentOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pendingPaymentOpacity]);

  const loadOrders = useCallback(async (isRefresh = false) => {
    setError('');
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      await fetchRiderOrders();
    } catch (requestError) {
      setError(requestError.message || 'Unable to load rider orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchRiderOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return riderOrders.filter((order) => {
      const normalizedOrderStatus = String(order.status || '').trim().toLowerCase();
      const paymentStatus = String(order.payment_status || '').trim().toLowerCase();
      const matchesListTab = listTab === 'all'
        ? true
        : listTab === 'delivered'
          ? normalizedOrderStatus === 'delivered' && paymentStatus === 'done'
          : normalizedOrderStatus !== 'delivered' && paymentStatus === 'pending';
      const matchesStatus = selectedStatus === 'all'
        || order.status === selectedStatus
        || (selectedStatus === 'order_in_queue' && order.status !== 'delivered')
        || (selectedStatus === 'payment_done' && paymentStatus === 'done')
        || (selectedStatus === 'payment_pending' && paymentStatus === 'pending')
        || (selectedStatus === 'today_payment_done' && isOrderToday(order.created_at) && paymentStatus === 'done')
        || (selectedStatus === 'today_payment_pending' && isOrderToday(order.created_at) && paymentStatus === 'pending');
      const searchableText = [order.code, order.customer_name, order.customer_phone, order.pickup_area, order.drop_area]
        .join(' ')
        .toLowerCase();
      return matchesListTab && matchesStatus && (!query || searchableText.includes(query));
    });
  }, [listTab, riderOrders, search, selectedStatus]);

  const countForStatus = (key) => {
    if (key === 'all') return riderOrders.length;
    if (key === 'order_in_queue') {
      return riderOrders.filter((order) => order.status !== 'delivered').length;
    }
    if (key === 'payment_done') {
      return riderOrders.filter((order) => String(order.payment_status || '').trim().toLowerCase() === 'done').length;
    }
    if (key === 'payment_pending') {
      return riderOrders.filter((order) => String(order.payment_status || '').trim().toLowerCase() === 'pending').length;
    }
    if (key === 'today_payment_done') {
      return riderOrders.filter((order) => isOrderToday(order.created_at)
        && String(order.payment_status || '').trim().toLowerCase() === 'done').length;
    }
    if (key === 'today_payment_pending') {
      return riderOrders.filter((order) => isOrderToday(order.created_at)
        && String(order.payment_status || '').trim().toLowerCase() === 'pending').length;
    }
    return riderOrders.filter((order) => order.status === key).length;
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[homeStyles.header, { height: 68, paddingTop: 18 }]}>
        <View style={homeStyles.ring} />
        <View style={homeStyles.greetingRow}>
          <Animated.Image
            source={require('../../assets/yogayoglogo1.png')}
            style={[homeStyles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          <Text style={homeStyles.greeting}>
            {getTimeBasedGreeting()}{' '}
            <Animated.Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 25, transform: [{ rotate: handRotation }] }}>
              ✋︎
            </Animated.Text>
          </Text>
          <Pressable
            style={homeStyles.walletButton}
            onPress={() => navigation.navigate(navigationStrings.WITHDRAWEARNINGS)}
          >
            <Text style={homeStyles.walletButtonText}>Wallet</Text>
          </Pressable>
          <Pressable
            style={[homeStyles.avatar, homeStyles.headerAvatar]}
            onPress={() => navigation.navigate(navigationStrings.ALLPROFILESCREEN)}
          >
            <Text style={homeStyles.avatarText}>{riderInitials || 'SK'}</Text>
          </Pressable>
        </View>
        {/* <View style={styles.nameRow}>
          <Text style={styles.name}>{riderName}</Text>
        </View> */}
        {/* <Text style={styles.vehicle}>🏍️ {vehicleDetails || 'Bike · KA 01 AB 1234'}</Text> */}
      </View>


      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search order, city or customer..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listTabs}>
        {[
          { key: 'pending', label: 'Pending' },
          { key: 'delivered', label: 'Delivered' },
        ].map((tab) => {
          const selected = listTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                setActiveTabGroup('list');
                setListTab(tab.key);
                setSelectedStatus('all');
              }}
              style={[styles.listTab, selected && activeTabGroup === 'list' && styles.selectedListTab]}
            >
              <Text style={[styles.listTabText, selected && activeTabGroup === 'list' && styles.selectedListTabText]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView
        horizontal
        style={styles.statusTabsScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusTabs}
      >
        {statusTabs.filter((tab) => countForStatus(tab.key) > 0).map((tab) => {
          const selected = selectedStatus === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                setActiveTabGroup('status');
                setSelectedStatus(tab.key);
                setListTab('all');
              }}
              style={[styles.statusTab, selected && activeTabGroup === 'status' && styles.selectedStatusTab]}
            >
              <View style={[styles.statusCount, selected && activeTabGroup === 'status' && styles.selectedStatusCount]}>
                <Text style={[styles.statusCountText, selected && activeTabGroup === 'status' && styles.selectedStatusCountText]}>
                  {countForStatus(tab.key)}
                </Text>
              </View>
              <Text style={[styles.statusTabText, selected && activeTabGroup === 'status' && styles.selectedStatusTabText]}>{tab.label}</Text>
              <View style={[styles.statusIndicator, !(selected && activeTabGroup === 'status') && styles.statusIndicatorHidden]} />
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.orderScroll}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} tintColor={colors.gold} />}
        showsVerticalScrollIndicator
        persistentScrollbar
      >
        {/* <Text style={styles.resultText}>{filteredOrders.length} orders found</Text> */}

        {loading ? (
          <ActivityIndicator size="large" color={colors.gold} style={styles.loader} />
        ) : error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Could not load orders</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => loadOrders()}><Text style={styles.retryText}>Retry</Text></Pressable>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>Try another status or search term.</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const paymentStatus = String(order.payment_status || 'Pending');
            const normalizedPaymentStatus = paymentStatus.trim().toLowerCase();
            const isPaymentPending = normalizedPaymentStatus === 'pending';
            const isPaymentDone = normalizedPaymentStatus === 'done';

            return (
              <Pressable
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate(navigationStrings.ACTIVESCREEN, { orderId: order.id })}
              >
              <View style={styles.orderTopRow}>
                <Text style={styles.orderCode}>{order.code || `#${order.id}`}</Text>
                <View style={styles.statusColumn}>
                  <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>{statusLabel(order.status)}</Text></View>
                  <Animated.Text
                    style={[
                      styles.paymentStatusText,
                      isPaymentPending && styles.pendingPaymentStatusText,
                      isPaymentDone && styles.donePaymentStatusText,
                      isPaymentPending && { opacity: pendingPaymentOpacity },
                    ]}
                  >
                    Payment: {paymentStatus}
                  </Animated.Text>
                </View>
              </View>
              <Text style={styles.customerName}>{order.customer_name || 'Customer'}</Text>
              <Text style={styles.customerPhone}>{order.customer_phone || 'Phone unavailable'}</Text>
              <View style={styles.routeSectionDivider} />
              <View style={styles.routeRow}><Text style={styles.routeDot}>●</Text><Text style={styles.routeText} numberOfLines={1}>{order.pickup_area || 'Pickup unavailable'}</Text></View>
              <View style={styles.routeRow}><Text style={styles.dropDot}>●</Text><Text style={styles.routeText} numberOfLines={1}>{order.drop_area || 'Drop unavailable'}</Text></View>
              <View style={styles.orderBottomRow}><Text style={styles.createdAt}>{order.created_at || ''}</Text><Text style={styles.amount}>₹{Number(order.amount || 0).toFixed(2)}</Text></View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ActiveList;
