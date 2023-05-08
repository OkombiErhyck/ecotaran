import React, { useState } from 'react';
import axios from 'axios';
import './checkout.css';

const CheckoutPage = ({ cartItems, total }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    sector:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const storedCartItems = JSON.parse(window.localStorage.getItem('cart'));
  
      const response = await axios.post('/orders', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        sector: formData.sector,
        cartItems: storedCartItems ? [...storedCartItems] : [],
      });
  
      window.localStorage.removeItem('cart');
  
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Nume:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Prenume:
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
          Adresa:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Oras:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        <label>
          nr. tel.:
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="place-order-button">
          Plaseaza Comanda
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
