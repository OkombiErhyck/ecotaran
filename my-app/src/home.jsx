import React, { useState, useEffect, useRef } from 'react';
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
import { gsap } from 'gsap';


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

  // Refs for each component
 
  const about2Ref = useRef(null);
  const categoriiRef = useRef(null);
  const aboutRef = useRef(null);
   
  const header2Ref = useRef(null);
  const cookiePopupRef = useRef(null);
  const footer2Ref = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, { opacity: 1, y: 0, duration: 1 });
          observer.unobserve(entry.target);
        }
      });
    }, options);

    
    observer.observe(about2Ref.current);
    observer.observe(categoriiRef.current);
    observer.observe(aboutRef.current);
     
    observer.observe(header2Ref.current);
    observer.observe(cookiePopupRef.current);
    observer.observe(footer2Ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
 
    <div>
      {showPopup && <Popup />}
      
        <Header/>
      
      <div ref={about2Ref} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <About2/>
      </div>
      <div ref={categoriiRef} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <Categorii />
      </div>
      <div ref={aboutRef} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <About/> 
      </div>
       
      <div ref={header2Ref} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <Header2/>
      </div>
      <div ref={cookiePopupRef} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <CookiePolicyPopup/> 
      </div>
      <div ref={footer2Ref} style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <Footer2/>
      </div>
    </div>

     );
};


export default Home;