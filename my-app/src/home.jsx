import React, { useState, useEffect, useRef } from 'react';
import Header from "./header";

import { gsap } from 'gsap';


function Home(){

  /*const [showPopup, setShowPopup] = useState(false);
  const handleScroll = () => {
    if (window.pageYOffset > 1600) {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);*/

  // Refs for each component
 
  
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

    
    

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
 
    <div>
      
      
        <Header/>
      
      
    </div>

     );
};


export default Home;