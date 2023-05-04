import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get('/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Failed to retrieve orders: ', error);
      });
  }, []);

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      {orders.map((order, index) => (
        <div key={index} className="order">
          <h3 className="order-number">Order #{index + 1}</h3>
          <div className="delivery-details">
            <strong>Delivery Details:</strong>
            <p><span>First Name:</span> {order.firstName}</p>
            <p><span>Last Name:</span> {order.lastName}</p>
            <p><span>Email:</span> {order.email}</p>
            <p><span>Address:</span> {order.address}</p>
            <p><span>City:</span> {order.city}</p>
            <p><span>ZIP Code:</span> {order.zipCode}</p>
          </div>
          <div className="cart-places">
            <strong>Cart Places:</strong>
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((place, placeIndex) => (
                <div key={placeIndex} className="place">
                  <p className="place-title">{place.title} - Lei{place.km}</p>
                  {/* Access other necessary fields of the place data */}
                  <p className="place-description">{place.description}</p>
                  <p className="place-price">{place.price}</p>
                  {/* Add more fields as needed */}
                </div>
              ))
            ) : (
              <p>No places found for this order.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
