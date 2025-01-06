import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Modal, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Network from 'expo-network';
import ToastManager, { Toast } from 'toastify-react-native';
import axios from 'axios';
import { getRentedBikeReserve, getRented, updateLockstate, updateAlarmstate, updateTempLockstate, updateTempAlarmstate } from '@/hooks/myAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function Lock() {
  const navigation = useNavigation();
  const [isWifiConnected, setIsWifiConnected] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false); 
  const [isSmartLockDisabled, setIsSmartLockDisabled] = useState();     
  const [isAlarmDisabled, setIsAlarmDisabled] = useState(false);            
  const [modalVisible, setModalVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [currentToggle, setCurrentToggle] = useState(null); 


  const [bikeID, setBikeID] = useState(null);

  const handleESP = async (lockState, alarmState) => {
    try {
      const bID = await AsyncStorage.getItem('bike_id');
      const email = await AsyncStorage.getItem('email');
      if (bID && email) {
        const data = {
          bid: bID,
          email: email,
          lockState: lockState,
          alarmState: alarmState
        };
  
        console.log('Sending data:', data); 
  
        const response = await axios.post('http://192.168.100.189:80/post-message', data, {
          headers: {
            'Content-Type': 'application/json',  // Correct content type
          },
        });
  
        console.log('Server Response:', response.data); // Log the server response
        
      } else {
        console.error('Missing bike_id or email');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response.data,
        [{ text: 'OK', onPress: () => navigation.navigate('index') }],
        { cancelable: false }
      );
      // if (error.response) {
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.error('Error response data:', error.response.data);
      //   console.error('Error response status:', error.response.status);
      //   console.error('Error response headers:', error.response.headers);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.error('Error message:', error.message);
        
      // }
    }
  };

  useEffect(() => {
    const initials = async () => {
      try {
        const bID = await AsyncStorage.getItem('bike_id');
        const email = await AsyncStorage.getItem('email');
        const isTempValue = await AsyncStorage.getItem('isTemp');
        const isTemp = JSON.parse(isTempValue);

        setBikeID(bID);
        if (bID && email && isTemp) {
          const data = { bID: bID, email: email };
          const getRBR = await axios.get(`${getRented}/${data.email}/${data.bID}`);
          const lState = getRBR.data.records[0].lockState
          const aState = getRBR.data.records[0].alarmState
          setIsSmartLockDisabled(lState);
          setIsAlarmDisabled(aState); 
          handleESP(lState, aState);
        } else {
          const data = { bID: bID, email: email };
          const getRBR = await axios.get(`${getRentedBikeReserve}/${data.email}/${data.bID}`);
          const lState = getRBR.data.records[0].lockState
          const aState = getRBR.data.records[0].alarmState
          setIsSmartLockDisabled(lState); 
          setIsAlarmDisabled(aState); 
          handleESP(lState, aState);
        }
      } catch (error) {
        Alert.alert(
          'Error', 
          'You dont have any bike rented',
          [{ text: 'OK', onPress: () => navigation.navigate('index') }],
          { cancelable: false }
        );
      }
    }
    initials();
  }, [])

  const updateLockState = async (state) => {
    try {
      const bID = await AsyncStorage.getItem('bike_id');
      const email = await AsyncStorage.getItem('email');
      const isTempValue = await AsyncStorage.getItem('isTemp');
      const isTemp = JSON.parse(isTempValue);

      if (bID && email && isTemp) {
        const data = { bike_id: bID, email: email, lockState: state };
        // console.log(data)
        const updateLS = await axios.put(updateTempLockstate, data)
        // console.log(updateLS.data);
      } else {
        const data = { bike_id: bID, email: email, lockState: state };
        // console.log(data)
        const updateLS = await axios.put(updateLockstate, data)
        // console.log(updateLS.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const updateAlarmState = async (state) => {
    try {
      const bID = await AsyncStorage.getItem('bike_id');
      const email = await AsyncStorage.getItem('email');
      const isTempValue = await AsyncStorage.getItem('isTemp');
      const isTemp = JSON.parse(isTempValue);

      if (bID && email && isTemp) {
        const data = { bike_id: bID, email: email, alarmState: state };
        // console.log(data)
        const updateLS = await axios.put(updateTempAlarmstate, data)
        // console.log(updateLS.data);
      }else{
        const data = { bike_id: bID, email: email, alarmState: state };
        // console.log(data)
        const updateLS = await axios.put(updateAlarmstate, data)
        // console.log(updateLS.data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const isConnectedToWifi = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.type === Network.NetworkStateType.WIFI;
  };

  const openWifiSettings = async () => {
    try {
      const connected = await isConnectedToWifi();
      if (connected) {
        Toast.info('Please connect to \"RBMS\" Wi-Fi network.');
      } else {
        Toast.info('Please connect to \"RBMS" Wi-Fi network.');
      }
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS);
    } catch (error) {
      console.error("Error opening Wi-Fi settings: ", error);
    }
  };

  // Handle Smart Lock toggle
  const handleSmartLockToggle = (value) => {
    if (!value) {
      setWarningMessage('Warning: Are you sure you want to disable the Smart Lock?');
      setCurrentToggle('smartLock');
      setModalVisible(true);
    } else {
      handleESP(true, isAlarmDisabled)
      updateLockState(true);
      setIsSmartLockDisabled(true);
    }
  };

  // Handle Alarm toggle
  const handleAlarmToggle = (value) => {
    if (!value) {
      setWarningMessage('Warning: Are you sure you want to disable the alarm?');
      setCurrentToggle('alarm');
      setModalVisible(true);
    } else {
      handleESP(isSmartLockDisabled, true)
      updateAlarmState(true)
      setIsAlarmDisabled(true);
    }
  };

  // Confirm the action in the modal
  const handleConfirm = () => {
    setModalVisible(false);
    if (currentToggle === 'bluetooth') {
      setIsBluetoothConnected(false);
      setIsSmartLockDisabled(false);
      setIsAlarmDisabled(false);
    } else if (currentToggle === 'alarm') {
      handleESP(isSmartLockDisabled, false)
      updateAlarmState(false)
      setIsAlarmDisabled(false);
    } else if (currentToggle === 'smartLock') {
      // If confirmed, disable smart lock
      handleESP(false, isAlarmDisabled)
      updateLockState(false);
      updateAlarmState(false)
      setIsAlarmDisabled(false);
      setIsSmartLockDisabled(false);
    }
    setCurrentToggle(null);
  };

  // Cancel the action in the modal
  const handleCancel = () => {
    setModalVisible(false);
    setCurrentToggle(null); 
  };



  // Automatically turn on the smart lock after 10 seconds if Bluetooth is connected and smart lock is off
  useEffect(() => {
    if (isBluetoothConnected && !isSmartLockDisabled) {
      const timer = setTimeout(() => {
        setIsSmartLockDisabled(true); // Automatically enable the smart lock after 10 seconds
      }, 10000); // 10 seconds

      // Cleanup timeout on component unmount or if conditions change
      return () => clearTimeout(timer);
    }
  }, [isBluetoothConnected, isSmartLockDisabled]); // Re-run when Bluetooth or Smart Lock state changes

  return (
    <LinearGradient
      colors={["#355E3B", "#D6D6CA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.35 }}
      style={styles.container}
    >
      <ToastManager
        position="top"
        textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
        duration={2000}
        showCloseIcon={false}
        showProgressBar={false}
      />
      <TouchableOpacity onPress={openWifiSettings}>
        <View style={[styles.optionContainer, !isWifiConnected && styles.disabledOption]}>
          <Text style={[styles.optionText, { textAlign: 'center' }]}>
            {`Click and Find ${bikeID} Wifi then Connect`}
          </Text>
        </View>
      </TouchableOpacity>
      

      {/* Smart Lock Toggle */}
      <View style={[styles.optionContainer, !isSmartLockDisabled && styles.disabledOption]}>
        <FontAwesome
          name={isSmartLockDisabled ? "lock" : "unlock"}
          size={30}
          color={isSmartLockDisabled ? "#4CAF50" : "#F44336"}
          style={styles.icon}
        />
        <Text style={styles.optionText}>
          {isSmartLockDisabled ? "Disable the Smart Lock" : "Enable the Smart Lock"}
        </Text>
        <Switch
          value={isSmartLockDisabled}
          onValueChange={handleSmartLockToggle}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isSmartLockDisabled ? "#FFFFFF" : "#FFFFFF"}
        // disabled={!isBluetoothConnected}
        />
      </View>

      {/* Alarm Toggle */}
      <View style={[styles.optionContainer, !isAlarmDisabled && styles.disabledOption]}>
        <MaterialIcons
          name={isAlarmDisabled ? "sensors" : "sensors-off"}
          size={30}
          color={isAlarmDisabled ? "#4CAF50" : "#F44336"}
          style={styles.icon}
        />
        <Text style={styles.optionText}>
          {isAlarmDisabled ? "Disable the alarm" : "Enable the alarm"}
        </Text>
        <Switch
          value={isAlarmDisabled}
          onValueChange={handleAlarmToggle}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isAlarmDisabled ? "#FFFFFF" : "#FFFFFF"}
        // disabled={!isBluetoothConnected}
        />
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome name="exclamation-triangle" size={40} color="#F44336" style={styles.modalIcon} />
            <Text style={styles.modalText}>{warningMessage}</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: "relative"
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  disabledOption: {
    backgroundColor: '#FBE9E7',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
