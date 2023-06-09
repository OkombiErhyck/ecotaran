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
      await axios.put(`/orders/${orderId}`, { delivered: true, status: 'Delivered' });
      // Refresh the orders list by making another GET request
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to mark order as delivered: ', error);
    }
  };

  const handleGetDirections = (address) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  const calculateTotalKm = (cartItems) => {
    let totalKm = 0;
    cartItems.forEach((place) => {
      totalKm += place.km * place.quantity;
    });
    return totalKm;
  };

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
            <p>Orasul: {order.city}</p>
            <p>Telefon: {order.zipCode}</p>
            <button
              className="get-directions-btn"
              onClick={() => handleGetDirections(order.address)}
            >
              Get Directions
            </button>
          </div>
          <div className="cart-places">
            <strong>Cart Places:</strong>
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((place, placeIndex) => (
                <div key={placeIndex} className="place">
                  <p className="place-title">{place.title} -  {place.km} Lei</p>
                  <p className="place-description">{place.description}</p>
                  <p className="place-price">{place.price}</p>
                  <p style={{ borderBottom: "solid 2px red" }} className="place-quantity">Cantitate: {place.quantity}</p> {/* Added quantity field */}
                  {/* Add more fields as needed */}
                </div>
              ))
            ) : (
              <p>No places found for this order.</p>
            )}
            <p style={{ marginTop: '10px' }}>
              Total : {calculateTotalKm(order.cartItems)} Lei
            </p>
          </div>
          <button
            className="mark
-delivered-btn"
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