import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from './axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(Boolean(token));
      } catch (error) {
        console.error('[AuthContext] restore session error:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const sendOtp = useCallback(async (mobile) => {
    const normalizedMobile = String(mobile || '').replace(/\D/g, '');

    if (normalizedMobile.length !== 10) {
      const message = 'Please enter a valid 10-digit mobile number.';
      setAuthError(message);
      throw new Error(message);
    }

    setIsSendingOtp(true);
    setAuthError('');

    try {
      const response = await axiosInstance.post('auth/send-otp', {
        login_as: 'rider',
        mobile: normalizedMobile,
      });

      console.log('[AuthContext] send-otp response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to send OTP.');
      }

      return response.data;
    } catch (error) {
      console.error(
        '[AuthContext] send-otp error:',
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to send OTP. Please try again.';

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsSendingOtp(false);
    }
  }, []);

  const verifyOtp = useCallback(async (mobile, otp) => {
    const normalizedMobile = String(mobile || '').replace(/\D/g, '');
    const normalizedOtp = String(otp || '').replace(/\D/g, '');

    if (normalizedMobile.length !== 10 || normalizedOtp.length !== 4) {
      const message = 'Please enter a valid mobile number and 4-digit OTP.';
      setAuthError(message);
      throw new Error(message);
    }

    setIsVerifyingOtp(true);
    setAuthError('');

    try {
      const response = await axiosInstance.post('auth/verify-otp', {
        login_as: 'rider',
        mobile: normalizedMobile,
        otp: normalizedOtp,
      });

      console.log('[AuthContext] verify-otp response:', response.data);

      if (!response.data?.success || !response.data?.token) {
        throw new Error(response.data?.message || 'OTP verification failed.');
      }

      await AsyncStorage.multiSet([
        ['authToken', response.data.token],
        ['authUser', JSON.stringify(response.data.user || {})],
      ]);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      console.error(
        '[AuthContext] verify-otp error:',
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        'OTP verification failed. Please try again.';

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  }, []);

  const sendEmailOtp = useCallback(async (email, name) => {
    setIsSendingEmailOtp(true);
    setAuthError('');

    try {
      const response = await axiosInstance.post('mail/send-otp', {
        email: email.trim(),
        name: name.trim(),
      });

      console.log('[AuthContext] mail/send-otp response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Unable to send email OTP.');
      }

      return response.data;
    } catch (error) {
      console.error(
        '[AuthContext] mail/send-otp error:',
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to send email OTP. Please try again.';

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsSendingEmailOtp(false);
    }
  }, []);

  const verifyEmailOtp = useCallback(async (email, otp) => {
    setIsVerifyingEmailOtp(true);
    setAuthError('');

    try {
      const response = await axiosInstance.post('mail/verify-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });

      console.log('[AuthContext] mail/verify-otp response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Email verification failed.');
      }

      return response.data;
    } catch (error) {
      console.error(
        '[AuthContext] mail/verify-otp error:',
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        'Email verification failed. Please try again.';

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  }, []);

  const registerRider = useCallback(async (payload) => {
    setIsRegistering(true);
    setAuthError('');

    try {
      const formData = new FormData();
      const fileFields = ['profile_pic', 'dl_pic', 'pan_pic', 'aadaar_pic'];

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;

        if (fileFields.includes(key)) {
          const uri = String(value);
          const extension = uri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
          const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

          formData.append(key, {
            uri,
            name: `${key}.${extension}`,
            type: mimeType,
          });
          return;
        }

        formData.append(key, String(value));
      });

      const response = await axiosInstance.post('auth/register-rider', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[AuthContext] auth/register-rider response:', response.data);

      if (!response.data?.success || !response.data?.token) {
        throw new Error(response.data?.message || 'Registration failed.');
      }

      await AsyncStorage.multiSet([
        ['authToken', response.data.token],
        ['authUser', JSON.stringify(response.data.user || {})],
      ]);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      console.error(
        '[AuthContext] register-rider error:',
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const token = await AsyncStorage.getItem('authToken');
    setIsLoggingOut(true);

    try {
      if (token) {
        const response = await axiosInstance.post('logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('[AuthContext] logout response:', response.data);
      }
    } catch (error) {
      console.error(
        '[AuthContext] logout error:',
        error.response?.data || error.message
      );
    } finally {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      setIsAuthenticated(false);
      setAuthError('');
      setIsLoggingOut(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authError,
        isAuthenticated,
        isAuthLoading,
        isLoggingOut,
        isRegistering,
        isSendingEmailOtp,
        isSendingOtp,
        isVerifyingEmailOtp,
        isVerifyingOtp,
        logout,
        registerRider,
        sendEmailOtp,
        sendOtp,
        verifyEmailOtp,
        verifyOtp,
        clearAuthError: () => setAuthError(''),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};

export default AuthProvider;
