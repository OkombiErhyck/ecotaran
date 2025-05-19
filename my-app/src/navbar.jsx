import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuImg from "./images/menu.png";
import { UserContext } from "./UserContext";  // importă contextul utilizatorului
import "./navbar.css";

const NavBar = () => {
  const [navbar, setNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { user } = useContext(UserContext);  // preia user din context

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
    if (window.location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
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

            {user ? (
              <li className={`nav-item ${location.pathname === "/userpage" ? "active" : ""}`}>
                <Link to="/userpage" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                  {user.name}
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                    Signup
                  </Link>
                </li>
              </>
            )}

            {/* Alte link-uri din navbar */}
            <li className={`nav-item ${location.pathname === "/about" ? "active" : ""}`}>
              <Link to="/about" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </li>

            {/* ... restul link-urilor */}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
