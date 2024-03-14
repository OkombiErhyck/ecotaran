import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [statusChangeMessage, setStatusChangeMessage] = useState(null);

  useEffect(() => {
    axios
      .get('/orders')
      .then((response) => {
        console.log(response.data); // Check API response structure
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Failed to retrieve orders: ', error);
      });
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}`, { status });
      // Refresh the orders list by making another GET request
      const response = await axios.get('/orders');
      console.log(response.data); // Check updated orders data
      setOrders(response.data);
      setStatusChangeMessage(`Statusul cererii #${orderId} a fost modificat cu succes!`);
      // Clear the message after a delay
      setTimeout(() => {
        setStatusChangeMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to update order status: ', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!statusFilter || order.status === statusFilter) &&
    (!monthFilter || new Date(order.createdAt).getMonth() === monthFilter - 1) // Adjusted comparison
  );

  const handleFilter = (status) => {
    setStatusFilter(status);
  };

  const handleMonthFilter = (month) => {
    setMonthFilter(parseInt(month));
  };

  const handleShowAllOrders = () => {
    setShowAllOrders(true);
  };

  return (
    <div className="orders-container">
      <br></br>
      <br></br>
      <br></br>
      <h1>Cereri de Concediu</h1>
      <div>
        <input
          type="text"
          placeholder="Cauta"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="filter-button1" onClick={() => handleFilter('Pending')}>In asteptare</button>
        <button className="filter-button2" onClick={() => handleFilter('Accepted')}>Aprobate</button>
        <button className="filter-button3" onClick={() => handleFilter('Rejected')}>Respinse</button>
        <select onChange={(e) => handleMonthFilter(e.target.value)}>
          <option value="">Selecteaza luna</option>
          <option value={1}>Ianuarie</option>
          <option value={2}>Februarie</option>
          <option value={3}>Martie</option>
          <option value={4}>Aprilie</option>
          <option value={5}>Mai</option>
          <option value={6}>Iunie</option>
          <option value={7}>Iulie</option>
          <option value={8}>August</option>
          <option value={9}>Septembrie</option>
          <option value={10}>Octombrie</option>
          <option value={11}>Noembrie</option>
          <option value={12}>Decembrie</option>
        </select>
        <button onClick={handleShowAllOrders}>Afiseaza toate cererile</button>
      </div>
      {showAllOrders && (
        <>
          {filteredOrders.length === 0 ? (
            <h1>Nu a fost gasita nici o cerere</h1>
          ) : (
            filteredOrders.map((order, index) => (
              <div
                key={index}
                className={`order ${order.delivered ? 'order-delivered' : ''}`}
              >
                <h3>Cererea #{index + 1}</h3>
                <p>Creata la: {new Date(order.createdAt).toLocaleString()}</p>
                <div className="delivery-details">
                  <strong>Detalii:</strong>
                  <p>Nume: {order.firstName}</p>
                  <p>Perioada: {order.lastName}</p>
                  <p>
                    Tip:
                    <select
                      value={order.motiv}
                      disabled // Disable the select input to show the selected value
                    >
                      <option value="Concediu de odihna">Concediu de odihna</option>
                      <option value="Concediu fără plata">Concediu fără plata</option>
                      <option value="Concediu pentru evenimente speciale">Concediu pentru evenimente speciale</option>
                    </select>
                  </p>
                  <p>Angajat al: {order.address}</p>
                  <p>Functia: {order.city}</p>
                  <p>Telefon: {order.zipCode}</p>
                </div>
                <div className="status-buttons">
                  {order.status === 'Pending' && (
                    <div className="status-buttons">
                      <button
                        onClick={() => handleStatusChange(order._id, 'Accepted')}
                        onMouseEnter={() => setStatusChangeMessage(null)}
                      >
                        Aproba
                      </button>
                      <button
                        onClick={() => handleStatusChange(order._id, 'Rejected')}
                        onMouseEnter={() => setStatusChangeMessage(null)}
                      >
                        Respinge
                      </button>
                    </div>
                  )}
                  {order.status === 'Accepted' && (
                    <button style={{ backgroundColor: 'lime' }} disabled>Cerere Aprobata</button>
                  )}
                  {order.status === 'Rejected' && (
                    <button style={{ backgroundColor: 'red' }} disabled>Cerere Respinsa</button>
                  )}
                </div>
                {statusChangeMessage && (
                  <p className="status-change-message">{statusChangeMessage}</p>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
