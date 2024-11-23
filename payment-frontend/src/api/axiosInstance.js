 

// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",  // Make sure this is pointing to your back-end
  headers: {
    "Content-Type": "application/json",
    // If you have an authentication token, add it here:
    // "Authorization": `Bearer ${localStorage.getItem('authToken')}`
  }
});

export default axiosInstance;
