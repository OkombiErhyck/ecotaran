import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h4>Meniu</h4>
          <a href="/home" className="nav-link">Home</a>
          <a href="/details2" className="nav-link">Magazin</a>
          <a href="/contact" className="nav-link">Contact</a>
          <a href="/despre" className="nav-link">
            Politici
          </a>
        </div>
        <div className="footer-column">
          <h4>Locatie</h4>
          <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2850.403670096169!2d26.07811657563437!3d44.40436170352623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff51a41dea6d%3A0xc55006bef323cff3!2zRWNvyJrEg3Jhbg!5e0!3m2!1sro!2sro!4v1693824466831!5m2!1sro!2sro"
      width="350"
      height="160"
      style={{ border: "0" }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="tes">
          Copyright &copy; ecoTaran | 2023 All rights reserved{" "}
           
        </p>
      </div>
    </footer>
  );
};

export default Footer;
