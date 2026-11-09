import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const openNetworkSettings = async () => {
  try {
    if (Platform.OS === 'android' && Linking.sendIntent) {
      await Linking.sendIntent('android.settings.WIRELESS_SETTINGS');
      return;
    }

    await Linking.openSettings();
  } catch {
    await Linking.openSettings();
  }
};

const NetworkScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>📶</Text>
      <Text style={styles.title}>Internet Required</Text>
      <Text style={styles.message}>Please turn ON Wi-Fi or mobile data to continue.</Text>
      <Pressable style={styles.button} onPress={openNetworkSettings}>
        <Text style={styles.buttonText}>Open Network Settings</Text>
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

export default NetworkScreen;
