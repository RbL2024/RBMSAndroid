import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import React from 'react';
import { Link } from 'expo-router';

import RDim from '@/hooks/useDimensions';


import bikeLogo from '../../assets/images/bikeLogo.png';
import google from '../../assets/images/google.png';

export default function Lorreg() {
  const handleGoogle = () => {
    Toast.info("Not yet implemented.");
  }
  return (
    <View style={styles.container}>
      <ToastManager
        position="top"
        textStyle={{ fontSize: 12, paddingHorizontal: 10 }}
        duration={2000}
        showCloseIcon={false}
        showProgressBar={false}
      />
      <View>
        <Image source={bikeLogo} style={styles.image} />
      </View>
      <View style={styles.btnCon}>
        <TouchableOpacity onPress={() => handleGoogle()}>
          <View style={styles.btns}>
            <Image source={google} style={styles.googleImage} />
            <Text style={styles.btnText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        <Link href={{ pathname: '/register' }}>
          <View style={styles.btns}>
            <Text style={styles.btnText}>Sign Up</Text>
          </View>
        </Link>
      </View>
      <View style={styles.aha}>
        <Link href={{ pathname: '/login' }}>
          <Text style={{ fontFamily: 'mplusb', fontSize: RDim.width * 0.04 }}>already have an account?</Text>
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
  aha: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: RDim.height * 0.3
  }
})