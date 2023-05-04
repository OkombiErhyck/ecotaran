import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to retrieve orders: ', error);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/markDelivered`);
      fetchOrders(); // Refresh the orders after marking as delivered
    } catch (error) {
      console.error('Failed to mark order as delivered: ', error);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className={`order ${order.delivered ? 'delivered' : ''}`}>
            <h3>Order #{index + 1}</h3>
            <div>
              <strong>Delivery Details:</strong>
              <p>First Name: {order.firstName}</p>
              <p>Last Name: {order.lastName}</p>
              <p>Email: {order.email}</p>
              <p>Address: {order.address}</p>
              <p>City: {order.city}</p>
              <p>ZIP Code: {order.zipCode}</p>
            </div>
            <div>
              <strong>Cart Places:</strong>
              {order.cartItems && order.cartItems.length > 0 ? (
                order.cartItems.map((place, placeIndex) => (
                  <div key={placeIndex} className="place-details">
                    <p className="place-title">{place.title} - Lei{place.km}</p>
                    <p className="place-description">{place.description}</p>
                    <p className="place-price">{place.price}</p>
                  </div>
                ))
              ) : (
                <p>No places found for this order.</p>
              )}
            </div>
            <button
              className={`deliver-button ${order.delivered ? 'delivered' : ''}`}
              onClick={() => markAsDelivered(order._id)}
              disabled={order.delivered}
            >
              Mark as Delivered
            </button>
            <p className="order-status">
              Order Status: {order.delivered ? 'Delivered' : 'Not Delivered'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
