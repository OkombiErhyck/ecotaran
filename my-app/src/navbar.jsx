import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuImg from "./images/menu.png";
import cos from "./images/cos.png";

import "./navbar.css";

const NavBar = () => {
  const [navbar, setNavbar] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  const cartQuantity = cartItems.length; // Get the cart quantity

  const addToCart = (item) => {
    setCartItems([...cartItems, item]); // Add item to the cartItems array
    localStorage.setItem("cart", JSON.stringify([...cartItems, item])); // Update local storage
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
        <a href="/" className="navbar-brand">
          <span>eco</span>Taran
        </a>
        <button
          className={`navbar-toggler ${mobileMenuOpen ? "active" : ""}`}
          type="button"
          onClick={toggleNavbar}
        >
          <img src={MenuImg} alt="menu" />
        </button>

        <div
          className={`${
            mobileMenuOpen ? "show " : ""
          }collapse navbar-collapse justify-content-end`}
        >
          <div className="navbar-nav">
            <div className="nav-item">
              <a href="/" className="nav-link">
                Acasa
              </a>
            </div>
            <div className="nav-item">
              <a href="/details2" className="nav-link">
                Magazin
              </a>
            </div>

            {/* Display cart quantity */}
            <div className="nav-item">
              <Link to="/CartPage" className="nav-link">
                <img src={cos} alt="cos" />
                <span className="cart-quantity">{cartQuantity}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
