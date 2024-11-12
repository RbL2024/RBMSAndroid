// useConnection.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const useConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        setConnectionStatus('Internet is connected');
        
        // Check server connection
        try {
          // const response = await axios.get('http://192.168.1.10:8917/rbmsa/check-connection');
          const response = await axios.get('https://rbms-backend-g216.onrender.com/rbmsa/check-connection');
          setServerStatus(`Server is reachable: ${response.data.message}`);
          setIsConnected(true);
        } catch (error) {
          setServerStatus('Server is not reachable');
          console.error('Error checking server connection:', error);
          setIsConnected(false);
        }
      } else {
        setConnectionStatus('No internet connection');
        setServerStatus('');
        setIsConnected(false);
      }
    };

    checkConnection();

    // Optional: Set up a listener for changes in connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setConnectionStatus('Internet is connected');
      } else {
        setConnectionStatus('No internet connection');
        setServerStatus('');
        setIsConnected(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { connectionStatus, serverStatus, isConnected };
};

export default useConnection;