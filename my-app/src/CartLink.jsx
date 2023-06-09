import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import cos2 from "./images/cos2.png";
import { UserContext } from "./UserContext";

const CartLink = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { cart } = useContext(UserContext);

  useEffect(() => {
    if (cart.length > 0) {
      setIsLoading(true); // Start the loading animation

      // Simulate an asynchronous reload
      setTimeout(() => {
        setIsLoading(false); // Stop the loading animation
        setRefreshKey((prevKey) => prevKey + 1); // Update the refresh key to trigger component reload
      }, 1000);
    }
  }, [cart]);

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="navbar-left" key={refreshKey}>
     {isLoading ? (
            <div className="loading-animation">
                              <img  className="spinner1" src={cos2} alt="cos" /> 
                            
                            </div>              
        ) : (
      <Link to="/CartPage" className="nav-link">
        <img style={{height:"4vh", width:"auto"}} src={cos2} alt="cos" />
        
          <span className="cart-quantity">{cartQuantity}</span>
        
      </Link>
      )}
    </div>
  );
};

export default CartLink;
