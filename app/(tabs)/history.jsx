import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import RDim from "@/hooks/useDimensions";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getResBikeAll } from "@/hooks/myAPI";
import axios from "axios";

const getBikeIdEmail = async () => {
  try {
    const bID = await AsyncStorage.getItem('bike_id');
    const email = await AsyncStorage.getItem('email');
    if (bID !== null && email !== null) {
      return { bID, email };
    } else {
      return 'undefined';
    }
  } catch (e) {
    console.error('Failed to fetch data', e);
  }
};


const History = () => {
  // Sample data
  const [bikeIdEmail, setBikeIdEmail] = useState([]);
  const [datagathered, setDatagathered] = useState([]);

  const getReservedBike = async () => {
    try {
      const data = bikeIdEmail;
      const response = await axios.post(getResBikeAll, data);
      // console.log('API Response:', response.data); // Log the API response

      // Extract the records from the response
      const records = response.data.records || [];

      // Set the gathered data directly from records
      setDatagathered(records);
    } catch (error) {
      console.error('Error fetching reserved bikes:', error); // Log the entire error object
    }
  };

  useEffect(() => {
    const getbid = async () => {
      setBikeIdEmail(await getBikeIdEmail());
    }
    getbid();
  }, []);

  useEffect(() => {
    const fetchReservationData = () => {
      getReservedBike(); // Then call getReservedBike
    };
    fetchReservationData();
    const intervalId = setInterval(() => {
      fetchReservationData(); // Fetch every 5 seconds
    }, 5000);

    // Clear the interval on component unmount

    return () => clearInterval(intervalId);
    
  }, [bikeIdEmail]);

  // console.log(datagathered);

  return (
    <LinearGradient
      colors={["#355E3B", "#D6D6CA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.35 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {datagathered.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{uri:item.bikeInfo.bike_image_url}} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.date}>rented date: {new Date(item.reservation_date).toLocaleDateString()}</Text>
              <Text style={styles.name}>bike name: {item.bikeInfo.bike_name}</Text>
              <Text style={styles.contact}>Gcash #: {item.phone}</Text>
              <Text style={styles.contact}>Rent Paid: {item.totalBikeRentPrice}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D6CA",
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#D6D6CA",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    elevation: 2,
    gap: 30,
  },
  image: {
    width: RDim.width * .23,
    height: RDim.height * .11,
    borderRadius: 8,
    objectFit: 'contain'
  },
  textContainer: {
    flex: 1,
    gap: 2,
    textAlign: 'center',

  },
  date: {
    fontSize: 15,
    color: "#888",
    textAlign: 'end',
    fontWeight: 'bold'
  },
  name: {
    fontSize: 15,
    color: "#888",
    fontWeight: 'bold'
  },
  contact: {
    fontSize: 14,
    color: "#888",
    fontWeight: 'bold'
  },
});

export default History;
