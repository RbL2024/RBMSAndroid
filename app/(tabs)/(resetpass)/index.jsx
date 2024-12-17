import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RDim from '@/hooks/useDimensions';
import { FontAwesome as FA } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetPassword } from '@/hooks/myAPI';
import axios from 'axios';

const index = () => {
  const navigation = useNavigation();

  const [currPass, setCurrPass] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false); // State to toggle password visibility

  const [userId, setUserId] = React.useState(null);


  const saveNewPass = async () => {
    const newPass = {
      password: password,
    }
    try {
      const response = await axios.put(`${resetPassword}/${userId}`, newPass);
      Alert.alert(
        'Success!',
        `${response.data.message}`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate('account')
            } 
          }
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to change password')
    }
  }


  const handlePress = () => {
    if (currPass === '' || password === '' || cPassword === '') {
      Alert.alert(
        "Error!!",
        "Please fill in all fields",
      )
      return
    }
    if (password !== cPassword) {
      Alert.alert(
        "Error!!",
        "Passwords do not match",
      )
      return
    }

    Alert.alert(
      "Confirm Password Change",
      "Are you sure you want to save the new password?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            saveNewPass();
          } 
        }
      ]
    );
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('id'); // Replace 'userId' with your key
        if (id !== null) {
          setUserId(id); // Set the retrieved ID to state
        }
      } catch (error) {
        console.error('Error retrieving ID from AsyncStorage:', error);
      }
    };

    fetchUserId();
    console.log(userId);
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.notification}>
        Please enter your current password and new password to change your password.
      </Text>

      {/* Input and button section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showCurrPass} // Toggle secureTextEntry based on showPassword state
                value={currPass}
                onChangeText={setCurrPass}

              />
              <TouchableOpacity
                style={styles.iconContainer} // Added style to position the icon
                onPress={() => setShowCurrPass((prevState) => !prevState)}
              >
                <FA name={showCurrPass ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
                value={password}
                onChangeText={(Text) => setPassword(Text)}
              />
              <TouchableOpacity
                style={styles.iconContainer} // Added style to position the icon
                onPress={() => setShowPassword((prevState) => !prevState)}
              >
                <FA name={showPassword ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Re-type your new password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showCPassword} // Toggle secureTextEntry based on showPassword state
                value={cPassword}
                onChangeText={(Text) => setCPassword(Text)}
              />
              <TouchableOpacity
                style={styles.iconContainer} // Added style to position the icon
                onPress={() => setShowCPassword((prevState) => !prevState)}
              >
                <FA name={showCPassword ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.aha}>
            <TouchableOpacity style={styles.btns} onPress={handlePress}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e5d7', // Background color similar to the design
    paddingHorizontal: 10,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 60, // Add space from the top of the screen
    marginBottom: 40, // Add space between title and form
    textAlign: 'center',
  },
  notification: {
    fontSize: 18,
    color: '#555',
    justifyContent: 'center',
    marginBottom: 30, // Add space between the message and input field
    alignItems: 'center',
    width: '100%',
    textAlign: 'justify',
    paddingHorizontal: 20,

  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally

  },
  inputContainer: {
    width: '90%', // Adjust the width of the input container to control layout
    maxWidth: 400, // Set a max width for larger screens
    marginBottom: 20,

  },
  label: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
    textAlign: 'left', // Align label to the left inside the container
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#000',
    paddingRight: 40
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative' // Align the icon and input field in a row
  },
  iconContainer: {
    position: 'absolute',
    right: 0, // Position the icon to the right inside the input
    // top: '50%',
    // gap: 10,
    // transform: [{ translateY: -RDim.scale * 4 }], // Center the icon vertically in the input
    // backgroundColor: 'red',
    padding: 12
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btns: {
    backgroundColor: '#355E3B', // Green button color
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default index;
