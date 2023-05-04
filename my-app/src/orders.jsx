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

  const markAsDelivered = (orderId) => {
    axios
      .put(`/orders/${orderId}/delivered`)
      .then((response) => {
        // Update the orders state to reflect the change
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              delivered: true,
            };
          }
          return order;
        });
        setOrders(updatedOrders);
      })
      .catch((error) => {
        console.error('Failed to mark order as delivered: ', error);
      });
  };

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order, index) => (
        <div key={index} className="order">
          <h3>Order #{index + 1}</h3>
          <div className="delivery-details">
            <strong>Delivery Details:</strong>
            <p>First Name: {order.firstName}</p>
            <p>Last Name: {order.lastName}</p>
            <p>Email: {order.email}</p>
            <p>Address: {order.address}</p>
            <p>City: {order.city}</p>
            <p>ZIP Code: {order.zipCode}</p>
          </div>
          <div className="cart-places">
            <strong>Cart Places:</strong>
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((place, placeIndex) => (
                <div className="place" key={placeIndex}>
                  <p className="place-title">{place.title} - Lei{place.km}</p>
                  <p className="place-description">{place.description}</p>
                  <p className="place-price">{place.price}</p>
                </div>
              ))
            ) : (
              <p>No places found for this order.</p>
            )}
          </div>
          {!order.delivered && (
            <button onClick={() => markAsDelivered(order._id)}>Mark as Delivered</button>
          )}
          {order.delivered && <p>Order Delivered</p>}
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
