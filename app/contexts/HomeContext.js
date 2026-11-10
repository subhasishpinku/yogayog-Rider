import React, { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform, ToastAndroid } from 'react-native';

import axiosInstance from './axiosInstance';

const HomeContext = createContext(null);

const showErrorToast = (error, fallbackMessage = 'Something went wrong.') => {
  const message = error?.response?.data?.message || error?.message || fallbackMessage;

  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert('Error', message);
  }
};

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
  const [riderDocuments, setRiderDocuments] = useState([]);
  const [nonDeliveryReasons, setNonDeliveryReasons] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayDelivered, setTodayDelivered] = useState(0);
  const [earningsByPeriod, setEarningsByPeriod] = useState({
    today: null,
    week: null,
    month: null,
    year: null,
  });

  const fetchRiderOrders = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('[HomeContext] auth token:', token ? `present (...${token.slice(-6)})` : 'missing');
      const response = await axiosInstance.get('rider/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/orders response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load rider orders.');
      }

      const orders = Array.isArray(response.data.orders) ? response.data.orders : [];
      console.log('[HomeContext] rider/orders parsed orders:', orders);
      setRiderOrders(orders);
      return orders;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/orders error:',
      //   error.response?.data || error.message
      // );
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
      // console.error(
      //   '[HomeContext] rider/order-by-id error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderOrderPaymentDetails = useCallback(async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required to load payment details.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/get-order-payment-details', {
        params: { order_id: orderId },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load payment details.');
      }

      return response.data.order || null;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/get-order-payment-details error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderWalletLedger = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/wallet-ledger', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/wallet-ledger response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load wallet ledger.');
      }

      return Array.isArray(response.data.wallet_transactions)
        ? response.data.wallet_transactions
        : [];
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/wallet-ledger error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const submitRiderCod = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/submit-cod', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/submit-cod response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to submit COD records.');
      }

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/submit-cod error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderWalletBalance = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/wallet-balance', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load wallet balance.');
      }

      const balance = Number(response.data?.wallet_balance || 0);
      setWalletBalance(balance);
      return balance;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/wallet-balance error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const makeRiderWithdrawalRequest = useCallback(async (amount) => {
    const withdrawalAmount = Number(amount);

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      throw new Error('A valid withdrawal amount is required.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/make-withdrawal-request', null, {
        params: { amount: withdrawalAmount },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to submit withdrawal request.');
      }

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/make-withdrawal-request error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const collectRiderCod = useCallback(async (orderId, signatureImage) => {
    if (!orderId) {
      throw new Error('Order ID is required to collect COD.');
    }

    if (!signatureImage) {
      throw new Error('Customer signature is required to collect COD.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      let signatureUri = signatureImage;

      if (String(signatureImage).startsWith('data:image/')) {
        const [, base64Data] = String(signatureImage).split(',');
        signatureUri = `${FileSystem.cacheDirectory}customer-signature-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(signatureUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const formData = new FormData();
      formData.append('signature_image', {
        uri: signatureUri,
        name: 'customer-signature.png',
        type: 'image/png',
      });

      const response = await axiosInstance.post('rider/collect-cod', formData, {
        params: { order_id: orderId },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to collect COD.');
      }

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/collect-cod error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const createRiderBillDeskPayment = useCallback(async ({ orderMasterId, userId, amount }) => {
    const normalizedAmount = Number(amount);

    if (!orderMasterId || !userId || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      throw new Error('Order, rider, and a valid payment amount are required.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const storedUserValue = await AsyncStorage.getItem('authUser');
      const storedUser = storedUserValue ? JSON.parse(storedUserValue) : {};
      const resolvedUserId = userId || storedUser.id || storedUser.user_id || storedUser.userId;

      if (!resolvedUserId) {
        throw new Error('Rider user ID is missing.');
      }

      const response = await axiosInstance.post('rider/create-payment', {
        orderMasterId,
        userId: resolvedUserId,
        amount: normalizedAmount,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/create-payment response:', response.data);

      if (response.data?.status !== true || !response.data?.data) {
        throw new Error(response.data?.message || 'Unable to create BillDesk payment.');
      }

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/create-payment error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderEarnings = useCallback(async (period = 'today') => {
    const normalizedPeriod = String(period).toLowerCase();
    const endpointByPeriod = {
      today: 'rider/today-earnings',
      week: 'rider/weekly-earnings',
      month: 'rider/monthly-earnings',
      year: 'rider/yearly-earnings',
    };
    const endpoint = endpointByPeriod[normalizedPeriod];

    if (!endpoint) {
      throw new Error('Invalid earnings period. Use today, week, month, or year.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('[HomeContext] earnings request:', {
        period: normalizedPeriod,
        endpoint,
        authToken: token ? `present (...${token.slice(-6)})` : 'missing',
      });
      console.log(`[HomeContext] ${endpoint} request headers:`, token ? { Authorization: `Bearer) ${token}` } : undefined);
      const response = await axiosInstance.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log(`[HomeContext] ${endpoint} response:`, response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load earnings.');
      }

      const summary = response.data?.data || {};
      const normalizedSummary = {
        ...summary,
        total_orders: Number(summary.total_orders || 0),
        total_cod_amount: Number(summary.total_cod_amount || 0),
        total_earnings: Number(summary.total_earnings || 0),
      };

      console.log(`[HomeContext] ${normalizedPeriod} normalized summary:`, normalizedSummary);

      setEarningsByPeriod((previous) => ({
        ...previous,
        [normalizedPeriod]: normalizedSummary,
      }));

      if (normalizedPeriod === 'today') {
        setTodayEarnings(normalizedSummary.total_earnings);
        setTodayDelivered(normalizedSummary.total_orders);
      }

      return normalizedSummary;
    } catch (error) {
      // console.error(
      //   `[HomeContext] ${endpoint} error:`,
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderTodaysEarnings = useCallback(
    () => fetchRiderEarnings('today'),
    [fetchRiderEarnings]
  );

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
      // console.error(
      //   '[HomeContext] rider/trip-details error:',
      //   error.response?.data || error.message
      // );
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
          showErrorToast(result.reason, 'Unable to refresh order information.');
        });

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/accept-order error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, [fetchRiderOrders, fetchRiderTodaysEarnings]);

  const updateRiderOrderStatus = useCallback(async (orderId, status) => {
    if (!orderId || !status) {
      throw new Error('Order ID and status are required to update order status.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/update-order-status', {
        order_id: orderId,
        status,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const responseData = response.data || {};
      const successMessage = String(responseData.message || '').toLowerCase();
      const requestSucceeded =
        responseData.success === true ||
        responseData.success === 'true' ||
        responseData.status === true ||
        responseData.status === 'true' ||
        successMessage.includes('successfully');

      if (!requestSucceeded) {
        throw new Error(responseData.message || 'Unable to update order status.');
      }

      setRiderOrders((previousOrders) => previousOrders.map((order) => {
        const currentId = order.id || order.order_pk_id || order.order_id;
        return String(currentId) === String(orderId) ? { ...order, status } : order;
      }));

      return responseData;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/update-order-status error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

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
      // console.error(
      //   '[HomeContext] rider/profile error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const updateRiderProfile = useCallback(async (payload) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const profileImage = payload?.profile_picture;
      const hasProfileImage = Boolean(profileImage?.uri);
      let requestPayload = payload;
      const requestHeaders = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (hasProfileImage) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key !== 'profile_picture' && value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const imageUri = String(profileImage.uri);
        const extension = imageUri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
        formData.append('profile_picture', {
          uri: imageUri,
          name: profileImage.fileName || `profile-picture.${extension}`,
          type: profileImage.mimeType || (extension === 'png' ? 'image/png' : 'image/jpeg'),
        });

        requestPayload = formData;
        requestHeaders['Content-Type'] = 'multipart/form-data';
      }

      const response = await axiosInstance.post('rider/profile/update', requestPayload, {
        headers: requestHeaders,
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
      // console.error(
      //   '[HomeContext] rider/profile update error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchRiderDocuments = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/document-list', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to load rider documents.');
      }

      const documents = Array.isArray(response.data?.data?.documents)
        ? response.data.data.documents
        : [];
      setRiderDocuments(documents);
      return documents;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/document-list error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const fetchNonDeliveryReasons = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.get('rider/non-delivery-reason-list', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/non-delivery-reason-list response:', response.data);

      const responseData = response.data || {};
      const reasons = Array.isArray(responseData.data) ? responseData.data : [];
      const requestSucceeded =
        responseData.success === true ||
        responseData.success === 'true' ||
        reasons.length > 0;

      console.log('[HomeContext] non-delivery reason API success value:', responseData.success);

      if (!requestSucceeded) {
        throw new Error(response.data?.message || 'Unable to load non-delivery reasons.');
      }

      console.log('[HomeContext] non-delivery reasons parsed:', reasons);
      setNonDeliveryReasons(reasons);
      return reasons;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/non-delivery-reason-list error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const cancelRiderDelivery = useCallback(async ({ orderId, reasonId, remarks = '' }) => {
    if (!orderId || !reasonId) {
      throw new Error('Order ID and non-delivery reason are required.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/cancel-deliver', null, {
        params: {
          order_id: orderId,
          reason_id: reasonId,
          remarks,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/cancel-deliver response:', response.data);

      const responseData = response.data || {};
      const successMessage = String(responseData.message || '').toLowerCase();
      const requestSucceeded =
        responseData.success === true ||
        responseData.success === 'true' ||
        responseData.status === true ||
        responseData.status === 'true' ||
        successMessage.includes('successfully');

      if (!requestSucceeded) {
        throw new Error(response.data?.message || 'Unable to submit non-delivery report.');
      }

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/cancel-deliver error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, []);

  const rescheduleRiderOrder = useCallback(async ({
    orderId,
    requestedDeliveryDate,
    requestedDeliveryTime,
    reason,
  }) => {
    if (!orderId || !requestedDeliveryDate || !requestedDeliveryTime || !reason) {
      throw new Error('Order ID, date, time, and reschedule reason are required.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axiosInstance.post('rider/reschedule-order', null, {
        params: {
          order_id: orderId,
          requested_delivery_date: requestedDeliveryDate,
          requested_delivery_time: requestedDeliveryTime,
          reason,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log('[HomeContext] rider/reschedule-order response:', response.data);

      const responseData = response.data || {};
      const successMessage = String(responseData.message || '').toLowerCase();
      const requestSucceeded =
        responseData.success === true ||
        responseData.success === 'true' ||
        responseData.status === true ||
        responseData.status === 'true' ||
        successMessage.includes('successfully');

      if (!requestSucceeded) {
        throw new Error(responseData.message || 'Unable to reschedule delivery.');
      }

      return responseData;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/reschedule-order error:',
      //   error.response?.data || error.message
      // );
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

      await fetchRiderDocuments();

      return response.data;
    } catch (error) {
      // console.error(
      //   '[HomeContext] rider/upload-document error:',
      //   error.response?.data || error.message
      // );
      throw error;
    }
  }, [fetchRiderDocuments]);

  return (
    <HomeContext.Provider
      value={{
        fetchRiderOrders,
        fetchRiderOrderById,
        fetchRiderOrderPaymentDetails,
        fetchRiderWalletLedger,
        submitRiderCod,
        fetchRiderWalletBalance,
        makeRiderWithdrawalRequest,
        collectRiderCod,
        createRiderBillDeskPayment,
        fetchRiderEarnings,
        fetchRiderTodaysEarnings,
        fetchRiderTripDetails,
        acceptRiderOrder,
        updateRiderOrderStatus,
        fetchRiderProfile,
        fetchRiderDocuments,
        fetchNonDeliveryReasons,
        cancelRiderDelivery,
        rescheduleRiderOrder,
        updateRiderProfile,
        uploadRiderDocument,
        riderOrders,
        riderProfile,
        riderDocuments,
        nonDeliveryReasons,
        walletBalance,
        todayEarnings,
        todayDelivered,
        earningsByPeriod,
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
