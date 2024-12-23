import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { FontAwesome as FA } from '@expo/vector-icons';
import RDim from '@/hooks/useDimensions';
import bikeLogo from '../../assets/images/bikeLogo.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginAPI, getResBike, getResInfobyEmail } from '@/hooks/myAPI';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const setLoggedIn = async (isLoggedIn) => {
    try {
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    } catch (error) {
        console.error('Error setting login status:', error);
    }
};

const storeData = async (userData) => {
    try {
        const keys = Object.keys(userData);
        for (const key of keys) {
            await AsyncStorage.setItem(key, userData[key]);
        }
    } catch (e) {
        console.error('Failed to save data', e);
    }
};

const storeBikeId = async (bikeId) => {
    try {
        await AsyncStorage.setItem('bike_id', bikeId);
    } catch (error) {
        // Alert.alert('Welcome!', 'Good Day!, Happy renting with RBMS');
    }
};

export default function Login() {
    const nav = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxPress = () => {
        setIsChecked((prevState) => !prevState)
        if (!isChecked) {
            console.log('checked')
        } else {
            console.log('unchecked')
        }
    };

    const clearInputs = () => {
        setUsername('');
        setPassword('');
    }

    const handleLogin = async () => {
        if (isChecked) {
            console.log('log in with temp acc')
        } else {
            console.log('log in with real acc')
            if (username === '' || password === '') {
                Toast.error('Please fill in all fields');
                return;
            }
            setLoading(true);
            try {
                const response = await axios.post(loginAPI, { i_username: username, i_password: password });
                const { isFound, message, loginData } = response.data;

                if (isFound) {
                    Toast.success(message);
                    setLoggedIn(true);

                    const userData = {
                        id: loginData._id,
                        name: `${loginData.c_first_name} ${loginData.c_middle_name.charAt(0)}. ${loginData.c_last_name}`,
                        address: `${loginData.c_full_address.street}, ${loginData.c_full_address.city}, ${loginData.c_full_address.province}`,
                        phone: loginData.c_phone,
                        bday: loginData.c_bdate,
                        email: loginData.c_email,
                    };
                    await storeData(userData);

                    const bikeReserveResponse = await axios.get(`${getResInfobyEmail}/${loginData.c_email}`);
                    const bikeId = bikeReserveResponse.data.bike_id; // Adjust according to your API response structure
                    await storeBikeId(bikeId);

                    await delay(2000);
                    clearInputs();
                    nav.navigate('index');
                } else {
                    Toast.error(message);
                }
            } catch (error) {
                console.error('Login error:', error);
                Toast.error('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }

    }


    return (
        <View style={styles.container}>
            <ToastManager
                position="top"
                textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
                duration={2000}
                showCloseIcon={false}
                showProgressBar={false}
            />
            <View>
                <Image source={bikeLogo} style={styles.image} />
            </View>
            <View style={styles.form}>
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
                <View>
                    <BouncyCheckbox
                        size={20}
                        fillColor="#355E3B"
                        text="Check if using temporary account"
                        innerIconStyle={{ borderWidth: 2 }}
                        textStyle={{ fontFamily: "mplus" }}
                        isChecked={isChecked}
                        onPress={handleCheckboxPress}
                        style={{ paddingLeft: RDim.width * 0.1, paddingBottom: RDim.height * 0.03 }}
                    />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: RDim.height * 0.02 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#355E3B" /> // Show loading indicator
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.aha}>
                <Link href={{ pathname: '/forgetpass' }}>
                    <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * 0.04 }}>forgot password</Text>
                </Link>
            </View>
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
        marginTop: 65,
        objectFit: 'contain'
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
        marginTop: RDim.height * 0.05
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
    }
})