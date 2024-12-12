import React, { useRef, useEffect } from 'react';
import { View, Alert, BackHandler, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ToastManager, { Toast } from 'toastify-react-native';
import { reserveAPI } from '@/hooks/myAPI';
const paymongoAPIKey = 'sk_test_cVbUZPGVg1aCUGkGVtu5iuqs';
import RDim from '../../hooks/useDimensions'


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getData = async () => {
    try {
        const id = await AsyncStorage.getItem('id');
        const name = await AsyncStorage.getItem('name');
        const address = await AsyncStorage.getItem('address');
        const phone = await AsyncStorage.getItem('phone');
        const email = await AsyncStorage.getItem('email');

        if (id !== null && name !== null && address !== null && phone !== null && email !== null) {

            return { id, name, address, phone, email };

        } else {
            return 'undefined';
        }
    } catch (e) {
        console.error('Failed to fetch data', e);
    }
};

const storeBikeId = async (bID) => {
    try {
        await AsyncStorage.setItem('bike_id', bID);
    } catch (e) {
        console.error('Failed to save data', e);
    }
};

const PaymentWebView = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { paymentLink, paymentLinkID, uID, bike_id, selectedTime, dou, totalFee, totalBikeFee } = route.params; // Get the payment link from route params
    const webViewRef = useRef(null); // Create a ref for the WebView

    const archivePMLink = async () => {
        try {
            console.log(paymentLinkID)
            const res = await axios.post(`https://api.paymongo.com/v1/links/${paymentLinkID}/archive`,{},{
                headers: {
                    Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(res.data);
        } catch (error) {
            console.error('Error archiving payment link:', error);
        }
    }

    const handleBackButton = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack(); // Go back in WebView history
            Alert.alert("Hold on!", "You can't go back while the payment is in progress.", [
                { text: "OK", onPress: () => null }
            ]);

            return true; // Prevent default back action
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            backHandler.remove(); // Clean up the event listener on unmount
        };
    }, []);


    const saveReservation = async () => {
        const userData = await getData();

        const reserveData = {
            uID: uID,
            bike_id: bike_id,
            timeofuse: selectedTime,
            duration: dou.toString(),
            totalReservationFee: totalFee.toString(),
            totalBikeRentPrice: totalBikeFee.toString(),
            bike_status: "RESERVED",
            ...userData
        }
        try {
            const reserveResponse = await axios.put(`${reserveAPI}/${uID}`, reserveData);
            if (reserveResponse.data.isReserved) {
                Toast.success(reserveResponse.data.message + ', check your Time Tracker');
                const bID = bike_id;
                storeBikeId(bID);
                await delay(2000);
                navigation.navigate('index');
            } else {
                Toast.error(reserveResponse.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCancel = () => {
        Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel the payment?',
            [
              { text: 'Yes', onPress: () => {
                archivePMLink();
                navigation.goBack();
              } },
              { text: 'No', onPress: () => console.log('Cancel payment cancelled') },
            ],
            { cancelable: false }
          );
    };


    return (
        <View style={{ flex: 1 }}>
             <ToastManager
                position="top"
                style={{ minWidth: RDim.width * .9 }}
                textStyle={{ fontSize: 12 }}
                showCloseIcon={false}
                showProgressBar={false}
            />
            <WebView
                ref={webViewRef}
                source={{ uri: paymentLink }}
                style={{ flex: 1 }}
                onNavigationStateChange={(navState) => {
                    if (navState.url.includes('success')) {
                        Alert.alert('Payment Successful', 'Your payment was successful!');
                        saveReservation();
                        navigation.goBack(); // Navigate back after success
                    } else if (navState.url.includes('cancel')) {
                        Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
                        navigation.goBack(); // Navigate back after cancellation
                    }
                }}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Payment</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default PaymentWebView;