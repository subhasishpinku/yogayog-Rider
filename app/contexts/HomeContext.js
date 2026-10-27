import React, { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from './axiosInstance';

const HomeContext = createContext(null);

export const HomeProvider = ({ children }) => {
  const [riderOrders, setRiderOrders] = useState([]);

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

  return (
    <HomeContext.Provider value={{ fetchRiderOrders, riderOrders }}>
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
