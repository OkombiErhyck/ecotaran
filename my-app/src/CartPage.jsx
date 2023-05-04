import React, { useState, useEffect } from 'react';
import Image from './image';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Function to remove an item from the cart
 // Function to remove an item from the cart
const removeFromCart = (title) => {
  const updatedCartItems = cartItems.filter((place) => place.title !== title);
  setCartItems(updatedCartItems);
  localStorage.setItem('cart', JSON.stringify(updatedCartItems)); // Update the cart data in localStorage
};


  // Function to calculate the total price of the cart
  const calculateTotalKm = () => {
    return cartItems.reduce((total, place) => total + place.km, 0);
  };

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p style={emptyCartStyle}>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((place) => (
            <div key={place.id} style={cartItemStyle}>
              <h3>{place.title}</h3>
              {place.photos.length > 0 && (
                <Image
                  src={place.photos[0]}
                  alt={place.title}
                  className="img-fluid"
                  style={{
                    height: '100px',
                    width: '30%',
                    objectFit: 'cover',
                  }}
                />
              )}
              <p style={priceStyle}>Price: Lei{place.km}</p>
              <button style={removeButtonStyle} onClick={() => removeFromCart(place.title)}>
    Remove from Cart
  </button>
            </div>
          ))}
          <h3 style={totalStyle}>Total: {calculateTotalKm()} Lei</h3>
          <Link to="/checkout">
            <button style={checkoutButtonStyle}>Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  fontSize: '3rem',
  textAlign: 'center',
  marginBottom: '2rem',
};

const emptyCartStyle = {
  fontSize: '1.5rem',
  textAlign: 'center',
};

const cartItemStyle = {
  marginBottom: '20px',
  borderBottom: '1px solid #ccc',
  paddingBottom: '10px',
};

const priceStyle = {
  fontSize: '1.2rem',
  marginBottom: '10px',
};

const removeButtonStyle = {
  backgroundColor: '#ff5252',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const totalStyle = {
  marginTop: '2rem',
  fontSize: '2rem',
  fontWeight: 'bold',
};

const checkoutButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
 
  cursor: 'pointer',
  marginTop: '2rem',
  display: 'block',
  margin: '0 auto',
};

export default CartPage;
