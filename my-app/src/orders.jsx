import React, { useState, useEffect } from 'react';
import axios from 'axios';
import concediuccg from './images/concediuccg.png';

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
  
      // Generate and download the document if status is 'Accepted'
      if (status === 'Accepted') {
        generateDocument(orderId); // Call function to generate document
      }
  
      // Clear the message after a delay
      setTimeout(() => {
        setStatusChangeMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to update order status: ', error);
    }
  };

  

  const generateDocument = (orderId) => {
    // Fetch order data for the specific orderId
    const order = orders.find(order => order._id === orderId);
    
    // Create a document content based on the order data
    const documentContent = `
      <html>
      <head>
          <style>
              body {
                font-family: Arial, sans-serif;
              }

              /* Additional styles for content */
              .document-content {
                margin: 0 auto;
                max-width: 600px;
                text-align: left;
                line-height: 1.5;
                font-size: 16px;
              }

              h1 {
                font-size: 18px;
                text-align: center;
                margin-bottom: 60px;
                margin-top: 20px;
              }

              .signature-section {
                margin-top: 50px;
                text-align: left;
              }

              .signature-section p {
                margin: 30;
                display: inline-block;
                vertical-align: top;
              }

              .indented {
                text-indent: 2em; /* Adjust the indentation as needed */
              }
              .h2 {
                font-size:130px;
                color:#667gff;
                margin-buttom:140px;
              }
          </style>
      </head>
      <body>

     

          <div class="document-content">
            
          
         <img src="${concediuccg}" alt="Header Image" style="max-width: 100%; height: auto;" />
          
          
          
          <br>
          <br>

          
          <h1>CERERE PRIVIND EFECTUAREA CONCEDIULUI</h1>
            
            
            
            
            <p class="indented">
                Subsemnatul/a ${order.firstName} angajat/ă al/a SC ${order.address} SRL, în funcția de ${order.city}, vă rog să-mi aprobați efectuarea a ${order.lastName} zile libere de la data de ${order.x} până în data de ${order.y}.
            </p>
            <p class="indented">
                Menționez că zilele libere solicitate reprezintă: ${order.email}
            </p>
            <p class="indented">
                Mentionez că pe durata desfășurării concediului, persoana care îmi va ţine locul în această perioadă este: d-nul /d-na ${order.rep} <br />
                (numele persoanei înlocuitoare va fi specificat numai dupa aprobarea șefului de departament, dacă este cazul).
            </p>
             
            <div class="signature-section">
              <p>Departament Resurse:</p>   <br>    <p> Semnătură angajat:</p>                           
             
            </div>
            <p>Data: ${order.createdAt}</p>
          </div>
      </body>
      </html>
    `;
  
    // Create a Blob containing the document content
    const blob = new Blob([documentContent], { type: 'text/html' });
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a temporary <a> element to initiate the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Order_${orderId}.html`;
    document.body.appendChild(a);
  
    // Initiate the download
    a.click();
  
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
                  <p>Nr. zile: {order.lastName}</p>
                  <p>De la : {order.x}</p>
                  <p>Pana la : {order.y}</p>
                  <p>Inlocuitor: {order.rep}</p>
                  <p>
                    Tip: {order.email}
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
