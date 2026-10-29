import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useHome } from '../contexts/HomeContext';
import navigationStrings from '../constants/navigationStrings';
import colors from './styles/colors';
import styles from './styles/ActiveListstyles';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'rider_accepted', label: 'Accepted' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const statusLabel = (status) => {
  if (status === 'rider_accepted') return 'Accepted';
  if (status === 'out_for_delivery') return 'Out for delivery';
  if (status === 'delivered') return 'Delivered';
  return String(status || 'Unknown').replace(/_/g, ' ');
};

const ActiveList = () => {
  const navigation = useNavigation();
  const { fetchRiderOrders, riderOrders } = useHome();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

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
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const searchableText = [order.code, order.customer_name, order.customer_phone, order.pickup_area, order.drop_area]
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [riderOrders, search, selectedStatus]);

  const countForStatus = (key) => (
    key === 'all' ? riderOrders.length : riderOrders.filter((order) => order.status === key).length
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>RIDER ORDERS</Text>
        <Text style={styles.title}>Active List</Text>
        <Text style={styles.subtitle}>Track your accepted and delivered orders</Text>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search order, city or customer..."
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabs}>
        {statusTabs.map((tab) => {
          const selected = selectedStatus === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => setSelectedStatus(tab.key)} style={[styles.statusTab, selected && styles.selectedStatusTab]}>
              <Text style={[styles.statusDot, selected && styles.selectedStatusDot]}>•</Text>
              <Text style={[styles.statusTabText, selected && styles.selectedStatusTabText]}>{tab.label} {countForStatus(tab.key)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} tintColor={colors.gold} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultText}>{filteredOrders.length} orders found</Text>

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
          filteredOrders.map((order) => (
            <Pressable
              key={order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate(navigationStrings.ACTIVESCREEN, { orderId: order.id })}
            >
              <View style={styles.orderTopRow}>
                <Text style={styles.orderCode}>{order.code || `#${order.id}`}</Text>
                <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>{statusLabel(order.status)}</Text></View>
              </View>
              <Text style={styles.customerName}>{order.customer_name || 'Customer'}</Text>
              <Text style={styles.customerPhone}>{order.customer_phone || 'Phone unavailable'}</Text>
              <View style={styles.routeRow}><Text style={styles.routeDot}>●</Text><Text style={styles.routeText} numberOfLines={1}>{order.pickup_area || 'Pickup unavailable'}</Text></View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}><Text style={styles.dropDot}>●</Text><Text style={styles.routeText} numberOfLines={1}>{order.drop_area || 'Drop unavailable'}</Text></View>
              <View style={styles.orderBottomRow}><Text style={styles.createdAt}>{order.created_at || ''}</Text><Text style={styles.amount}>₹{Number(order.amount || 0).toFixed(2)}</Text></View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ActiveList;
