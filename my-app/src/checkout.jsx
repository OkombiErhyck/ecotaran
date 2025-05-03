import React, { useState } from 'react';
import axios from 'axios';
import './checkout.css';

const CheckoutPage = ({ cartItems, total }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    x: '',
    y: '',
    rep: '', // Include the rep field in the initial state
    zipCode: '',
  });

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedCartItems = JSON.parse(window.localStorage.getItem('cart'));

      const response = await axios.post('/orders', {
        ...formData, // Include all form data
        status: 'Pending',
        cartItems: storedCartItems ? [...storedCartItems] : [],
      });

      window.localStorage.removeItem('cart');

      setSubmissionMessage('Cererea a fost trimisa cu succes. Multumim!');

      // Start the countdown timer
      const timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      // Redirect to home page after countdown
      setTimeout(() => {
        clearInterval(timer);
        window.location.href = '/';
      }, countdown * 1000);

    } catch (error) {
      console.error(error);
      setSubmissionMessage('There was an error submitting your request. Please try again later.');
    }
  };


  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Formular concediu</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Numele complet conform Buletin
          <input style={{ borderRadius: "10px" }}
            type="text"
            name="firstName"
            placeholder='EX. John Doe'
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
           Numarul total de zile :

          <input style={{borderRadius:"10px"}}
            type="text"
            name="lastName"
            placeholder='EX. 8'
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
           Introdu data de la care vei incepere:
          <input style={{borderRadius:"10px"}}
            type="text"
            name="x"
            placeholder='EX. 10.03.2024'
            value={formData.x}
            onChange={handleChange}
          />
        </label>
        <label>
         Introduceti data de incheiere:
          <input style={{borderRadius:"10px"}}
            type="text"
            name="y"
            placeholder='Ex. 14.04.2024'
            value={formData.y}
            onChange={handleChange}
          />
        </label>
        <label>
         Cine iti va tine locul?
          <input style={{borderRadius:"10px"}}
            type="text"
            name="rep"
            placeholder='Numele complet'
            value={formData.rep}
            onChange={handleChange}
          />
        </label>
        <label>
  Selecteaza tipul cererii de concediu:
  <select
    style={{ borderRadius: "10px" }}
    name="email"
    value={formData.email}
    onChange={handleChange} 
  >
    <option value="">Selecteaza motivul cererii</option>
    <option value="Concediu de odihna">Concediu de odihna </option>
    <option value="Concediu fără plata">Concediu fără plata</option>
    <option value="Concediu pentru evenimente speciale">Concediu pentru evenimente speciale</option>
  </select>
</label>

<label>
  Numele angajatorului
  <select
    name="address"
    value={formData.address}
    onChange={handleChange}
    style={{ borderRadius: "15px" }}
  >
    <option value="">Selectează angajatorul din lista</option>
    <option value="Capital Clean">Capital Clean</option>
    <option value="Complete Recruitment">Complete Recruitment</option>
    
    
  </select>
</label>
        <label>
         Numele postului pe care lucrati
          <input  style={{borderRadius:"10px"}}
            type="text"
            placeholder='EX. Supervizor'
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
       
        <label>
          Numarul de telefon la care puteti fi contactat
          
          <input style={{borderRadius:"10px"}}
            type="text"
            name="zipCode"
            placeholder='07XXXXXX23'
            value={formData.zipCode}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="place-order-button">
          Trimite cererea
        </button>
        {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
        {submissionMessage && countdown > 0 && (
          <p>In {countdown} ve-ti fi redirectionat catre pagina principala</p>
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
