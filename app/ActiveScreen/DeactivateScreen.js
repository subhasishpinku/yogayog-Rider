import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles/styles';

const DeactivateScreen = () => {
  return (
    <View style={styles.deactivateScreen}>
      <Text style={styles.deactivateTitle}>Deactive</Text>
      <Text style={styles.deactivateText}>No inactive deliveries available.</Text>
    </View>
  );
};

export default DeactivateScreen;
