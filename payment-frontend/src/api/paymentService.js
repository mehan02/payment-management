import axiosInstance from './axiosInstance';

function fetchPayments(userId) {
  return axiosInstance.get(`/payment-methods/${userId}`) // Correct API endpoint for fetching payment methods
    .then(response => response.data) // Return the data received from the backend
    .catch(error => {
      console.error('Error fetching payments:', error); // Log the error
      throw error; // Rethrow to handle it where called
    });
}

export default fetchPayments;
