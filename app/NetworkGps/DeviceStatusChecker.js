
import { useCallback, useEffect } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import navigationStrings from '../constants/navigationStrings';

const DeviceStatusChecker = ({ navigationRef }) => {

  const checkDeviceStatus = useCallback(async () => {
    try {
      if (!navigationRef?.isReady()) return;

      const navigation = navigationRef;
      const currentRouteName = navigation.getCurrentRoute()?.name;

      // Network Check
      const network = await Network.getNetworkStateAsync();
      const networkUnavailable =
        !network.isConnected || network.isInternetReachable === false;

      if (networkUnavailable) {
        if (currentRouteName !== navigationStrings.NETWORKSCREEN) {
          navigation.navigate(navigationStrings.NETWORKSCREEN);
        }
        Alert.alert(
          'Internet Disconnected',
          'Please turn ON your internet connection.'
        );
        return;
      }

      if (currentRouteName === navigationStrings.NETWORKSCREEN) {
        navigation.goBack();
      }

      // GPS Check
      const gpsEnabled =
        await Location.hasServicesEnabledAsync();

      if (!gpsEnabled) {
        if (currentRouteName !== navigationStrings.GPSSCREEN) {
          navigation.navigate(navigationStrings.GPSSCREEN);
        }
        Alert.alert(
          'GPS Disabled',
          'Please turn ON your GPS.',
          [
            { text: 'Cancel' },
            {
              text: 'Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      if (currentRouteName === navigationStrings.GPSSCREEN) {
        navigation.goBack();
      }

    } catch (error) {
      console.log('Device status error:', error);
    }
  }, [navigationRef]);

  useEffect(() => {
    checkDeviceStatus();

    // Network listener
    const networkSubscription =
      Network.addNetworkStateListener(state => {
        if (
          !state.isConnected ||
          state.isInternetReachable === false
        ) {
          const currentRouteName = navigationRef?.getCurrentRoute()?.name;
          if (navigationRef?.isReady() && currentRouteName !== navigationStrings.NETWORKSCREEN) {
            navigationRef.navigate(navigationStrings.NETWORKSCREEN);
          }
          Alert.alert(
            'Network OFF',
            'Please check your internet connection.'
          );
        }
      });

    // App foreground listener
    const appSubscription = AppState.addEventListener(
      'change',
      state => {
        if (state === 'active') {
          checkDeviceStatus();
        }
      }
    );

    return () => {
      networkSubscription.remove();
      appSubscription.remove();
    };
  }, [checkDeviceStatus, navigationRef]);

  return null;
};

export default DeviceStatusChecker;
