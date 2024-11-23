import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    cardType: "Visa",  // Default card type
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("testUser123"); // Default user ID or use logged-in user ID

  // Fetch payment methods when the component mounts
  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const fetchPayments = () => {
    axios
      .get(`http://localhost:8080/payment-methods/${userId}`)
      .then((response) => {
        setPaymentMethods(response.data);
      })
      .catch((error) => {
        setErrorMessage("Failed to load payment methods.");
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const handlePayment = (e) => {
    e.preventDefault();

    // Validate card number and CVC
    if (!billingInfo.cardNumber.match(/^\d{16}$/)) {
      setErrorMessage("Card number must be exactly 16 digits and numeric.");
      return;
    }
    if (!billingInfo.cvv.match(/^\d{3}$/)) {
      setErrorMessage("CVC must be exactly 3 digits and numeric.");
      return;
    }

    // Send payment data to backend
    axios
      .post("http://localhost:8080/payment-methods", {
        userId,
        cardNumber: billingInfo.cardNumber,
        cardHolderName: billingInfo.cardHolderName,
        expirationDate: billingInfo.expiryDate,
        cardType: billingInfo.cardType,
        isPreferred: false, // Default to not preferred
      })
      .then((response) => {
        setPaymentSuccess(true);
        setErrorMessage("");
        fetchPayments(); // Refresh payment methods
      })
      .catch((error) => {
        setErrorMessage("Error processing payment.");
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/payment-methods/${id}`)
      .then(() => {
        fetchPayments(); // Refresh payment methods
      })
      .catch((error) => {
        setErrorMessage("Error deleting payment method.");
        console.error(error);
      });
  };

  const handleEdit = (paymentMethod) => {
    setBillingInfo(paymentMethod); // Populate the form with existing details
  };

  const handleSetPreferred = (id) => {
    axios
      .post(`http://localhost:8080/payment-methods/set-preferred/${userId}/${id}`)
      .then(() => {
        fetchPayments(); // Refresh payment methods
      })
      .catch((error) => {
        setErrorMessage("Error setting preferred payment method.");
        console.error(error);
      });
  };

  return (
    <div className="payment-container">
      <h1>Dilshan Fashion</h1>
      {paymentSuccess && (
        <div className="success-message">Payment method added successfully!</div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Payment Methods</h2>
      <button onClick={() => setBillingInfo({ ...billingInfo, cardType: "Visa" })}>
        Add New Payment Method
      </button>
      {paymentMethods.length === 0 ? (
        <p>No payment methods available</p>
      ) : (
        <ul>
          {paymentMethods.map((method) => (
            <li key={method.id}>
              <p>Card Number: {method.cardNumber}</p>
              <p>Card Holder: {method.cardHolderName}</p>
              <p>Card Type: {method.cardType}</p>
              <p>Expiration Date: {method.expirationDate}</p>
              <button onClick={() => handleSetPreferred(method.id)}>Set Preferred</button>
              <button onClick={() => handleEdit(method)}>Edit</button>
              <button onClick={() => handleDelete(method.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handlePayment} className="billing-form">
        <div className="form-group">
          <label>Card Type</label>
          <select
            name="cardType"
            value={billingInfo.cardType}
            onChange={handleInputChange}
            required
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="AMEX">AMEX</option>
            <option value="Discover">Discover</option>
          </select>
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={billingInfo.cardNumber}
            onChange={handleInputChange}
            placeholder="Enter 16-digit card number"
            required
          />
        </div>
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardHolderName"
            value={billingInfo.cardHolderName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Expiration Date</label>
          <input
            type="text"
            name="expiryDate"
            value={billingInfo.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={billingInfo.cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Save Payment Method</button>
      </form>
    </div>
  );
}

export default App;
