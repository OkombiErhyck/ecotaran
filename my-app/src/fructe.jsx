import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./IndexPage.css";
import { UserContext } from "./UserContext";

function Fructe() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 9;

  const { cart, setCart } = useContext(UserContext);

  useEffect(() => {
    axios.get("/places").then((response) => {
      const filteredPlaces = response.data.filter(
        (place) => place.marca === "Fructe"
      );
      setPlaces(filteredPlaces);
    });
  }, []);

  const lastPlaceIndex = currentPage * placesPerPage;
  const firstPlaceIndex = lastPlaceIndex - placesPerPage;
  const currentPlaces = places.slice(firstPlaceIndex, lastPlaceIndex);
  const totalPages = Math.ceil(places.length / placesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  };

  const addToCart = (place, quantity) => {
    const updatedPlace = { ...place, quantity };
    let updatedCart = localStorage.getItem("cart");
    if (!updatedCart) {
      updatedCart = [];
    } else {
      updatedCart = JSON.parse(updatedCart);
    }

    const placeIndex = updatedCart.findIndex((item) => item._id === place._id);
    if (placeIndex !== -1) {
      updatedCart[placeIndex].quantity += quantity;
    } else {
      updatedCart.push(updatedPlace);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (place) => {
    if (place.quantity > 1) {
      place.quantity -= 1;
      setPlaces([...places]);
    }
  };

  const handleIncreaseQuantity = (place) => {
    place.quantity = (place.quantity || 1) + 1;
    setPlaces([...places]);
  };

  return (
    <>
      <div className="top"></div>
      <div className="main2">
        <div className="container">
          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentPlaces.length > 0 &&
                currentPlaces.map((place) => (
                  <div className="col" key={place._id}>
                    <div className="box card-body p-0 shadow-sm mb-5">
                      {place.photos.length > 0 && (
                        <img
                          src={place.photos[0]}
                          className="img-fluid"
                          alt={place.title}
                          style={{
                            height: "270px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div className="box_content">
                        <h4>{place.title}</h4>
                        <div className="row pl-2 pr-2">
                           
                          <div className="quantity-control">
  <div className="quantity-btn-container" style={{display:"flex",
    flexWrap:" wrap",
    alignContent: "flex-end",
    justifyContent: "space-between",
    background: "#d3d3d3",
    borderRadius: '10%',
    alignItems: "center",}}>
    <button
      className="quantity-btn"
      style={{
        backgroundColor: 'rgb(154 154 154)',
        color: 'white',
        padding: '5px',
        border: 'none',
        borderRadius: '10%',
        cursor: 'pointer',
        marginRight: '5px',
      }}
      onClick={() => handleDecreaseQuantity(place)}
    >
      -
    </button>
    <div className="quantity">{place.quantity || 1}</div>
    
    <button
      className="quantity-btn"
      style={{
        backgroundColor: 'rgb(154 154 154)',
        color: 'white',
        padding: '5px',
        border: 'none',
        borderRadius: '10%',
        cursor: 'pointer',
        marginLeft: '5px',
      }}
      onClick={() => handleIncreaseQuantity(place)}
    >
      +
    </button>
  </div>
  <div  style={{display:"flex",
    flexWrap:" wrap",
    alignContent: "flex-end",
    justifyContent: "space-around",
    alignItems: "center",}}>{place.km  } lei</div>
  <button
    style={{
      background: '#0d623b',
      color: 'var(--main)',
      padding: ' 4px',
      width: '300px',
      
    }}
    className="btn1"
    onClick={() => addToCart(place, place.quantity)}
  >
    Adauga in cos
  </button>
</div>

                       
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
</>
);
}

export default Fructe;