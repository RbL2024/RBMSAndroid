import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import RDim from '../../hooks/useDimensions';
import { LinearGradient } from 'expo-linear-gradient';
import ToastManager, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getResInfo, getResBike, cancelReservation, checkBStat } from '@/hooks/myAPI';
import { useNavigation } from '@react-navigation/native';
import Rentdue from './rentdue';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



function formatTimeWithHours(seconds) {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  // Format hours, minutes, and seconds to always have two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${minutes}:${seconds} ${period}`;
  // return `${formattedHours}:${minutes} ${period}`;
};

function timeToSeconds(timeStr) {
  const [time, period] = timeStr.split(' '); // Split time and period (AM/PM)
  let [hours, minutes, seconds] = time.split(':').map(Number); // Split hours and minutes and convert to numbers

  // Convert to 24-hour format
  if (period === 'PM' && hours < 12) {
    hours += 12; // Convert PM hours to 24-hour format
  }
  if (period === 'AM' && hours === 12) {
    hours = 0; // Convert 12 AM to 0 hours
  }

  // Calculate total seconds
  return (hours * 3600) + (minutes * 60) + seconds;
}


function convertRTime(timeString) {
  if (!timeString || typeof timeString !== 'string') {
    console.error('Invalid timeString:', timeString);
    return ''; // Return an empty string or handle the error as appropriate
  }

  // Split the time string into time and period (AM/PM)
  const parts = timeString.split(' '); // Split time and period (AM/PM)

  // Extract time and period
  const time = parts[0]; // The time part
  const period = parts.length > 1 ? parts[1] : ''; // The period part (if it exists)

  // Append ':00' to the time part to include seconds
  let timeWithSeconds = `${time}:00`;

  // Include the period only if it is valid (AM/PM)
  if (period && (period === 'AM' || period === 'PM')) {
    timeWithSeconds += ` ${period}`;
  }

  return timeWithSeconds;
}

function secondsToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format hours, minutes, and seconds to always have two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}


const HorizontalLine = ({ color = 'gray', thickness = 1.5, mv = 5, style }) => {
  return <View style={[styles.line, { backgroundColor: color, height: thickness, marginVertical: mv }, style]} />;
};

function formatDateTime(dateString) {
  const date = new Date(dateString);

  // Format the date to MMM/DD/yyyy
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Replace the month with its abbreviated form and ensure the day is two digits
  const [month, day, year] = formattedDate.split(' ');
  const formattedDateString = `${month} ${String(day).padStart(2, '0')} ${year}`;

  // Format the time to 12-hour format with AM/PM
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`; // Convert to 12-hour format

  return `${formattedDateString}`; // Combine date and time
}

const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const bikeId = await AsyncStorage.getItem('bike_id');
    const email = await AsyncStorage.getItem('email');

    if (bikeId && email) {
      const bikeIdEmail = { bID: bikeId, email };
      const { data: { timeofuse: resTime } } = await axios.post(getResInfo, bikeIdEmail);

      // Here you can implement your logic to check if the reservation is late
      // For example, you can compare the reserved time with the current time
      // If the reservation is late, call the function to cancel the reservation
      const currentTime = new Date();
      const reservedTime = new Date(resTime); // Assuming resTime is in a compatible format
      if (currentTime > reservedTime) {
        await updateReservationStatusToCancel(bikeIdEmail); // You need to adjust this function to accept bikeIdEmail
      }
    }
  } catch (error) {
    console.error('Error in background fetch task:', error);
  }
});
export default function Timetrack() {
  const nav = useNavigation();
  const [reservedTime, setReservedTime] = useState('00:00');
  const [duration, setDuration] = useState(0);
  const [hoursLate, setHoursLate] = useState('');
  const [bikeIdEmail, setBikeIdEmail] = useState({});
  const [reservedBike, setReservedBike] = useState([]);
  const [rented, setRented] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const registerBackgroundFetch = async () => {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 60, // Minimum interval in seconds (15 minutes)
        stopOnTerminate: false, // Keep running after app is terminated
        startOnBoot: true, // Start the task when the device boots
      });
    };

    registerBackgroundFetch();
  }, []);


  useEffect(() => {
    const checkBikeStatus = async () => {
      const bID = await AsyncStorage.getItem('bike_id');
      const email = await AsyncStorage.getItem('email');
      if (bID && email) {
        const data = { bID: bID, email: email };
        try {
          const checkBStats = await axios.post(checkBStat, data);
          const combinedBikeData = checkBStats.data.bikeInfo.map((bike, index) => ({
            ...bike,
            ...checkBStats.data.reservationsToday[index],
          }));
          const bStat = combinedBikeData.map((bike)=>bike.bikeStatus);
          
          if(bStat == "RENTED"){
            setRented(true);
            return;
          }else{
            setRented(false);
          }

          // Fetch reservation data
          const getresTime = await axios.post(getResInfo, data);
          setReservedTime(getresTime.data.timeofuse || '00:00');
  
          const bikeData = await axios.post(getResBike, data);
          const combinedBikeData2 = bikeData.data.bikeInfo.map((bike, index) => ({
            ...bike,
            ...bikeData.data.reservationsToday[index],
          })).filter(bike => bike.bike_image_url);
          
          setReservedBike(combinedBikeData2);
          console.log(rented);
        } catch (error) {
          showAlertAndNavigate();
        }
      }else{
        showAlertAndNavigate();
      }
    }
    checkBikeStatus();
  }, [rented])


  const showAlertAndNavigate = () => {
    Alert.alert(
      "Information",
      "You don't have a bike reservation. Please reserve a bike first.",
      [{ text: "OK", onPress: () => nav.navigate('index') }],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (reservedTime === '00:00') return;

    const reservedSeconds = timeToSeconds(convertRTime(reservedTime));
    const currentSeconds = timeToSeconds(formatTime(new Date()));
    const initialTimeDifference = reservedSeconds - currentSeconds;
    setDuration(initialTimeDifference > 0 ? initialTimeDifference : 0);

    const updateHoursLateInterval = setInterval(() => {
      const now = new Date();
      const currentSeconds = timeToSeconds(formatTime(now));
      const timeDifference = reservedSeconds - currentSeconds;

      if (timeDifference < 0 && reservedTime !== '00:00') {
        setHoursLate(secondsToTime(Math.abs(timeDifference)));
        // if (Math.abs(timeDifference) >= 3600 && !alertShown) {
        //   setAlertShown(true);
        //   Alert.alert('Information', 'You are 1 hour late, your reservation is automatically canceled',
        //     [{ text: "Okay", onPress: async () => nav.navigate('index') }]);
        //   updateReservationStatusToCancel();
        // }
      } else {
        setHoursLate('00:00');
      }
    }, 1000);

    return () => clearInterval(updateHoursLateInterval);
  }, [reservedTime/*, alertShown*/]);



  const deleteBikeId = async () => {
    try {
      await AsyncStorage.removeItem('bike_id');
      console.log('Bike ID has been removed from AsyncStorage');
    } catch (error) {
      console.error('Error removing bike ID from AsyncStorage:', error);
    }
  };

  const handleCancelReserve = async () => {
    if (reservedTime !== '00:00') {
      Alert.alert(
        "Cancel Reservation",
        "Are you sure you want to cancel your reservation?",
        [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
          {
            text: "OK", onPress: async () => {
              await updateReservationStatusToCancel();
              Toast.info('Your reservation has been canceled.');
              deleteBikeId();
              await delay(2000);
              nav.navigate('index');
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  const updateReservationStatusToCancel = async () => {
    try {
      const response = await axios.put(cancelReservation, bikeIdEmail);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating reservation status:', error.response ? error.response.data : error.message);
    }
  };





  return (
    rented ? (
      <Rentdue />
    ) : (
      <LinearGradient
        colors={["#355E3B", "#D6D6CA"]} // Define your gradient colors here
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
        style={styles.container}
      >
        <ToastManager
          position="top"
          width={'auto'}
          textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
          duration={2000}
          showCloseIcon={false}
          showProgressBar={false}
        />
        <Text style={styles.title}>Reservation Time</Text>
        <CountdownCircleTimer
          size={RDim.scale * 100}
          trailColor='whitesmoke'
          // isGrowing={true}
          isPlaying
          duration={duration} // Set the duration in seconds
          colors={['#355E3B']} // Colors for the timer
          onComplete={() => {
            // // Action to take when the timer completes
            // const now = new Date();
            // const currentSeconds = timeToSeconds(formatTime(now));
            // const reservedSeconds = timeToSeconds(convertRTime(reservedTime));
            // // console.log(currentSeconds, reservedSeconds);
            // if (currentSeconds >= reservedSeconds) {
            //   automaticCancel();
            // }
            return { shouldRepeat: false }; // Prevents the timer from repeating
          }}
        >
          {() => (
            <>
              <View style={{ gap: 5 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.default}>Reserved Time</Text>
                  <Text style={styles.currentTimeText}>{reservedTime}</Text>
                </View>
                <HorizontalLine style={{ width: RDim.width * .5 }} />
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.currentTimeText}>{hoursLate}</Text>
                  <Text style={styles.default}>Hours Late</Text>
                </View>
              </View>
            </>
          )}
        </CountdownCircleTimer>
        <View style={{ marginTop: 30, height: RDim.height * .05 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .05 }}>You can be late only for 1 hour</Text>
            <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .025, color: '#AB0505' }}>(your reservation will be automatically canceled after 1 hour)</Text>
          </View>
        </View>
        <View>
          <View style={styles.bcard}>
            {
              reservedBike.map((bike) => {
                return (
                  <View key={bike.bike_id} style={styles.bcardCon}>
                    <Image source={{ uri: bike.bike_image_url }} style={styles.bimage} />
                    <View style={styles.btextContainer}>
                      <Text style={styles.bdate}>Reservation No.: {bike.reservation_number}</Text>
                      <Text style={styles.bname}>bike id: {bike.bike_id}</Text>
                      <Text style={styles.bcontact}>Duration: {bike.duration} Hr/s</Text>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View style={btnCon.container}>
          <TouchableOpacity onPress={handleCancelReserve}>
            <View style={[btnCon.btn, { backgroundColor: '#AB0505' }]}>
              <Text style={btnCon.text}>Cancel Reservation</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
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