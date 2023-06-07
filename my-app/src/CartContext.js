import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
  };

  const cartQuantity = cartItems.length;

  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
