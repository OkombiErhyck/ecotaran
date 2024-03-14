import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MenuImg from "./images/menu.png";

import CartLink from "./CartLink";

import "./navbar.css";
 
const NavBar = () => {
  const [navbar, setNavbar] = useState(false);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(cartItems.length);
  const [refreshKey, setRefreshKey] = useState(0); // Key for forcing component refresh
  const [loginLinkColor, setLoginLinkColor] = useState("black"); // Initial color
  const cartLinkRef = useRef(null);

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

  const updateCartQuantity = () => {
    setCartQuantity(cartItems.length);
    setRefreshKey((prevKey) => prevKey + 1); // Increment the key to force component refresh
  };

  useEffect(() => {
    updateCartQuantity();
  }, [cartItems]);

  

   

  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginLinkColor("white");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <nav
        className={
          navbar
            ? "navbar navbar-expand-lg navbar-expand-md fixed-top active"
            : "navbar navbar-expand-lg navbar-expand-md fixed-top"
        }
      >
        <div className="navbar-middle">
          <a href="/" className="navbar-brand">
            <span>UP</span>Recruitment
          </a>
          <Link to="/login" className="navbar-brand" style={{ color: loginLinkColor }}>
            Login
          </Link>
        </div>
        
        <div
          className={`${
            mobileMenuOpen ? "show " : ""
          }collapse navbar-collapse justify-content-end`}
        >
          
          
        </div>
      </nav>
    </>
  );
};

export default NavBar;
