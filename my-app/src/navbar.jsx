import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [loginLinkColor, setLoginLinkColor] = useState("black");
  const cartLinkRef = useRef(null);
  const location = useLocation();

  const toggleNavbar = () => {
    setMobileMenuOpen((prev) => !prev);
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
    return () => window.removeEventListener("scroll", changeBg);
  }, []);

  useEffect(() => {
    setCartQuantity(cartItems.length);
    setRefreshKey((prevKey) => prevKey + 1);
  }, [cartItems]);

  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginLinkColor("white");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${navbar ? "active" : ""}`}>
        <div className="navbar-middle">
          <Link to="/" className="navbar-brand">
            <span>UP</span>Recruitment
          </Link>
           
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="menu-icon" onClick={toggleNavbar}>
          <img src={MenuImg} alt="menu" />
        </div>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse justify-content-end ${mobileMenuOpen ? "show" : ""}`}>
        <ul className="navbar-nav">
          
        <Link to="/login" className="navbar-brand"  onClick={() => setMobileMenuOpen(false)}>
            Login
          </Link>
           
            <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
              <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/about" ? "active" : ""}`}>
              <Link to="/about" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/services" ? "active" : ""}`}>
              <Link to="/services" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/contact" ? "active" : ""}`}>
              <Link to="/contact" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                
              </Link>
            </li>
             
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
