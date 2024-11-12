import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { FontAwesome as FA } from '@expo/vector-icons';
import RDim from '@/hooks/useDimensions';
import bikeLogo from '../../assets/images/bikeLogo.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginAPI } from '@/hooks/myAPI';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const setLoggedIn = async (isLoggedIn) => {
    try {
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    } catch (error) {
        console.error('Error setting login status:', error);
    }
};

const storeData = async (cId, cName, cAddress, cPhone, cBDay, cEmail) => {
    try {
        await AsyncStorage.setItem('id', cId);
        await AsyncStorage.setItem('name', cName);
        await AsyncStorage.setItem('address', cAddress);
        await AsyncStorage.setItem('phone', cPhone);
        await AsyncStorage.setItem('bday', cBDay);
        await AsyncStorage.setItem('email', cEmail);
    } catch (e) {
        console.error('Failed to save data', e);
    }
};

export default function Login() {
    const nav = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const clearInputs = () => {
        setUsername('');
        setPassword('');
    }


    const handleLogin = async () => {
        if (username === '' || password === '') {
            Toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const data = {
                i_username: username,
                i_password: password
            }
            const logAcc = await axios.post(loginAPI, data);

            if (logAcc.data.isFound) {
                Toast.success(logAcc.data.message);
                setLoggedIn(true);

                const cId = logAcc.data.loginData._id;
                const cName = logAcc.data.loginData.c_first_name + " " + String(logAcc.data.loginData.c_middle_name).charAt(0) + ". " + logAcc.data.loginData.c_last_name
                const cAddress = logAcc.data.loginData.c_full_address.street + ", " + logAcc.data.loginData.c_full_address.city + ", " +  logAcc.data.loginData.c_full_address.province 
                const cPhone = logAcc.data.loginData.c_phone
                const cBDay = logAcc.data.loginData.c_bdate;
                const cEmail = logAcc.data.loginData.c_email;
                storeData(cId, cName, cAddress, cPhone, cBDay, cEmail);
                await delay(2000);
                clearInputs();
                nav.navigate('account');
            } else {
                Toast.error(logAcc.data.message);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }

    }


    return (
        <View style={styles.container}>
            <ToastManager
                position="top"
                textStyle={{ fontSize: 12, paddingHorizontal:10 }}
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
                <Link href={{ pathname: '/login' }}>
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