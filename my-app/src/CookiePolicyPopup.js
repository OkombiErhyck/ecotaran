import React, { useState } from 'react';
import "./cookie.css";

const CookiePolicyPopup = () => {
  const [showPopup, setShowPopup] = useState(!document.cookie.includes('cookie_policy_accepted=true'));

  const hidePopup = () => {
    setShowPopup(false);
    document.cookie = 'cookie_policy_accepted=true; path=/; max-age=31536000';
  };
  
     

  return (
    showPopup && (
      <div className="cookie-policy-popup">
        <p>Acest website utilizează cookie-uri pentru a vă asigura cea mai bună experiență pe site-ul nostru. Aflați mai multe. <a href="/despre">aici</a>.</p>
        <button onClick={hidePopup}>Am inteles</button>
      </div>
    )
  );
};

export default CookiePolicyPopup;
