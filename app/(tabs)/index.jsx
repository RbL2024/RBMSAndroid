import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { Link, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import RDim from "@/hooks/useDimensions";
import { ThemedText } from "@/components/ThemedText";
import useAPI from "../../hooks/useAPI";
import { Toast } from "toastify-react-native";
import { fetchTopBikes } from "@/hooks/myAPI";

//BikeCard
// const Card = ({ title, description, onPress, imageSource }) => {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.card}>
//       <ImageBackground
//         source={imageSource}
//         style={styles.imageBackground}
//         imageStyle={styles.image}
//       >
//         <View style={styles.cardContent}>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.description}>{description}</Text>
//         </View>
//       </ImageBackground>
//     </TouchableOpacity>
//   );
// };

const Card = ({ title, description, imageSource, status }) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={imageSource}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        {status === 'RESERVED' ? 
          <View style={[styles.overlay]}><Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontFamily: 'mplusb' }}>Reserved</Text></View> 
          : status === 'RENTED' ?
          <View style={[styles.overlay]}><Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontFamily: 'mplusb' }}>Rented</Text></View> 
          : null
        }
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default function Index() {
  const [searchText, setSearchText] = useState("");
  // Create a ref for the TextInput
  // const { topBikes, loading, error } = useAPI();
  const [topBikes, setTopBikes] = useState([]);

  const getBikes = async () => {
    try {
      const data = await fetchTopBikes();
      setTopBikes(data);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    getBikes();
    const intervalId = setInterval(() => {
      getBikes();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const clearInput = () => {
    setSearchText("");
    Keyboard.dismiss();
  };

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#355E3B", "#D6D6CA"]} // Define your gradient colors here
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
        style={{ flex: 1, position: "relative" }}
      >
        {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchText} // Set the value of the input
            onChangeText={setSearchText} // Update state on text change
          />
          {searchText ? ( // Conditional rendering of the icon
            <Ionicons
              name="close"
              size={24}
              color="#888"
              style={styles.searchIcon}
              onPress={clearInput} // Clear input when "X" is pressed
            />
          ) : (
            <Ionicons
              name="search"
              size={24}
              color="#888"
              style={styles.searchIcon}
            />
          )}
        </View> */}
        <View style={styles.homeNav}>
          <Link href="/adults">
            <View style={styles.hnlink}>
              <MaterialIcons name="pedal-bike" size={64} color="#355E3B" />
              <Text>Bikes</Text>
            </View>
          </Link>
          <Link href="/lock">
            <View style={styles.hnlink}>
              <MaterialIcons name="lock" size={64} color="#355E3B" />
              <Text>Smart Lock</Text>
            </View>
          </Link>
          <Link href="/timetrack">
            <View style={styles.hnlink}>
              <MaterialIcons name="timer" size={64} color="#355E3B" />
              <Text>Time Tracker</Text>
            </View>
          </Link>
        </View>
        <View style={styles.newBikes}>
          <View>
            <ThemedText type="title" style={{ paddingHorizontal: 30 }}>
              New Bikes
            </ThemedText>
          </View>
          <ScrollView showsVerticalScrollIndicator={true} style={styles.SView} contentContainerStyle={styles.scrollViewCon}>
            {
              topBikes.map((bike, index) => {

                return (
                  <Link
                    key={index}
                    href={{
                      pathname: '/preview',
                      params: { ...bike }
                    }}
                    style={styles.card}
                  >
                    <Card
                      title={bike.bike_name}
                      description="see details"
                      imageSource={{ uri: bike.bike_image_url }} // Replace with your image path
                      status={bike.bike_status}
                    />
                  </Link>
                )
              })
            }
          </ScrollView>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "80%", // Adjust width as necessary
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#FFFFFFb2",
    borderRadius: 35,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },

  homeNav: {
    alignSelf: "center",
    backgroundColor: "#D6D6CA",
    height: RDim.height * 0.13,
    width: RDim.width * 0.8,
    borderRadius: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    marginTop: 60,
  },
  hnlink: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  newBikes: {
    marginTop: 40,
    alignSelf: 'center'
  },


  SView: {
    height: RDim.height * 0.58,
    width: RDim.width,
    maxHeight: RDim.height * 0.58,
    alignSelf: 'center'
  },
  scrollViewCon: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 8,
    margin: RDim.scale * 4,
    overflow: "hidden", // Ensures the border radius is applied
  },
  imageBackground: {
    width: RDim.width * 0.5 - 25,
    height: RDim.height * 0.15 - 25, // Set the height of the card
    justifyContent: "flex-end", // Align content at the bottom
  },
  image: {
    borderRadius: 8,
  },
  cardContent: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for text
    padding: RDim.scale * 1,
  },
  title: {
    fontSize: RDim.scale * 5,
    fontWeight: "bold",
    color: "#fff", // Text color
  },
  description: {
    fontSize: RDim.scale * 4,
    color: "#fff", // Text color
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for dimming
  },
});
