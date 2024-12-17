import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RDim from '@/hooks/useDimensions';
import axios from 'axios';
import { emailResetCode } from '@/hooks/myAPI';


function resetCode(length) {
  let result = "";
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const resCode = resetCode(5);
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    navigation.navigate('fpverification', { email: email})
    // if (email === '') {
    //   Alert.alert('Error!!', 'Please enter your email')
    //   return
    // }

    // Alert.alert(
    //   "Code Sent",
    //   `We've send a code please check your email.`,
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         setLoading(true);
    //         emailSent();
    //       }
    //     }
    //   ]
    // )

    // Replace 'ForgetPass' with your screen name in the navigation setup
  };

  const emailSent = async () => {
    const data = {
      email: email,
      code: resCode
    }
    try {
      const response = await axios.post(`${emailResetCode}`, data);
      Alert.alert(
        "Success!!",
        `${response.data.message}`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('fpverification', { email: email, code: resCode })
          }
        ]
      )
    } catch (error) {
      Alert.alert('Error!!', error.message)
    } finally {
      setLoading(false); // Stop loading
    }

  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior for iOS and Android
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot password</Text>

          <Text style={styles.notification}>
            Please enter your email address you used in regitering an account below to reset your password.

          </Text>

          {/* Input and button section */}
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9e9e9e"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.aha}>
              <TouchableOpacity style={styles.btns} onPress={handlePress} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Send code</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    marginTop: -100,
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
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
