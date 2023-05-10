import React, { useState } from 'react';
import './popup.css';
import { Link } from "react-router-dom";


    function Popup(props) {
        const [isVisible, setIsVisible] = useState(true);
      
        function handleClose() {
          setIsVisible(false);
          if (props.onClose) {
            props.onClose();
          }
        }
      
        if (!isVisible) {
          return null;
        }
      

  return (
    <div className='popup'>
    <a href="/" className="navbar-brand">
          <span>Eco</span>Taran
        </a>
      <Link to="/details2" className="btn">
        Hai in <span>magazin</span>
      </Link>
      
     <br></br>
     
      <button className="popup__button" onClick={handleClose}>X</button>
    </div>
  );
}

export default Popup;