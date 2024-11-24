import { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentMethods({ userId }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetchPayments();
  }, [userId]); // Run fetchPayments when userId changes

  // Fetch payment methods from the backend
  const fetchPayments = () => {
    setLoading(true); // Start loading when fetching data

    axios
      .get(`http://localhost:8080/payment-methods/${userId}`)
      .then((response) => {
        console.log('Fetched payment methods:', response.data); // Check the fetched data
        setPaymentMethods(response.data); // Update state with payment methods
        setLoading(false); // Set loading to false after fetching is done
      })
      .catch((error) => {
        setErrorMessage('Failed to load payment methods.'); // Show error if fetch fails
        console.error(error);
        setLoading(false); // Set loading to false after error
      });
  };

  if (loading) {
    return <div>Loading payment methods...</div>; // Show loading message
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>; // Show error message if fetching fails
  }

  return (
    <div>
      <h1>Your Payment Methods</h1>
      {paymentMethods.length === 0 ? (
        <p>No payment methods available.</p> // Show message if no payment methods exist
      ) : (
        <ul>
          {paymentMethods.map((method) => (
            <li key={method.id}>
              <strong>{method.cardType}</strong> ending in {method.cardNumber.slice(-4)}{' '}
              (Preferred: {method.isPreferred ? 'Yes' : 'No'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentMethods;
