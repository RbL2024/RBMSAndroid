import React from "react";
import axios from "axios";

const localAPI = 'http://192.168.1.10:8917';
const cloudAPI = 'https://rbms-backend-g216.onrender.com';
const apiServer = cloudAPI; // Change this to localAPI for local testing


export const fetchTopBikes = async () => {
  try {
    const response = await axios.get(`${apiServer}/rbmsa/topBikes`); // Replace with your API endpoint
    return response.data // Assuming data is an array of bikes
  } catch (error) {
    console.log("Error fetching bikes: " + error.message);
  }
}

export const fetchAdultBikes = async () => {
  try {
    const data = {
      bike_type: 'Adult_bicycle'
    }
    const response = await axios.post(`${apiServer}/rbmsa/typeBikes`, data);
    return response.data // Assuming data is an array of bikes
  } catch (error) {
    console.log("Error fetching bikes: " + error.message);
  }
};

export const fetchKidsBikes = async () => {
  try {
    const data = {
      bike_type: 'Kid_bicycle'
    }
    const response = await axios.post(`${apiServer}/rbmsa/typeBikes`, data); // Replace with your API endpoint
    return response.data // Assuming data is an array of bikes
  } catch (error) {
    console.log("Error fetching bikes: " + error.message);
  }
}

export const loginAPI = `${apiServer}/rbmsa/loginAcc`;
export const loginTempAPI = `${apiServer}/rbmsa/loginTempAcc`;
export const registerAPI = `${apiServer}/rbmsa/createUser`;
export const reserveAPI = `${apiServer}/rbmsa/UpdateReserve`;
export const getResInfo = `${apiServer}/rbmsa/getReservations`;
export const getResInfobyEmail = `${apiServer}/rbmsa/getReservationsviaEmail`;
export const getRentInfobyEmail = `${apiServer}/rbmsa/getRentedsviaEmail`;
export const getResBike = `${apiServer}/rbmsa/reservedBike`;
export const checkBStat = `${apiServer}/rbmsa/checkBStat`;
export const getRentedBike = `${apiServer}/rbmsa/getRentedBike`;
export const getResBikeAll = `${apiServer}/rbmsa/getAllUser-Reservations`;
export const cancelReservation = `${apiServer}/rbmsa/cancelReservation`;
export const createTransaction = `${apiServer}/rbmsa/create-transaction`;
export const resetPassword = `${apiServer}/rbmsa/resetPassword`;
export const emailResetCode = `${apiServer}/rbmsa/sendPassResetCode`;
export const setNewPassword = `${apiServer}/rbmsa/setNewPass`;

export const getRentedBikeReserve = `${apiServer}/esp32/getRentedBikeReserve`;
export const getRented = `${apiServer}/esp32/getRentedBike`;
export const updateLockstate = `${apiServer}/esp32/updateLockState`;
export const updateAlarmstate = `${apiServer}/esp32/updateAlarmState`;
export const updateTempLockstate = `${apiServer}/esp32/updateTempLockState`;
export const updateTempAlarmstate = `${apiServer}/esp32/updateTempAlarmState`;