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
          <span>LS</span>Auto
        </a>
      <Link to="/IndexPage" className="btn">
        Vezi toate <span>anunturile</span>
      </Link>
      
      <br></br>
      <Link to="/signup" className="btn">
        Adauga un <span>anunt</span>
      </Link>
      <button className="popup__button" onClick={handleClose}>X</button>
    </div>
  );
}

export default Popup;