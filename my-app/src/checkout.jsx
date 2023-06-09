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
          <input style={{borderRadius:"10px"}}
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Prenume:
          <input style={{borderRadius:"10px"}}
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input style={{borderRadius:"10px"}}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Adresa:
          <input  style={{borderRadius:"10px"}}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Oras:
          <input  style={{borderRadius:"10px"}}
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
       
        <label>
          nr. tel.:
          <input style={{borderRadius:"10px"}}
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