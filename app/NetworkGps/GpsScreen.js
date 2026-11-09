import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const GpsScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.title}>GPS Required</Text>
      <Text style={styles.message}>Please turn ON GPS/location services to continue.</Text>
      <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
        <Text style={styles.buttonText}>Open GPS Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#111113' },
  icon: { fontSize: 52 },
  title: { marginTop: 18, color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  message: { marginTop: 10, color: '#B8B8C2', fontSize: 15, textAlign: 'center' },
  button: { marginTop: 24, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F4C542' },
  buttonText: { color: '#111113', fontSize: 14, fontWeight: '800' },
});

export default GpsScreen;
