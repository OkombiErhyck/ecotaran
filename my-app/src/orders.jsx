import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      await axios.put(`/orders/${orderId}/markDelivered`);
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
    <div>
      <h1>Orders</h1>
      {orders.map((order, index) => (
        <div key={index} className={`order ${order.status === 'Delivered' ? 'delivered' : ''}`}>
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
                <div key={placeIndex}>
                  <p>{place.title} - Lei{place.km}</p>
                  {/* Access other necessary fields of the place data */}
                  <p>{place.description}</p>
                  <p>{place.price}</p>
                  {/* Add more fields as needed */}
                </div>
              ))
            ) : (
              <p>No places found for this order.</p>
            )}
          </div>
          <button
            onClick={() => handleClickDelivered(order._id)}
            disabled={order.status === 'Delivered'}
          >
            Mark as Delivered
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
