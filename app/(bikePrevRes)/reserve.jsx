import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Button, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { FontAwesome as FA } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RDim from '@/hooks/useDimensions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager, { Toast } from 'toastify-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { reserveAPI } from '@/hooks/myAPI';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const HorizontalLine = ({ color = '#000', thickness = 1, mv = 5, style }) => {
    return <View style={[styles.line, { backgroundColor: color, height: thickness, marginVertical: mv }, style]} />;
};


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

const Reserve = () => {

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const period = hours >= 12 ? 'PM' : 'AM';
        return `${formattedHours}:${minutes} ${period}`;
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(formatTime(new Date()));
    const [disable, setDisable] = useState(true);

    const showTimePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideTimePicker();
        const formattedTime = formatTime(date);

        // Get the current date and time
        const now = new Date();

        // Create a Date object for the selected time
        const selectedDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), date.getHours(), date.getMinutes());

        // Check if the selected time is in the past
        if (selectedDateTime <= now) {
            Toast.error("You cannot reserve a bike behind the current time.");
            setDisable(true);
            return; // Do not update the selected time
        }
        // Calculate the difference in milliseconds
        const timeDifference = selectedDateTime - now;
        const oneHourInMillis = 30 * 60 * 1000; // 1 hour in milliseconds

        // Check if the selected time is more than 1 hour from now
        if (timeDifference <= oneHourInMillis) {
            setDisable(true); // Disable if selected time is more than or equal to 1 hour in the future
            // Toast.error("You cannot reserve a bike for more than 1 hour in advance.");
        } else {
            setDisable(false); // Enable if within 1 hour
        }

        setSelectedTime(formattedTime);
    };

    const storeBikeId = async (bID) => {
        try {
            await AsyncStorage.setItem('bike_id', bID);
        } catch (e) {
            console.error('Failed to save data', e);
        }
    };

    const getBikeId = async () => {
        try {
            const bID = await AsyncStorage.getItem('bike_id');

            if (bID !== null) {

                return { bID };

            } else {
                return 'undefined';
            }
        } catch (e) {
            console.error('Failed to fetch data', e);
        }
    };


    const route = useRoute();
    // console.log(route.params);
    const { params } = route;

    const { _id, bike_id, bike_image_url, bike_name, bike_rent_price } = params;

    const [dou, setDou] = useState(1); // Initial value
    const [bikePrice, setBikePrice] = useState(bike_rent_price);
    const [durationFee, setDurationFee] = useState(Math.floor(bike_rent_price));

    const reservationFee = 25; // Example fixed reservation fee
    const reserveHourFee = 25; // Example fixed reserve hour fee
    const totalFee = reservationFee + reserveHourFee;
    const totalBikeFee = bikePrice * dou;

    const updateDurationFee = (duration) => {
        const fee = bikePrice * duration; // Calculate fee based on bike price and duration
        setDurationFee(fee);
    };
    // Function to increment the value
    const increment = () => {
        setDou(prevDuration => {
            const newDuration = prevDuration + 1;
            updateDurationFee(newDuration); // Update fee based on new duration
            return newDuration;
        });
    };

    // Function to decrement the value
    const decrement = () => {
        setDou(prevDuration => {
            const newDuration = Math.max(prevDuration - 1, 1); // Prevent negative values
            updateDurationFee(newDuration); // Update fee based on new duration
            return newDuration;
        });// Prevent negative values
    };
    const nav = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        try {
            const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
            setIsLoggedIn(loggedInStatus !== null ? JSON.parse(loggedInStatus) : false);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false); // Default to false on error
        }
    };

    const [loading, setLoading] = useState(false);

    const handleReserve = async () => {
        if(disable){
            Alert.alert('Information', 'We cannot reserve time below 30 mins');
            return;
        }
        Alert.alert('Information', `You will only be charged for ${totalFee} pesos for reservation.`);
        setLoading(true);
        const userData = await getData();

        const reserveData = {
            uID: _id,
            bike_id: bike_id,
            timeofuse: selectedTime,
            duration: dou.toString(),
            totalReservationFee: totalFee.toString(),
            totalBikeRentPrice: totalBikeFee.toString(),
            bike_status: "RESERVED",
            ...userData
        }

        try {
            const response = await axios.put(`${reserveAPI}/${_id}`, reserveData);
            if (response.data.isReserved) {
                Toast.success(response.data.message + ', check your Time Tracker');
                const bID = bike_id;
                storeBikeId(bID);
                await delay(2000);
                nav.navigate('index');
            } else {
                Toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const [gotuser, setGotuser] = useState({});
    const getuser = async () => {
        setGotuser(await getData())
    }
    useFocusEffect(
        React.useCallback(() => {
            getuser();
            checkLoginStatus();
        })
    )


    return (
        <View style={{ flex: 1 }}>
            <ToastManager
                position="top"
                style={{minWidth: RDim.width*.9}}
                textStyle={{fontSize:12}}
                showCloseIcon={false}
                showProgressBar={false}
            />
            <View>
                <Text style={{ fontSize: RDim.width * 0.06, fontFamily: 'mplus', paddingLeft: 12, textAlign: 'center' }}>User Details</Text>
            </View>
            <HorizontalLine />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: RDim.width * 0.03, alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <FA name='user' size={RDim.width * 0.08} color={'#355E3B'} />
                    <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus', paddingLeft: 10 }}>Name</Text>
                </View>
                <View>
                    <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>{gotuser.name}</Text>
                </View>
            </View>
            <HorizontalLine />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: RDim.width * 0.02, alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* <EvilIcons name="location" size={RDim.width * 0.08} color={'#355E3B'} /> */}
                    <MaterialIcons name="location-on" size={RDim.width * 0.08} color={'#355E3B'} />
                    <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>Address</Text>
                </View>
                <View>
                    <Text style={{ fontSize: RDim.width * 0.030, fontFamily: 'mplus', paddingRight: 5 }}>{gotuser.address}</Text>
                </View>
            </View>
            <HorizontalLine />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: RDim.width * 0.02, alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* <FA name='phone' size={RDim.width * 0.08} color={'#355E3B'} /> */}
                    <MaterialIcons name="phone-android" size={RDim.width * 0.08} color={'#355E3B'} />
                    <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>Phone</Text>
                </View>
                <View>
                    <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus', paddingRight: 5 }}>{gotuser.phone}</Text>
                </View>
            </View>
            <HorizontalLine />
            <View style={{ position: 'relative', flex: 1 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                    <ImageBackground source={{ uri: bike_image_url }} style={{ width: RDim.width * 0.5, height: RDim.height * 0.16 }} />
                    <View>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>{bike_name}</Text>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>&#8369;{bike_rent_price} per hour</Text>
                    </View>
                </View>
                <View>
                    <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 25, marginTop: 25 }}>
                        <View style={styles.inputCon}>
                            <Text style={styles.inputLabel}>Set time for reserve</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={[styles.input]}
                                    value={selectedTime}
                                    onChangeText={setSelectedTime} // Update the state when the text changes
                                    // Other optional props
                                    keyboardType="default" // Options: 'default', 'numeric', 'email-address', etc.
                                    returnKeyType="done" // Change the return key type
                                    autoCapitalize="none"
                                    readOnly
                                />
                                <DateTimePicker
                                    isVisible={isDatePickerVisible}
                                    mode="time"
                                    onConfirm={handleConfirm}
                                    onCancel={hideTimePicker}
                                />
                                <TouchableOpacity onPress={() => showTimePicker()} style={{ position: 'absolute', right: 0, top: 0, padding: 10 }}>
                                    <FA name='clock-o' size={RDim.scale * 7} color={'#355E3B'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.inputCon}>
                            <Text style={styles.inputLabel}>Set duration of use</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={decrement} style={styles.iconButton}>
                                    <FA name='minus' size={RDim.scale * 7} color={'#355E3B'} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.douinput}
                                    value={String(dou)}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={increment} style={styles.iconButton}>
                                    <FA name='plus' size={RDim.scale * 7} color={'#355E3B'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={{ position: 'absolute', bottom: 25, width: RDim.width }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>Reservation Fee:</Text>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>&#8369;25</Text>
                    </View>
                    {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>Duration of use Fee:</Text>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>&#8369;{durationFee}</Text>
                    </View> */}
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>Reserve hour Fee:</Text>
                        <Text style={{ fontSize: RDim.width * 0.040, fontFamily: 'mplus' }}>&#8369;25</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>Total Fee:</Text>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>&#8369;{totalFee}</Text>
                    </View>
                    <HorizontalLine/>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>Total Bike Rent Price:</Text>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>&#8369;{totalBikeFee}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingTop: 20 }}>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>Payment Method</Text>
                        <Text style={{ fontSize: RDim.width * 0.055, fontFamily: 'mplus' }}>GCash Only</Text>
                    </View>
                    <View style={{}}>
                        {
                            loading ? (
                                <ActivityIndicator size="large" color="#355E3B" />
                            ) : (
                                <TouchableOpacity onPress={() => handleReserve()} style={{ backgroundColor: '#355E3B', width: RDim.width * 0.75, height: RDim.height * 0.06, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontFamily: 'mplus', fontSize: RDim.width * 0.07 }}>Reserve Now</Text>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </View>
            </View>
        </View>
    )
}

export default Reserve

const styles = StyleSheet.create({
    line: {
        width: '100%',
    },
    inputCon: {
        width: RDim.width * 0.4,
    },
    inputLabel: {
        fontSize: RDim.width * 0.04,
        fontFamily: 'mplus',
    },
    input: {
        height: RDim.height * 0.05,
        width: '100%',
        borderRadius: 5,
        paddingEnd: 40,
        paddingStart: 40,
        backgroundColor: '#FFF',
        fontFamily: 'mplus',
        fontSize: RDim.width * .04,
        textAlign: 'center'
    },
    douinput: {
        height: RDim.height * 0.05,
        width: '50%',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        fontFamily: 'mplus',
        fontSize: RDim.width * .04,
        textAlign: 'center'
    },
    iconButton: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white', // Optional: Background color for better visibility
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5, // Optional: Rounded corners for buttons
    },
})