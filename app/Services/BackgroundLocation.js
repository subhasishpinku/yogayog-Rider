
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'YOGAYOG_BACKGROUND_LOCATION';

// Must be defined at module scope, not inside a component.
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log('Background location error:', error.message);
    return;
  }

  if (data?.locations?.length) {
    const location = data.locations[data.locations.length - 1];

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    console.log('Background Latitude:', latitude);
    console.log('Background Longitude:', longitude);

    // TODO: Send latitude and longitude to your rider location API.
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
