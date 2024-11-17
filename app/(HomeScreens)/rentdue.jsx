import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import RDim from '../../hooks/useDimensions';
import { LinearGradient } from 'expo-linear-gradient';
import ToastManager, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getResInfo, getResBike, cancelReservation } from '@/hooks/myAPI';
import { useNavigation } from '@react-navigation/native';

const HorizontalLine = ({ color = 'gray', thickness = 1.5, mv = 5, style }) => {
    return <View style={[styles.line, { backgroundColor: color, height: thickness, marginVertical: mv }, style]} />;
  };

export default function Rentdue() {
  
  return (
    <LinearGradient
      colors={["#355E3B", "#D6D6CA"]} // Define your gradient colors here
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.35 }}
      style={styles.container}
    >
      <ToastManager
        position="top"
        textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
        duration={2000}
        showCloseIcon={false}
        showProgressBar={false}
      />
      <Text style={styles.title}>Rent Duration</Text>
      <CountdownCircleTimer
        size={RDim.scale * 100}
        trailColor='whitesmoke'
        // isGrowing={true}
        isPlaying
        duration={100} // Set the duration in seconds
        colors={['#355E3B']} // Colors for the timer
        onComplete={() => {
          // Action to take when the timer completes
          

          return { shouldRepeat: false }; // Prevents the timer from repeating
        }}
      >
        {() => (
          <>
            <View style={{ gap: 5 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.default}>Rent Due</Text>
                <Text style={styles.currentTimeText}>00:00</Text>
              </View>
              <HorizontalLine style={{ width: RDim.width * .5 }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.currentTimeText}>00:00</Text>
                <Text style={styles.default}>Over Time</Text>
              </View>
            </View>
          </>
        )}
      </CountdownCircleTimer>
      <View style={{ marginTop: 30, height: RDim.height * .05 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .05, textAlign:'center' }}>Return the Bike within 30 mins after rent due</Text>
          <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .025, color: '#AB0505' }}>(after 30 mins, extra 10% of rent will be charged)</Text>
        </View>
      </View>
      <View>
        <View style={styles.bcard}>
          {
            // reservedBike.map((bike) => {
            //   return (
            //     <View key={bike.bike_id} style={styles.bcardCon}>
            //       <Image source={{ uri: bike.bike_image_url }} style={styles.bimage} />
            //       <View style={styles.btextContainer}>
            //         <Text style={styles.bdate}>rented date: {formatDateTime(bike.reservation_date)}</Text>
            //         <Text style={styles.bname}>bike id: {bike.bike_id}</Text>
            //         <Text style={styles.bcontact}>Gcash #: {bike.phone}</Text>
            //       </View>
            //     </View>
            //   )
            // })
          }
        </View>
      </View>
      {/* <View style={btnCon.container}>
        <TouchableOpacity onPress={{}}>
          <View style={[btnCon.btn, { backgroundColor: '#AB0505' }]}>
            <Text style={btnCon.text}>Cancel Reservation</Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </LinearGradient>
  )
}

const btnCon = StyleSheet.create({
  container: {
    width: RDim.width * .9,
    height: 'auto',
    // backgroundColor: "#D6D6CA",
    // elevation: 10,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: RDim.height * .12
  },
  btn: {
    width: RDim.width * .7,
    height: RDim.height * .05,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'mplus'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D6D6CA'
  },
  title: {
    fontSize: RDim.width * 0.08,
    marginBottom: 20,
    marginTop: 50,
    fontFamily: 'mplusb'
  },
  currentTimeText: {
    fontSize: RDim.width * 0.08,
    color: '#000',
    fontFamily: 'mplus'
  },
  default: {
    fontSize: RDim.width * 0.04,
    color: '#000',
    fontFamily: 'mplus'
  },
  resetButton: {
    marginTop: 20,
    fontSize: 18,
    color: '#007BFF',
  },
  bcard: {
    width: RDim.width * 0.9,
    height: RDim.width * 0.25,
    backgroundColor: '#D6D6CA',
    elevation: 10,
    borderRadius: 10,
    padding: 10,
    marginTop: RDim.height * .08
  },
  bcardCon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    alignItems: 'center'
  },
  bimage: {
    width: RDim.width * 0.3,
    height: RDim.height * 0.1,
    objectFit: 'contain'
  },
  btextContainer: {
    gap: 10
  }
});