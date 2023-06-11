import React, { useState, useEffect, useContext } from 'react';
import Image from './image';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import carp from "./images/shopping-cart.png";

const CartPage = () => {
  const { cart, setCart } = useContext(UserContext);

  const removeFromCart = (title) => {
    const updatedCartItems = cart.filter((place) => place.title !== title);
    setCart(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const increaseQuantity = (title) => {
    const updatedCartItems = cart.map((place) => {
      if (place.title === title) {
        return { ...place, quantity: place.quantity + 1 };
      }
      return place;
    });
    setCart(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const calculateTotalKm = () => {
    return cart.reduce((total, place) => total + place.km * place.quantity, 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, place) => total + place.quantity, 0);
  };

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  return (
    <> 
    <div style={containerStyle}>
                <h1 style={headerStyle}>Cos de Cumparaturi</h1>
                {cart.length === 0 ? (
                  <div style={emptyCartStyle}>
                    <p>Cosul tau este gol.</p>
                    <img style={{height:"44vh", width:"auto"}} src={carp} alt="carp" /> 
                  </div>
                ) : (
        <div>
          {cart.map((place) => (
            <div key={place.id} style={cartItemStyle}>
              <div style={imageContainerStyle}>
                {place.photos.length > 0 && (
                  <Image
                    src={place.photos[0]}
                    alt={place.title}
                    className="img-fluid"
                    style={imageStyle}
                  />
                )}
              </div>
              <div style={detailsContainerStyle}>
                <h3>{place.title}</h3>
                <p style={priceStyle}>Price: Lei {place.km}</p>
                <div style={quantityContainerStyle}>
                  <button style={quantityButtonStyle} onClick={() => increaseQuantity(place.title)}>
                    +
                  </button>
                  <span style={quantityStyle}>{place.quantity}</span>
                  <button
                    style={quantityButtonStyle}
                    onClick={() => {
                      if (place.quantity > 1) {
                        setCart((prevCart) =>
                          prevCart.map((prevItem) =>
                            prevItem.title === place.title ? { ...prevItem, quantity: prevItem.quantity - 1 } : prevItem
                          )
                        );
                      } else {
                        removeFromCart(place.title);
                      }
                    }}
                  >
                    -
                  </button>
                </div>
                <button style={removeButtonStyle} onClick={() => removeFromCart(place.title)}>
                  Sterge din cos
                </button>
              </div>
            </div>
          ))}
          <div style={totalContainerStyle}>
            <h3 style={totalStyle}>Total: {calculateTotalKm()} Lei</h3>
            <p style={totalStyle}>Total Produse: {calculateTotalItems()}</p>
            <Link to="/checkout">
              <button style={checkoutButtonStyle}>Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
    </>
  );
};


// Styles

const containerStyle = {
  padding: '50px',
  marginTop: '100px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const headerStyle = {
  fontSize: '3rem',
  marginBottom: '2rem',
};

const emptyCartStyle = {
  fontSize: '1.5rem',
  textAlign: 'center',
};

const cartItemStyle = {
  display: 'flex',
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
};

const imageContainerStyle = {
  flex: '0 0 120px',
  marginRight: '20px',
};

const imageStyle = {
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
};

const detailsContainerStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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

const totalContainerStyle = {
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
};

const totalStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const checkoutButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const quantityContainerStyle = {
  display: 'flex',
  marginBottom:"15px",
  alignItems: 'center',
};

const quantityButtonStyle = {
  backgroundColor: '#cccccc',
  color: 'white',
  padding: '5px',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  marginRight: '5px',
};

const quantityStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

export default CartPage;
