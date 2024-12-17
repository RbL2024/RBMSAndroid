import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import React, { useState } from 'react';
import { FontAwesome as FA } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from 'axios';
import { registerAPI } from '@/hooks/myAPI';

import RDim from '@/hooks/useDimensions';


import bikeLogo from '../../assets/images/bikeLogo.png';
import toc from '@/assets/images/toc.png';

export default function Register() {

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // Format as MM/DD/YYYY
  };


  const [date, setDate] = useState(new Date());

  const [fName, setFName] = useState('');
  const [mName, setMName] = useState('');
  const [lName, setLName] = useState('');

  const [age, setAge] = useState('');
  const [bdate, setBdate] = useState(formatDate(date));
  const [gender, setGender] = useState('Male');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [street, setStreet] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate); // Update the date state
    setBdate(formatDate(selectedDate)); // Format the date and update bdate
  };

  const handleCheckboxPress = () => {
    if (!isChecked) {
      setModalVisible(true);
    } else {
      setIsChecked(false);
    }
  };

  const handleAgree = () => {
    setIsChecked(true);
    setModalVisible(false);

  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^(.*@gmail\.com|.*@yahoo\.com)$/;
    return emailPattern.test(email);
  };
  const isValidPhone = (phone) => {
    const phonePattern = /^\d{11}$/; // Regex to check for exactly 11 digits
    return phonePattern.test(phone);
  };

  const handleSignUp = async () => {
    if (!isChecked) {
      Toast.error('Please accept the terms and conditions');
      return;
    }
    if (areInputsEmpty()) {
      Toast.error("Please fill in all fields."); // Show an error message
      return; // Prevent further action
    }
    if (!isValidEmail(email)) {
      Toast.warn("Error", "Please enter a valid Gmail or Yahoo email address."); // Show an error message
      return; // Prevent further action
    }
    if (!isValidPhone(phone)) { // Check if phone is valid
      Toast.error("Phone number must be 11 digits."); // Show an error message
      return; // Prevent further action
    }
    if (password !== cpassword) {
      Toast.error("Password doesn't match");
      return;
    }

    setLoading(true);

    const data = {
      i_first_name: fName,
      i_middle_name: mName,
      i_last_name: lName,
      i_age: age,
      i_bdate: bdate,
      i_gender: gender,
      i_username: username,
      i_password: password,
      i_city: city,
      i_province: province,
      i_street: street,
      i_postalCode: postalcode,
      i_email: email,
      i_phone: phone,
    }
    try {
      // console.log(data);
      const createAcc = await axios.post(registerAPI, data);
      // console.log('Response from API:', createAcc.data);
      if (createAcc.data.isCreated) {
        Toast.success(createAcc.data.message);
        clearInputs();
      } else {
        Toast.error(createAcc.data.message);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  const clearInputs = () => {
    setFName('');
    setMName('');
    setLName('');
    setAge('');
    setBdate(formatDate(date));
    setGender('Male');
    setUsername('');
    setPassword('');
    setCPassword('');
    setCity('');
    setProvince('');
    setStreet('');
    setPostalcode('');
    setEmail('');
    setPhone('');

  }
  const areInputsEmpty = () => {
    return (
      !fName.trim() ||
      !mName.trim() ||
      !lName.trim() ||
      !age.trim() ||
      !gender.trim() ||
      !username.trim() ||
      !password.trim() ||
      !cpassword.trim() ||
      !city.trim() ||
      !province.trim() ||
      !street.trim() ||
      !postalcode.trim() ||
      !email.trim() ||
      !phone.trim()
    );
  };



  return (
    <View style={styles.container}>
      <ToastManager
        position="top"
        textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
        duration={2000}
        showCloseIcon={false}
        showProgressBar={false}
        width={'auto'}
      />
      <View style={{ alignItems: 'center', marginTop: 35 }}>
        <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * 0.07 }}>Create Your Account</Text>
      </View>
      <ScrollView>
        <View style={styles.form}>
          {/* User Information */}
          <View style={{ alignItems: 'flex-start', marginLeft: 20, marginBottom: 10 }}>
            <Text style={{ fontFamily: 'mplus', fontSize: RDim.width * 0.05, color: 'gray' }}>User Information</Text>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              value={fName}
              onChangeText={setFName}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Middle Name</Text>
            <TextInput
              style={styles.input}
              value={mName}
              onChangeText={setMName}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lName}
              onChangeText={setLName}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge} // Update the state when the text changes
              // Other optional props
              keyboardType="numeric" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Date of birth</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.input}
                value={bdate}
                onChangeText={setBdate} // Update the state when the text changes
                // Other optional props
                keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
                returnKeyType="done" // Change the return key type
                autoCapitalize="none"
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={date}
              />
              <TouchableOpacity onPress={() => showDatePicker()} style={{ position: 'absolute', right: 0, top: 0, padding: 10 }}>
                <FA name='calendar-o' size={RDim.scale * 7} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Gender</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)} // Update the state when the value changes
              style={styles.input} // Use the same styles as the TextInput
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                value={password}
                onChangeText={setPassword} // Update the state when the text changes
                secureTextEntry={!showPassword} // Toggle secure text entry
                keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
                returnKeyType="done" // Change the return key type
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, top: 0, padding: 10 }}>
                <FA name={showPassword ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                value={cpassword}
                onChangeText={setCPassword} // Update the state when the text changes
                secureTextEntry={!showCPassword} // Toggle secure text entry
                keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
                returnKeyType="done" // Change the return key type
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowCPassword(!showCPassword)} style={{ position: 'absolute', right: 0, top: 0, padding: 10 }}>
                <FA name={showCPassword ? 'eye' : 'eye-slash'} size={RDim.scale * 8} color={'#355E3B'} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Address */}
          <View style={{ alignItems: 'flex-start', marginLeft: 20, marginBottom: 10, marginTop: 20 }}>
            <Text style={{ fontFamily: 'mplus', fontSize: RDim.width * 0.05, color: 'gray' }}>Address</Text>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Province</Text>
            <TextInput
              style={styles.input}
              value={province}
              onChangeText={setProvince}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Street Adress</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Postal Code (optional)</Text>
            <TextInput
              style={styles.input}
              value={postalcode}
              onChangeText={setPostalcode}
              keyboardType="numeric" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>


          {/* Contact Informaiton */}
          <View style={{ alignItems: 'flex-start', marginLeft: 20, marginBottom: 10, marginTop: 20 }}>
            <Text style={{ fontFamily: 'mplus', fontSize: RDim.width * 0.05, color: 'gray' }}>Contact Information</Text>
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputCon}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric" // Options: 'default', 'numeric', 'email-address', etc.
              returnKeyType="done" // Change the return key type
              autoCapitalize="none"
            />
          </View>
          <BouncyCheckbox
            size={20}
            fillColor="#355E3B"
            text="I agree to terms & conditions"
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: "mplus" }}
            isChecked={isChecked}
            onPress={handleCheckboxPress}
            style={{ paddingLeft: RDim.width * 0.1, paddingBottom: RDim.height * 0.03 }}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleClose}
          >
            <View style={styles.modalView}>
              <ScrollView >
                <View>
                  <ImageBackground source={toc} style={{ width: RDim.width * 0.2, height: RDim.height * 0.10, alignSelf: 'center' }} />
                </View>
                <Text style={styles.modalText}>
                  Terms and Conditions
                </Text>
                <Text style={styles.termsText}>
                  By using the Rental Bike Management System, you agree to the following terms and conditions:
                </Text>
                <Text style={styles.termsText}>
                  Protection of Personal Information{'\n'}
                  • We are committed to safeguarding your personal information and ensuring that it remains secure. We only collect essential data for providing our services, in accordance with our Privacy Policy.
                  {'\n'}{'\n'}
                  Online Payment and No Cancellation{'\n'}
                  • All bike reservations must be made through the online payment options provided in the app. We do not accept cash payments. Once a reservation is confirmed and paid for, it cannot be canceled, changed, or refunded, so please review your booking details carefully.
                  {'\n'}{'\n'}
                  Age Requirement{'\n'}
                  • Only users aged 8 years and above are allowed to rent or use our bicycles. Users between the ages of 8-10 must provide parental consent and a valid ID if renting in person.
                  {'\n'}{'\n'}
                  Smartphone and App Requirement{'\n'}
                  • A smartphone and our mobile application are required to lock and unlock the bicycles. The app serves as the primary tool for accessing and controlling the bike's smart lock system.
                  {'\n'}{'\n'}
                  Location Monitoring{'\n'}
                  • Only users aged 8 years and above are allowed to rent or use our bicycles. Users between the ages of 8-10 must provide parental consent and a valid ID if renting in person.
                  {'\n'}{'\n'}
                  Walk-in Clients (8-10 years old){'\n'}
                  • For walk-in rentals, children between the ages of 8-10 must have a parent or legal guardian present to provide consent. Additionally, a valid ID for the child must be presented to proceed with the rental.
                  {'\n'}{'\n'}
                  Reservation and Payment{'\n'}
                  • Customers must pay for the hour of bike use that they reserve, whether they are walk-in or online customers.{'\n'}
                  • If a customer returns the bike late, they will be charged for the additional time, calculated in minutes or hours.
                  {'\n'}{'\n'}
                  Reservation Policy{'\n'}
                  • If the reservation time expires, customers have the option to extend their reservation by paying for an additional hour.{'\n'}
                  • The maximum allowable extension is three hours.
                  {'\n'}{'\n'}
                  Cancellation of Reservation{'\n'}
                  • If a customer fails to pick up the bike within the allotted reservation time and does not extend their reservation, the reservation will automatically be cancelled.
                  {'\n'}{'\n'}
                  Liability{'\n'}
                  • Customers are responsible for the bike during the rental period and must report any damage or issues immediately.
                  {'\n'}{'\n'}
                  Compliance{'\n'}
                  • Customers agree to comply with all local laws and regulations regarding bike usage.
                  {'\n'}{'\n'}
                  Changes to Terms{'\n'}
                  • These terms may be updated periodically. Customers are encouraged to review them regularly.{'\n'}
                  {'\n'}{'\n'}
                  By using our service, you confirm that you have read, understood, and agree to these terms and conditions.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.mdlbutton}
                onPress={handleAgree}
              >
                <Text style={styles.mdlbuttonText}>I Agree</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Signin Button */}
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: RDim.height * 0.05, paddingBottom: RDim.height * 0.05 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#355E3B" /> // Show loading indicator
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => handleSignUp()}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6D6CA'
  },
  image: {
    width: RDim.width * 0.5,
    height: RDim.height * 0.25,
    alignSelf: 'center',
    marginTop: 65
  },
  googleImage: {
    width: RDim.width * 0.065, // Set the desired width
    height: RDim.height * 0.065, // Set the desired height
    objectFit: 'contain',
  },
  btnCon: {
    alignItems: 'center',
    gap: 20,
    marginTop: 100
  },
  btns: {
    display: 'flex',
    backgroundColor: '#355E3B',
    width: RDim.width * 0.9,
    height: RDim.height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    gap: 10
  },
  btnText: {
    color: 'white',
    fontFamily: 'mplus',
    fontSize: RDim.height * 0.024,
  },
  form: {
    marginTop: RDim.height * 0.02
  },
  aha: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: RDim.height * 0.25
  },
  inputCon: {
    width: RDim.width * 0.80,
    alignSelf: 'center'
  },
  inputLabel: {
    fontSize: RDim.width * 0.05,
    fontFamily: 'mplus',
  },
  input: {
    height: RDim.height * 0.05,
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#FFF',
    fontFamily: 'mplus',
    fontSize: RDim.scale * 8
  },
  button: {
    backgroundColor: '#355E3B',
    width: RDim.width * 0.5,
    height: RDim.height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RDim.scale * 50
  },
  buttonText: {
    fontFamily: 'mplus',
    fontSize: RDim.width * 0.055,
    color: 'white',
  },


  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    height: RDim.height * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RDim.width * 0.05,

  },
  termsText: {
    marginBottom: 20,
    textAlign: 'justify',
  },
  mdlbutton: {
    backgroundColor: '#355E3B',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  mdlbuttonText: {
    color: 'white',
    fontFamily: 'mplus'
  },
})