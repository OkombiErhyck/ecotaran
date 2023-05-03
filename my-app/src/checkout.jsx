import React, { useState } from 'react';
import './checkout.css';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the existing orders from localStorage or initialize an empty array
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Create a new order object with the form data and add it to the orders array
    const newOrder = {
      formData,
      cartItems: [], // Modify this with the actual cart items
    };
    existingOrders.push(newOrder);

    // Update the orders array in localStorage
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Reset form data
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
    });

    // Redirect to the orders page
    window.location.href = '/';
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        <label>
          ZIP Code:
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="place-order-button">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
