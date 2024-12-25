import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import RDim from "@/hooks/useDimensions";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getResBikeAll } from "@/hooks/myAPI";
import axios from "axios";



const History = () => {
  // Sample data
  const [email, setEmail] = useState([]);
  const [datagathered, setDatagathered] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTemp, setIsTemp] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatusAndEmail = async () => {
        try {
          const loginValue = await AsyncStorage.getItem('isLoggedIn');
          const isTempValue = await AsyncStorage.getItem('isTemp');
          const isTemp = JSON.parse(isTempValue);
          setIsTemp(isTemp);

          if (loginValue !== null) {
            const loggedIn = JSON.parse(loginValue);
            

            setIsLoggedIn(loggedIn);

            if (loggedIn) {
              const emailValue = await AsyncStorage.getItem('email');

              setEmail(emailValue || 'undefined');
            }
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };

      checkLoginStatusAndEmail();
    }, [])
  );

  const getReservedBike = async () => {
    if (!email || email === 'undefined') return; // Prevent fetching if email is not set

    try {
      const data = { email: email };
      const response = await axios.post(getResBikeAll, data);
      // console.log(response.data);
      const records = response.data.records;
      setDatagathered(records);
    } catch (error) {
      console.error('Error fetching reserved bikes:', error);
    }
  };

  useEffect(() => {
    
    if (isLoggedIn && !isTemp) {
      getReservedBike(); // Fetch data only if logged in

      const intervalId = setInterval(() => {
        getReservedBike(); // Fetch every 5 seconds
      }, 5000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    } else {
      setDatagathered([]);
    }
  }, [isLoggedIn, email]);

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
            {item.bikeInfo ? (
              <>
                <Image
                  source={{ uri: item.bikeInfo.bike_image_url }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.date}>
                    rented date: {new Date(item.reservation_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.name}>
                    bike name: {item.bikeInfo.bike_name}
                  </Text>
                  <Text style={styles.contact}>
                    Rent Paid: {item.totalBikeRentPrice}
                  </Text>
                  <Text style={styles.contact}>
                    Remarks: {item.bikeStatus}
                  </Text>
                </View>
              </>
            ) : (
              null
            )}
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
