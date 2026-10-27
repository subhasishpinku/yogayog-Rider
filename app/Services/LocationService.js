
import * as Location from 'expo-location';

export async function startLiveLocation(onLocationUpdate) {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
    },
    (location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      onLocationUpdate(latitude, longitude);
    }
  );

  return subscription;
}
