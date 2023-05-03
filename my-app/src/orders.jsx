import React, { useState, useEffect } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Orders</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className="order"
          style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h3>Order #{index + 1}</h3>
          <div style={{ marginTop: '10px' }}>
            <strong>Delivery Details:</strong>
            <p>First Name: {order.formData.firstName}</p>
            <p>Last Name: {order.formData.lastName}</p>
            <p>Email: {order.formData.email}</p>
            <p>Address: {order.formData.address}</p>
            <p>City: {order.formData.city}</p>
            <p>ZIP Code: {order.formData.zipCode}</p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <strong>Cart Items:</strong>
            {order.cartItems.map((item, itemIndex) => (
              <p key={itemIndex}>{item.name} - ${item.price}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
