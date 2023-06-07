import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import MenuImg from "./images/menu.png";
import cos from "./images/cos.png";
import { UserContext } from "./UserContext";

import "./navbar.css";

const NavBar = () => {
  const [navbar, setNavbar] = useState(false);
  const { cart } = useContext(UserContext); // Access the cart state from the UserContext

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

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0); // Calculate the total cart quantity

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
