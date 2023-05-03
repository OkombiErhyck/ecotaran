
import React, { useState } from 'react';
import background from "./images/inc.jpg";
import { Link } from 'react-router-dom';


import "./about.css";
const About = () => {
  
    return (
        <>
        


           <div className="container-fluid p-0">
      <div className="row no-gutters" style={{height:"64vh", background:"rgba(203, 201, 201, 0.654)" }}>
        <div className="col-12 col-md-5 offset-md-1 p-5 align-self-center">
          <h2>Gusturi din copilarie</h2>
          <p className="text-muted lead">Descoperă un aprozar fermecător, unde legumele și fructele își păstrează prospețimea cu ajutorul umidificatoarelor.
          </p>
          <p className="text-muted lead"> Gustă savoarea autentică și bucură-te de o experiență culinară plină de prospețime și vitalitate!</p>
         
        </div>
        <div className="d-none d-md-block col-md-5 offset-md-1" id="about-bg-1" style={{ backgroundImage: `url(${background})` }}>
        </div>
      </div>
    </div>
        </>
    );
};
export default About