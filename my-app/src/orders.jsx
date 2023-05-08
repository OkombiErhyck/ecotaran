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

  const handleClickDelivered = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}`, { delivered: true, status: 'Delivered' }); // Send the status property in the request
      // Refresh the orders list by making another GET request
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to mark order as delivered: ', error);
    }
  };
  

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className={`order ${order.delivered ? 'order-delivered' : ''}`}
        >
          <h3>Order #{index + 1}</h3>
          <p>Created at: {new Date(order.createdAt).toLocaleString()}</p>
          <div className="delivery-details">
            <strong>Delivery Details:</strong>
            <p>Nume: {order.firstName}</p>
            <p>Prenume: {order.lastName}</p>
            <p>Email: {order.email}</p>
            <p>Adresa: {order.address}</p>
            <p>Sectorul:{order.sector}</p>
            <p>Orasul: {order.city}</p>
            <p>Telefon: {order.zipCode}</p>
          </div>
          <div className="cart-places">
            <strong>Cart Places:</strong>
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((place, placeIndex) => (
                <div key={placeIndex} className="place">
                  <p className="place-title">{place.title} - Lei{place.km}</p>
                  <p className="place-description">{place.description}</p>
                  <p className="place-price">{place.price}</p>
                  {/* Add more fields as needed */}
                </div>
              ))
            ) : (
              <p>No places found for this order.</p>
            )}
          </div>
          <button
            className="mark-delivered-btn"
            onClick={() => handleClickDelivered(order._id)}
            disabled={order.status === 'Delivered'}
          >
            {order.status === 'Delivered' ? 'Delivered' : 'Mark as Delivered'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
