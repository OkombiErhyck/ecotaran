import React, { useState, useContext } from 'react';
import axios from 'axios';
import './checkout.css';

const CheckoutPage = ({ cartItems, total }) => {
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    motiv: '',
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
        ...formData, // Include all form data
        status: 'Pending',
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
      <h1 className="checkout-title">Formular concediu</h1>
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
          Perioada:
          <input style={{borderRadius:"10px"}}
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
  Tip:
  <select
    style={{ borderRadius: "10px" }}
    name="motiv"
    value={formData.motiv}
    onChange={handleChange}
  >
    <option value="">Selecteaza motivul cererii</option>
    <option value="Concediu de odihna">Concediu de odihna </option>
    <option value="Concediu fără plata">Concediu fără plata</option>
    <option value="Concediu pentru evenimente speciale">Concediu pentru evenimente speciale</option>
  </select>
</label>

        <label>
          Angajat al:
          <input  style={{borderRadius:"10px"}}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Functia:
          <input  style={{borderRadius:"10px"}}
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
       
        <label>
          Telefon:
          <input style={{borderRadius:"10px"}}
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="place-order-button">
          Trimite cererea
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
