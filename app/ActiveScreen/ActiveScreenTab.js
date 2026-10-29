import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import ActiveScreen from './ActiveScreen';
import DeactivateScreen from './DeactivateScreen';
import styles from './styles/styles';

const ActiveScreenTab = () => {
  const [selectedTab, setSelectedTab] = useState('active');

  return (
    <View style={styles.tabScreen}>
      <View style={styles.statusTabs}>
        {[
          ['active', 'Active'],
          ['deactive', 'Deactive'],
        ].map(([key, label]) => (
          <Pressable
            key={key}
            style={[
              styles.statusTab,
              selectedTab === key && styles.selectedStatusTab,
            ]}
            onPress={() => setSelectedTab(key)}
          >
            <Text
              style={[
                styles.statusTabText,
                selectedTab === key && styles.selectedStatusTabText,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.tabContent}>
        {selectedTab === 'active' ? (
          <ActiveScreen />
        ) : (
          <DeactivateScreen />
        )}
      </View>
    </View>
  );
};

export default ActiveScreenTab;