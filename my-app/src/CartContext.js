import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0);

  const updateCartQuantity = (quantity) => {
    setCartQuantity(quantity);
  };

  return (
    <CartContext.Provider value={{ cartQuantity, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
