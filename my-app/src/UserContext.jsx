import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      setCartQuantity(totalQuantity);
    } else {
      setCartQuantity(0);
    }
  }, [cart]);

  const addToCart = (place, quantity) => {
    const updatedPlace = { ...place, quantity: quantity || 1 };
    const placeIndex = cart.findIndex((item) => item._id === place._id);

    if (placeIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[placeIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, updatedPlace]);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, ready, cart, setCart, cartQuantity, addToCart }}>
      {children}
    </UserContext.Provider>
  );
}
