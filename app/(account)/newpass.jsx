import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RDim from '@/hooks/useDimensions';
import { FontAwesome as FA } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';


const newpass = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {email} = route.params;
    console.log(email);

    useEffect(() => {
      // Disable the back button
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Optionally show a confirmation dialog
        Alert.alert(
          'Are you sure you want to leave this screen?',
          'You will lose any unsaved changes.',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            { text: 'Leave', style: 'destructive', onPress: () => navigation.navigate('account')},
          ]
        );
      });
  
      return unsubscribe; // Cleanup the listener on unmount
    }, [navigation]);


    const handlePress = () => {
        navigation.navigate('login'); // Replace 'ForgetPass' with your screen name in the navigation setup
    };

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showCPassword, setShowCPassword] = useState(false);
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Password</Text>

      <Text style={styles.notification}>
            Please enter your newpassword to reset your current password.
            
      </Text>

      {/* Input and button section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              />
              <TouchableOpacity
                style={styles.iconContainer} // Added style to position the icon
                onPress={()=>setShowPassword((prevState)=>!prevState)}
              >
                <FA name={showPassword ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showCPassword} // Toggle secureTextEntry based on showPassword state
              />
              <TouchableOpacity
                style={styles.iconContainer} // Added style to position the icon
                onPress={()=>setShowCPassword((prevState)=>!prevState)}
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
    padding: 12, // Center the icon vertically in the input
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

export default newpass;
