import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const RedirectWebView = ({ redirectUrl }) => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: redirectUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="#0000ff"
            size="large"
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          />
        )}
        onNavigationStateChange={(navState) => {
          // Handle navigation state changes if necessary
          console.log(navState);
        }}
      />
    </View>
  );
};

export default RedirectWebView;