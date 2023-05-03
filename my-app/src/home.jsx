import React, { useState, useEffect } from 'react';
import Header from "./header";
import About2 from "./about2";
import Details from "./details";
import About from "./about";
import Details2 from "./details2";
import Header2 from "./header2";
 import CookiePolicyPopup from "./CookiePolicyPopup";
import IndexPage from "./IndexPage";
import SplashScreen from "./SplashScreen";
import Popup from "./Popup";
import Categorii from "./categorii";
import Footer2 from "./footer2";



function Home(){

  const [showPopup, setShowPopup] = useState(false);
  const handleScroll = () => {
    if (window.pageYOffset > 1600) {
      setShowPopup(true);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   return(
    
       <div>
{/*showPopup && <Popup />/*} {/* Add this line */}
          <Header/>
          
          <About2/>
          <Categorii />
          <About/> 
          <Details2/>
          <Header2/>
           <CookiePolicyPopup/> 
         <Footer2/>
       </div>
     );
};


export default Home;