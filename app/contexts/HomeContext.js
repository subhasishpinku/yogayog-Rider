import React, { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from './axiosInstance';

const HomeContext = createContext(null);

const resolveRiderAssetUrl = (assetPath) => {
  if (!assetPath) {
    return null;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const apiBaseUrl = axiosInstance.defaults.baseURL || '';
  const publicBaseUrl = apiBaseUrl.replace(/api\/?$/, '');
  return `${publicBaseUrl.replace(/\/$/, '')}/${String(assetPath).replace(/^\/+/, '')}`;
};

const normalizeRiderProfile = (rider) => (
  rider
    ? {
        ...rider,
        profile_picture: resolveRiderAssetUrl(rider.profile_picture),
        profile_image_url: resolveRiderAssetUrl(
          rider.profile_picture || rider.photo || rider.aadhar_file
        ),
      }
    : null
);

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

  const fetchRiderOrderById = useCallback(async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required to load order details.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/order-by-id', {
        params: { order_id: orderId },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load order details.');
      }

      console.log('[HomeContext] rider/order-by-id response:', response.data);
      return response.data.order || null;
    } catch (error) {
      console.error(
        '[HomeContext] rider/order-by-id error:',
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

      const profile = normalizeRiderProfile(response.data.rider);

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

      const profile = normalizeRiderProfile(response.data.rider || response.data.profile);
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

  const uploadRiderDocument = useCallback(async (asset, documentType) => {
    if (!asset?.uri || !documentType) {
      throw new Error('A document image and document type are required.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const uri = String(asset.uri);
      const extension = uri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
      const formData = new FormData();

      formData.append('document_type', documentType);
      formData.append('file', {
        uri,
        name: asset.fileName || `${documentType}.${extension}`,
        type: asset.mimeType || mimeType,
      });

      const response = await axiosInstance.post('rider/upload-document', formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[HomeContext] rider/upload-document response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to upload document.');
      }

      const uploadedProfile = normalizeRiderProfile(
        response.data.rider || response.data.profile
      );
      if (uploadedProfile) {
        setRiderProfile(uploadedProfile);
      }

      return response.data;
    } catch (error) {
      console.error(
        '[HomeContext] rider/upload-document error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  return (
    <HomeContext.Provider
      value={{
        fetchRiderOrders,
        fetchRiderOrderById,
        fetchRiderTodaysEarnings,
        fetchRiderTripDetails,
        acceptRiderOrder,
        fetchRiderProfile,
        updateRiderProfile,
        uploadRiderDocument,
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
