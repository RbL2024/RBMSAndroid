import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import RDim from '../../hooks/useDimensions';
import { LinearGradient } from 'expo-linear-gradient';
import ToastManager, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getRentedBike, getResInfobyEmail } from '@/hooks/myAPI';
import { useNavigation } from '@react-navigation/native';

const HorizontalLine = ({ color = 'gray', thickness = 1.5, mv = 5, style }) => {
  return <View style={[styles.line, { backgroundColor: color, height: thickness, marginVertical: mv }, style]} />;
};

function calculateOvertimeCost(bikeRentPrice, overtime) {
  // Extract hours and minutes from the overtime string
  const [hours, minutes] = overtime.split(':').map(Number);
  
  // Convert total overtime to minutes
  const totalOvertimeMinutes = (hours * 60) + minutes;
  
  // Calculate the number of 30-minute intervals
  const intervals = Math.floor(totalOvertimeMinutes / 5);
  const costPer5Minutes = (0.25 * bikeRentPrice)/30*5;


  // Calculate the cost for the overtime
  const overtimeCost = intervals * costPer5Minutes;
  return overtimeCost;
}

export default function Rentdue() {

  const [rented, setRented] = useState(false);
  const [rentedBike, setRentedBike] = useState([]);
  const [rentdue, setRentdue] = useState('00:00');
  const [duration, setDuration] = useState(0);
  const [overtime, setOvertime] = useState('');
  const [totalCharge, setTotalCharge] = useState(0);

  useEffect(() => {
    const checkBikeStatus = async () => {
      const bID = await AsyncStorage.getItem('bike_id');
      const email = await AsyncStorage.getItem('email');
      if (bID && email) {
        const data = { bID: bID, email: email };
        try {
          const getresTime = await axios.get(`${getResInfobyEmail}/${data.email}`);
          setRentdue(getresTime.data.returnTime || '00:00');


          const bikeData = await axios.post(getRentedBike, data);
          const combinedBikeData = bikeData.data.bikeInfo.map((bike, index) => ({
            ...bike,
            ...bikeData.data.reservationsToday[index],
          })).filter(bike => bike.bike_image_url);

          setRentedBike(combinedBikeData);


          // console.log(rented);
        } catch (error) {
          showAlertAndNavigate();
        }
      } else {
        showAlertAndNavigate();
      }
    }
    checkBikeStatus();
  }, [])

  useEffect(() => {
    if (rentedBike.length > 0) {
      const totalCharge = rentedBike.reduce((acc, bike) => {
        const bikeRentPrice = parseInt(bike.bike_rent_price, 10);
        const overtimeCost = calculateOvertimeCost(bikeRentPrice, overtime);
        return acc + overtimeCost;
      }, 0);
      
      setTotalCharge(totalCharge);
    }
  }, [overtime, rentedBike]);



  useEffect(() => {
    if (rentdue === '00:00') return;

    const rentdueSeconds = timeToSeconds(convertRTime(rentdue));
    const currentSeconds = timeToSeconds(formatTime(new Date()));
    const initialTimeDifference = rentdueSeconds - currentSeconds;
    setDuration(initialTimeDifference > 0 ? initialTimeDifference : 0);

    const updateOvertimeDue = setInterval(() => {
      const currentSeconds = timeToSeconds(formatTime(new Date()));
      const overtimeSeconds = rentdueSeconds - currentSeconds;

      if (overtimeSeconds < 0 && rentdue !== '00:00') {
        setOvertime(secondsToTime(Math.abs(overtimeSeconds)));
      } else {
        setOvertime("00:00");
      }



    }, 1000)
    return () => clearInterval(updateOvertimeDue);
  }, [rentdue]);


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
        isGrowing={true}
        isPlaying
        duration={duration} // Set the duration in seconds
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
                <Text style={styles.currentTimeText}>{rentdue}</Text>
              </View>
              <HorizontalLine style={{ width: RDim.width * .5 }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.currentTimeText}>{overtime}</Text>
                <Text style={styles.default}>Over Time</Text>
              </View>
            </View>
          </>
        )}
      </CountdownCircleTimer>
      <View style={{ marginTop: 30, height: RDim.height * .05 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .05, textAlign: 'center' }}>Return the Bike within 30 mins after rent due</Text>
          <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * .025, color: '#AB0505' }}>(after 30 mins, extra 25% of rent will be charged)</Text>
        </View>
      </View>
      <View>
        <View style={styles.bcard}>
          {
            rentedBike.map((bike) => {
              return (
                <View key={bike._id} style={styles.bcardCon}>
                  <Image source={{ uri: bike.bike_image_url }} style={styles.bimage} />
                  <View style={styles.btextContainer}>
                    <Text style={styles.bdate}>{bike.bike_name}</Text>
                    <Text style={styles.bname}>bike id: {bike.bike_id}</Text>
                    <Text style={styles.bcontact}>Duration: {bike.duration} Hr/s</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
      <View style={styles.bcard}>
        {
          rentedBike.map((bike) => {
            return (
              <View style={styles.btextContainer}>
                <Text style={styles.bdate}>Charge Cost per 30 mins(25% of &#8369;{bike.bike_rent_price}): &#8369;{parseInt(bike.bike_rent_price, 10) * .25}</Text>
                <Text style={styles.bname}>Charge Cost per 5 mins: &#8369;{(parseInt(bike.bike_rent_price, 10) * .25) / 30 * 5}</Text>
                <Text style={styles.bcontact}>Total Charge(&#8369;): {totalCharge} pesos</Text>
              </View>
            )
          })
        }
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