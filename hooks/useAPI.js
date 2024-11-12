// useAPI.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const localAPI = 'http://192.168.1.10:8917';
const cloudAPI = 'https://rbms-backend-g216.onrender.com';

const useAPI = () => {
  const [topBikes, setTopBikes] = useState([]);
  const [allAdult, setAllAdult] = useState([]);
  const [allKiddy, setAllKiddy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopBikes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${cloudAPI}/rbmsa/topBikes`); // Replace with your API endpoint
      setTopBikes(response.data); // Assuming data is an array of bikes
    } catch (error) {
      setError("Error fetching bikes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdultBikes = async () => {
    setLoading(true);
    try {
      const data = {
        bike_type: 'Adult_bicycle'
    }
      const response = await axios.post(`${cloudAPI}/rbmsa/typeBikes`, data); // Replace with your API endpoint
      setAllAdult(response.data); // Assuming data is an array of bikes
    } catch (error) {
      setError("Error fetching bikes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchKiddyBikes = async () => {
    setLoading(true);
    try {
      const data = {
        bike_type: 'Kid_bicycle'
    }
      const response = await axios.post(`${cloudAPI}/rbmsa/typeBikes`, data); // Replace with your API endpoint
      setAllKiddy(response.data); // Assuming data is an array of bikes
    } catch (error) {
      setError("Error fetching bikes: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTopBikes(); 
    const intervalId = setInterval(() => {
      fetchTopBikes(); // Fetch bikes every 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchAdultBikes(); 
    const intervalId = setInterval(() => {
      fetchAdultBikes(); // Fetch bikes every 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchKiddyBikes(); 
    const intervalId = setInterval(() => {
      fetchKiddyBikes(); // Fetch bikes every 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return { topBikes, allAdult, allKiddy, loading, error };
};

export default useAPI;