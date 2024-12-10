import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RDim from '@/hooks/useDimensions';
const ForgotPasswordScreen = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('newpass'); // Replace 'ForgetPass' with your screen name in the navigation setup
    };

     const userEmail = "na***17@gmail.com"; // Replace with dynamic email if available

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior for iOS and Android
    >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>

      <Text style={styles.notification}>
            A verification code has been sent to <Text style={styles.email}>{userEmail}</Text>. 
            Please check your email to verify your account.
      </Text>
      

      {/* Input and button section */}
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Verification code:</Text>
          <TextInput 
           style={styles.input}
            placeholder="Enter your verification code"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric" // Ensures only numbers are shown on the keyboard
            maxLength={6} // Limits input to 6 digits
            onChangeText={(text) => {
            // Optional: Allow only numbers
            if (!/^\d*$/.test(text)) {
                return; // Prevent invalid input
            }
            }}
        />
        </View>

        <View style={styles.aha}>
            <TouchableOpacity style={styles.btns} onPress={handlePress}>
                <Text style={styles.btnText}>Verify</Text>
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
email: {
    fontWeight: 'bold',
    color: '#000', // Highlighted email color
},
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginTop: -120,
    
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
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
