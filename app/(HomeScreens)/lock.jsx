import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function Lock() {
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);  // Default off
  const [isSmartLockDisabled, setIsSmartLockDisabled] = useState(false);     // Default off
  const [isAlarmDisabled, setIsAlarmDisabled] = useState(false);             // Default off
  const [modalVisible, setModalVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [currentToggle, setCurrentToggle] = useState(null); // Track which toggle is being confirmed
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);


  // Handle Bluetooth toggle
  const handleBluetoothToggle = (value) => {
    if (!value) {
      setWarningMessage('Warning: Are you sure you want to disconnect your Bluetooth?');
      setCurrentToggle('bluetooth');
      setModalVisible(true);
    } else {
      setIsBluetoothConnected(true);
    }
  };

  // Handle Smart Lock toggle
  const handleSmartLockToggle = (value) => {
    if (!value) {
      setWarningMessage('Warning: Are you sure you want to disable the Smart Lock?');
      setCurrentToggle('smartLock');
      setModalVisible(true);
    } else {
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
      setIsAlarmDisabled(false);
    } else if (currentToggle === 'smartLock') {
      // If confirmed, disable smart lock
      setIsSmartLockDisabled(false);
    }
    setCurrentToggle(null);
  };

  // Cancel the action in the modal
  const handleCancel = () => {
    setModalVisible(false);
    if (currentToggle === 'smartLock') {
      // If canceled, re-enable smart lock
      setIsSmartLockDisabled(true);
    }
    setCurrentToggle(null); // Reset the toggle
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
      {/* Bluetooth Toggle */}
      <View style={[styles.optionContainer, !isBluetoothConnected && styles.disabledOption]}>
        <MaterialCommunityIcons
          name={isBluetoothConnected ? "bluetooth-connect" : "bluetooth-off"}
          size={30}
          color={isBluetoothConnected ? "#4CAF50" : "#F44336"}
          style={styles.icon}
        />
        <Text style={styles.optionText}>
          {isBluetoothConnected ? "Connected to Bluetooth" : "Connect to Bluetooth"}
        </Text>
        <Switch
          value={isBluetoothConnected}
          onValueChange={handleBluetoothToggle}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isBluetoothConnected ? "#FFFFFF" : "#FFFFFF"}
        />
      </View>

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
          disabled={!isBluetoothConnected}
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
          disabled={!isBluetoothConnected}
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
