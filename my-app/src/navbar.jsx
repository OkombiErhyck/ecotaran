import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import MenuImg from "./images/menu.png";
import cos2 from "./images/cos2.png";
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
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        const updatedCartItems = JSON.parse(event.newValue) || [];
        setCartItems(updatedCartItems);
        forceCartLinkUpdate();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const forceCartLinkUpdate = () => {
    if (cartLinkRef.current) {
      // Access the current property of the ref to get the CartLink component instance
      cartLinkRef.current.forceUpdate();
    }
  };

  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
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
        <div className="navbar-left">
          <CartLink key={refreshKey} ref={cartLinkRef} cartQuantity={cartQuantity} />
        </div>
        <div className="navbar-middle">
          <a href="/" className="navbar-brand">
            <span>eco</span>Taran
          </a>
        </div>
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
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
