import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/orders')
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
    <div>
      <h1>Orders</h1>
      {orders.map((order, index) => (
        <div key={index} className="order">
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
            <strong>Cart Items:</strong>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, itemIndex) => (
                <p key={itemIndex}>{item.name} - ${item.price}</p>
              ))
            ) : (
              <p>No items found for this order.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
