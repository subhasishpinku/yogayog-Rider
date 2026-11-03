
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCATION_TASK_NAME = 'YOGAYOG_BACKGROUND_LOCATION';
export const LAST_BACKGROUND_LOCATION_KEY = 'YOGAYOG_LAST_BACKGROUND_LOCATION';
export const BACKGROUND_LOCATION_HISTORY_KEY = 'YOGAYOG_BACKGROUND_LOCATION_HISTORY';

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
    timeInterval: 5000,
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
