
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../contexts/axiosInstance';

export const LOCATION_TASK_NAME = 'YOGAYOG_BACKGROUND_LOCATION';
export const LAST_BACKGROUND_LOCATION_KEY = 'YOGAYOG_LAST_BACKGROUND_LOCATION';
export const BACKGROUND_LOCATION_HISTORY_KEY = 'YOGAYOG_BACKGROUND_LOCATION_HISTORY';
export const LIVE_LOCATION_ORDER_ID_KEY = 'YOGAYOG_LIVE_LOCATION_ORDER_ID';
export const LIVE_LOCATION_FLAG_KEY = 'YOGAYOG_LIVE_LOCATION_FLAG';

// Must be defined at module scope, not inside a component.
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log('Background location error:', error.message);
    return;
  }

  try {
    if (data?.locations?.length) {
    const location = data.locations[data.locations.length - 1];

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const point = {
      latitude,
      longitude,
      timestamp: location.timestamp || Date.now(),
    };

    const existingHistory = await AsyncStorage.getItem(BACKGROUND_LOCATION_HISTORY_KEY);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    const nextHistory = [...(Array.isArray(history) ? history : []), point].slice(-200);

    await Promise.all([
      AsyncStorage.setItem(LAST_BACKGROUND_LOCATION_KEY, JSON.stringify(point)),
      AsyncStorage.setItem(BACKGROUND_LOCATION_HISTORY_KEY, JSON.stringify(nextHistory)),
    ]);

    const [liveLocationOrderId, liveLocationFlag, token] = await Promise.all([
      AsyncStorage.getItem(LIVE_LOCATION_ORDER_ID_KEY),
      AsyncStorage.getItem(LIVE_LOCATION_FLAG_KEY),
      AsyncStorage.getItem('authToken'),
    ]);

    if (liveLocationOrderId && ['start', 'on_the_way'].includes(liveLocationFlag)) {
      try {
        const response = await axiosInstance.post('rider/update-live-location', null, {
          params: {
            order_id: liveLocationOrderId,
            lat: latitude,
            lon: longitude,
            flag: liveLocationFlag,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
     console.log('live location update called with Bg:', { liveLocationOrderId, latitude, longitude, liveLocationFlag });

        console.log('[BackgroundLocation] live location API updated:', {
          orderId: liveLocationOrderId,
          latitude,
          longitude,
          flag: liveLocationFlag,
          response: response.data,
        });
      } catch (locationApiError) {
        console.error(
          '[BackgroundLocation] live location API error:',
          locationApiError.response?.data || locationApiError.message
        );
      }
    }

    console.log('Background Latitude:', latitude);
    console.log('Background Longitude:', longitude);
    console.log('Background location trail points:', nextHistory.length);
    }
  } catch (taskError) {
    console.error('Background location persistence error:', taskError.message);
  }
});

export async function startBackgroundLocation() {
  const foreground = await Location.requestForegroundPermissionsAsync();

  if (foreground.status !== 'granted') {
    throw new Error('Foreground location permission denied');
  }

  const background = await Location.requestBackgroundPermissionsAsync();

  if (background.status !== 'granted') {
    throw new Error('Background location permission denied');
  }

  const isAvailable = await TaskManager.isAvailableAsync();

  if (!isAvailable) {
    throw new Error('Background tasks are not available');
  }

  const alreadyStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (alreadyStarted) {
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 300000,
    distanceInterval: 5,
    pausesUpdatesAutomatically: false,
    foregroundService: {
      notificationTitle: 'YogaYog Rider',
      notificationBody: 'Your delivery location is being tracked.',
      notificationColor: '#2196F3',
    },
  });
}

export async function stopBackgroundLocation() {
  const started =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (started) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}
