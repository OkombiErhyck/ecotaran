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

  const sendSMS = async () => {
    try {
      await axios.post('/send-sms', {
        phoneNumber: '+40754251033',
        message: 'o noua comanda a fost plasata!',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedCartItems = JSON.parse(
        window.localStorage.getItem('cart')
      );

      await axios.post('/orders', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        cartItems: storedCartItems ? [...storedCartItems] : [],
      });

      window.localStorage.removeItem('cart');

      await sendSMS();

      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Rest of your form */}
        <button type="submit" className="place-order-button">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
