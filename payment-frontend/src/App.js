import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    id: null, // Added to track the ID for editing
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    cardType: "Visa", // Default card type
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing an existing card
  const [userId, setUserId] = useState("testUser123"); // Default user ID for testing

  // Fetch payment methods when the component mounts or userId changes
  useEffect(() => {
    fetchPayments();
  }, [userId]);

  // Fetch payment methods for the user
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

  // Handle input changes for the billing form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  // Handle saving a new or edited payment method
  const handleSavePaymentMethod = (e) => {
    e.preventDefault();

    // Basic validation for card number and CVV
    if (!billingInfo.cardNumber.match(/^\d{16}$/)) {
      setErrorMessage("Card number must be exactly 16 digits.");
      return;
    }
    if (!billingInfo.cvv.match(/^\d{3}$/)) {
      setErrorMessage("CVV must be exactly 3 digits.");
      return;
    }

    const apiEndpoint = isEditing
      ? `http://localhost:8080/payment-methods/${billingInfo.id}`
      : "http://localhost:8080/payment-methods";

    const requestMethod = isEditing ? axios.put : axios.post;

    // Send payment data to backend
    requestMethod(apiEndpoint, {
      userId,
      cardNumber: billingInfo.cardNumber,
      cardHolderName: billingInfo.cardHolderName,
      expirationDate: billingInfo.expiryDate,
      cardType: billingInfo.cardType,
      // Don't send CVV when editing
      ...(isEditing ? {} : { cvv: billingInfo.cvv }), // Only include CVV if it's a new card
    })
      .then((response) => {
        setPaymentSuccess(true);
        setErrorMessage("");
        fetchPayments(); // Refresh the list of payment methods
        setBillingInfo({
          id: null,
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardHolderName: "",
          cardType: "Visa",
        }); // Clear the form
        setIsEditing(false); // Exit editing mode
        // Hide success message after 3 seconds
        setTimeout(() => {
          setPaymentSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage("Error saving payment method.");
        console.error(error);
      });
  };

  // Handle editing an existing payment method
  const handleEdit = (method) => {
    setBillingInfo({
      id: method.id,
      cardNumber: method.cardNumber,
      expiryDate: method.expirationDate,
      cvv: "", // Don't populate CVV for security reasons
      cardHolderName: method.cardHolderName,
      cardType: method.cardType,
    });
    setIsEditing(true); // Enter editing mode
  };

  // Handle deleting a payment method
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/payment-methods/${id}`)
      .then(() => {
        fetchPayments(); // Refresh the list of payment methods
      })
      .catch((error) => {
        setErrorMessage("Error deleting payment method.");
        console.error(error);
      });
  };

  return (
    <div className="payment-container">
      <h1>Dilshan Fashion</h1>
      {paymentSuccess && (
        <div className="success-message">
          {isEditing
            ? "Payment method updated successfully!"
            : "Payment method saved successfully!"}
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Payment Methods</h2>
      {paymentMethods.length === 0 ? (
        <p>No payment methods available.</p>
      ) : (
        <ul>
          {paymentMethods.map((method) => (
            <li key={method.id}>
              <p>Card Number: **** **** **** {method.cardNumber.slice(-4)}</p>
              <p>Card Holder: {method.cardHolderName}</p>
              <p>Card Type: {method.cardType}</p>
              <p>Expiration Date: {method.expirationDate}</p>
              <button onClick={() => handleEdit(method)}>Edit</button>
              <button onClick={() => handleDelete(method.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h2>{isEditing ? "Edit Payment Method" : "Add a New Payment Method"}</h2>
      <form onSubmit={handleSavePaymentMethod} className="billing-form">
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
            placeholder="3-digit CVV"
            required={!isEditing} // CVV is required only when adding a new card
          />
        </div>
        <button type="submit">
          {isEditing ? "Update Payment Method" : "Save Payment Method"}
        </button>
      </form>
    </div>
  );
}

export default App;
