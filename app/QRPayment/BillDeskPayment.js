import React, { useMemo, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';

const BillDeskPayment = ({ route, navigation }) => {
  const { billdesk } = route.params || {};
  const [loading, setLoading] = useState(true);

  const redirect = billdesk?.links?.find(
    item => item.rel === 'redirect'
  );

  const paymentSource = useMemo(() => {
    if (!redirect?.href || !redirect?.parameters) {
      return null;
    }

    const body = Object.entries(redirect.parameters)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    return {
      uri: redirect.href,
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: redirect.headers?.authorization,
      },
    };
  }, [redirect]);

  if (!paymentSource || !paymentSource.headers.authorization) {
    return (
      <View style={styles.center}>
        <Text>Invalid BillDesk payment details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFC800" />
          <Text style={styles.loadingText}>
            Loading BillDesk Payment...
          </Text>
        </View>
      )}

      <WebView
        source={paymentSource}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        onHttpError={event => {
          console.log('Payment HTTP error:', event.nativeEvent.statusCode);
        }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#333333',
  },
});

export default BillDeskPayment;