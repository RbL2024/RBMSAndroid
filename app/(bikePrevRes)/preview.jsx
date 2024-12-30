import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import RDim from '@/hooks/useDimensions';

export default function Preview() {
    const route = useRoute();
    // console.log(route.params);
    const { params } = route;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTemp, setIsTemp] = useState(false);
    const [loading, setLoading] = useState(true);


    const { _id, bike_id, bike_name, bike_rent_price, bike_image_url, bike_desc } = params;

    const checkLoginStatus = async () => {
        try {
            const value = await AsyncStorage.getItem('isLoggedIn'); // Retrieve value from AsyncStorage
            const isTempValue = await AsyncStorage.getItem('isTemp'); // Retrieve value from AsyncStorage
            const isTemp = JSON.parse(isTempValue); // Parse the value to boolean
            setIsTemp(isTemp); // Set the isTemp state

            if (value !== null) {
                setIsLoggedIn(JSON.parse(value)); // Parse and set the login status
            } else {
                setIsLoggedIn(false); // Default to false if value is null
            }
        } catch (error) {
            console.error('Error retrieving login status:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true); // Set loading to true before checking
            checkLoginStatus(); // Call the function to check login status
        }, [])
    );



    return (
        <LinearGradient
            // Colors for the gradient
            colors={["#355E3B", "#D6D6CA"]} // Define your gradient colors here
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.35 }}
            style={styles.container}
        >
            <View style={styles.bikeInfoCon}>
                <ImageBackground source={{ uri: bike_image_url }} style={styles.imgStyle} />
                <View style={styles.bikeInfo}>
                    <Text
                        style={{
                            fontFamily: 'mplusb',
                            fontSize: RDim.scale * 10
                        }}
                        numberOfLines={1}
                        >
                        {bike_name}
                        
                    </Text>
                    <Text style={{ fontFamily: 'mplus', fontSize: RDim.scale * 6 }}>Bike ID : {bike_id}</Text>
                    <Text style={{ fontFamily: 'mplusb', fontSize: RDim.scale * 8, marginTop: RDim.height * 0.03 }}>Description</Text>
                    <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: RDim.height * .35, height: RDim.height * .35 }}>
                        <Text style={{ fontFamily: 'mplus', fontSize: RDim.scale * 8, }}>{bike_desc}</Text>
                    </ScrollView>
                    <View style={styles.prCon}>
                        <View>
                            <Text style={{ fontFamily: 'mplus', fontSize: RDim.scale * 8 }}>Price(&#8369;): </Text>
                            <Text style={{ fontFamily: 'mplus', fontSize: RDim.scale * 8 }}>{bike_rent_price} per hour</Text>
                        </View>

                        <Link
                            href={{
                                pathname: isLoggedIn&&!isTemp ? '/reserve' : '/account',
                                params: isLoggedIn&&!isTemp ? { ...params } : ''
                            }}
                        >
                            <View style={styles.btnReserve}>
                                <Text style={[{ fontFamily: 'mplus', fontSize: RDim.scale * 10, color: 'white' }]} >Reserve</Text>
                            </View>
                        </Link>

                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    bikeInfoCon: {
        flex: 1,
        position: 'relative'
    },
    imgStyle: {
        width: RDim.width,
        height: RDim.height * 0.350
    },
    bikeInfo: {
        flex: 1,
        backgroundColor: '#D6D6CA',
        width: RDim.width,
        height: RDim.height * 0.68,
        elevation: 50,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: RDim.scale * 10
    },
    btnReserve: {
        display: 'flex',
        width: RDim.width * 0.5,
        height: RDim.height * 0.07,
        backgroundColor: '#355E3B',
        borderRadius: RDim.scale * 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    prCon: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: RDim.width,
        padding: RDim.scale * 10,
        bottom: 0

    }
})