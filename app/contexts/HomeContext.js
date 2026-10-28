import React, { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from './axiosInstance';

const HomeContext = createContext(null);

export const HomeProvider = ({ children }) => {
  const [riderOrders, setRiderOrders] = useState([]);
  const [riderProfile, setRiderProfile] = useState(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayDelivered, setTodayDelivered] = useState(0);

  const fetchRiderOrders = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load rider orders.');
      }

      const orders = Array.isArray(response.data.orders) ? response.data.orders : [];
      setRiderOrders(orders);
      return orders;
    } catch (error) {
      console.error(
        '[HomeContext] rider/orders error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  const fetchRiderTodaysEarnings = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/todays-earnings', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load today\'s earnings.');
      }

      setTodayEarnings(Number(response.data.total_earnings || 0));
      setTodayDelivered(Number(response.data.total_delivered || 0));
      return response.data;
    } catch (error) {
      console.error(
        '[HomeContext] rider/todays-earnings error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  const fetchRiderTripDetails = useCallback(async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required to load trip details.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/trip-details', {
        params: { order_id: orderId },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load trip details.');
      }

      return response.data.order || null;
    } catch (error) {
      console.error(
        '[HomeContext] rider/trip-details error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  const acceptRiderOrder = useCallback(async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required to accept the order.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/accept-order', {
        order_id: orderId,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to accept order.');
      }

      const refreshResults = await Promise.allSettled([
        fetchRiderOrders(),
        fetchRiderTodaysEarnings(),
      ]);
      refreshResults
        .filter((result) => result.status === 'rejected')
        .forEach((result) => {
          console.error('[HomeContext] post-accept refresh error:', result.reason);
        });

      return response.data;
    } catch (error) {
      console.error(
        '[HomeContext] rider/accept-order error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, [fetchRiderOrders, fetchRiderTodaysEarnings]);

  const fetchRiderProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load rider profile.');
      }

      const profile = response.data.rider || null;
      setRiderProfile(profile);
      return profile;
    } catch (error) {
      console.error(
        '[HomeContext] rider/profile error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  const updateRiderProfile = useCallback(async (payload) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/profile/update', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to update rider profile.');
      }

      const profile = response.data.rider || response.data.profile || null;
      if (profile) {
        setRiderProfile(profile);
      }

      return response.data;
    } catch (error) {
      console.error(
        '[HomeContext] rider/profile update error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  return (
    <HomeContext.Provider
      value={{
        fetchRiderOrders,
        fetchRiderTodaysEarnings,
        fetchRiderTripDetails,
        acceptRiderOrder,
        fetchRiderProfile,
        updateRiderProfile,
        riderOrders,
        riderProfile,
        todayEarnings,
        todayDelivered,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error('useHome must be used inside HomeProvider.');
  }

  return context;
};

export default HomeContext
