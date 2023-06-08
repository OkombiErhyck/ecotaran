import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuImg from "./images/menu.png";
import cos from "./images/cos.png";

import "./navbar.css";

const NavBar = () => {
  const [navbar, setNavbar] = useState(false);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(cartItems.length);

  const toggleNavbar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const changeBg = () => {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBg);
    return () => {
      window.removeEventListener("scroll", changeBg);
    };
  }, []);

  useEffect(() => {
    // Update cart quantity whenever cartItems change
    setCartQuantity(cartItems.length);
  }, [cartItems]);

  const updateCartQuantity = () => {
    const updatedCartQuantity = cartItems.length;
    setCartQuantity(updatedCartQuantity);
  };

  return (
    <>
      <nav
        className={
          navbar
            ? "navbar navbar-expand-lg navbar-expand-md fixed-top active"
            : "navbar navbar-expand-lg navbar-expand-md fixed-top"
        }
      >
        <div className="navbar-left">
          <Link to="/CartPage" className="nav-link">
            <img src={cos} alt="cos" />
            <span className="cart-quantity">{cartQuantity}</span>
          </Link>
        </div>
        {/* Rest of the code */}
      </nav>
    </>
  );
};

export default NavBar;
