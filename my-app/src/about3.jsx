import React, { useState } from 'react';
import background from "./images/2.jpg";
import { Link } from 'react-router-dom';

import "./about.css";

const About = () => {
  
    return (
        <>
           <div className="container-fluid p-0" style={{backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
              <div className="row no-gutters"   >
                <div className="col-12 col-md-5 offset-md-1 p-5 align-self-center">
                  <h2 className='h2'>Gusturi din copilarie</h2>
                  <p className=" ">Descoperă un aprozar fermecător, unde legumele și fructele își păstrează prospețimea cu ajutorul umidificatoarelor.</p>
                  <p className=" "> Gustă savoarea autentică și bucură-te de o experiență culinară plină de prospețime și vitalitate!</p>
                </div>
                <div className="d-none d-md-block col-md-5 offset-md-1" id="about-bg-1" style={{ backgroundImage: `url(${background})` }}>
                </div>
              </div>
           </div>
        </>
    );
};

export default About;
