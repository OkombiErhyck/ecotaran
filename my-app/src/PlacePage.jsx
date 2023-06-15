import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./PlacePlage.css";
import Carousel from "react-bootstrap/Carousel";
import Image from "./image";
import Details from './details';

import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";
import Carvertical from "./images/menu.png";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showPerks, setShowPerks] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { cart, setCart } = useContext(UserContext);
  const { updateCartQuantity } = useContext(CartContext);
  const cartLinkRef = useRef(null);
  const [vin, setVin] = useState('');
  const [quantity, setQuantity] = useState(1); // Track the quantity

  const handleVinChange = (event) => {
    setVin(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `https://www.carvertical.com/ro/landing/v3?utm_source=aff&a=LSAuto&b=0eb206ae`;
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  useEffect(() => {
    function adjustCarouselImageSize() {
      const images = document.querySelectorAll('.carousel .d-block');
      const windowHeight = window.innerHeight;
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageHeight = image.naturalHeight;
        const maxImageHeight = Math.min(windowHeight, imageHeight);
        image.style.maxHeight = `${maxImageHeight}px`;
      }
    }

    // Adjust the carousel image size on mount
    adjustCarouselImageSize();

    // Add a resize event listener to adjust the max-height on window resize
    window.addEventListener('resize', adjustCarouselImageSize);

    // Remove the resize event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', adjustCarouselImageSize);
    }
  }, []);

  if (!place) return null;

  function goBack() {
    window.history.go(-1);
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  const trimDescription = (description) => {
    if (description.length > 400) {
      return description.substring(0, 400) + '...';
    }
    return description;
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: place.title,
        text: place.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const addToCart = () => {
    let updatedCart = localStorage.getItem('cart');
    if (!updatedCart) {
      updatedCart = [];
    } else {
      updatedCart = JSON.parse(updatedCart);
    }

    // Check if the place is already in the cart
    const existingPlace = updatedCart.find((item) => item.id === place.id);

    if (existingPlace) {
      // If the place already exists in the cart, update its quantity
      existingPlace.quantity += quantity;
    } else {
      // If the place is not in the cart, add it with the specified quantity
      place.quantity = quantity;
      updatedCart.push(place);
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Update the cart context with the new cart data
    setCart(updatedCart);

    alert('Place added to cart!');
  };

  if (!place) {
    return null;
  }

  return (
    <>
      <div className="main3">
        <div className="carousel-container">
          <Carousel className="carousel" style={{ borderBottom: "solid 1px var(--main)" }}>
            {place.photos?.map((photo, index) => (
              <Carousel.Item key={index}>
                <Image
                  className="d-block w-100"
                  src={photo}
                  alt={"Slide " + (index + 1)}
                  style={{ objectFit: "contain", maxHeight: "546px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="m2">
          <div id="price" className="container">
            <h2
              className="h_det"
              style={{
                color: "var(--main)",
                fontWeight: "bold",
                textAlign: "left",
                marginBottom: 0,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left",
                  marginBottom: 0,
                }}
              >
                {place.km} lei
              </span>{" "}
              {place.title}
            </h2>
            <div style={{ color: "wheat" }}>
              {place.marca} | {place.model}|
              <div className="quantity-container" >
              <div
                                className="quantity-btn-container"
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  color:"black",
                                  alignContent: "flex-end",
                                  justifyContent: "space-between",
                                  background: "#fffff",
                                  borderRadius: "10%",
                                  alignItems: "center",
                                }}
                              >
                <button
                style={{
                                    backgroundColor: "rgb(154 154 154)",
                                    color: "white",
                                    padding: "5px",
                                    border: "none",
                                    borderRadius: "10%",
                                    cursor: "pointer",
                                    marginLeft: "0px",
                                  }}
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button
                style={{
                                    backgroundColor: "rgb(154 154 154)",
                                    color: "white",
                                    padding: "5px",
                                    border: "none",
                                    borderRadius: "10%",
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              </div>
              <button
                style={{
                  padding: " 4px",
                  width: "300px",
                }}
                className="btn1"
                onClick={addToCart}
              >
                <span>Adauga in cos</span>
              </button>
            </div>
          </div>
          <br />
          <div className="containere"></div>
          <div className="desContainer">
            <h3>
              <ul className="perksList noDotList">
                {place.perks.map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
            </h3>
            <h3>DESCRIERE</h3>
            <div className="descriptionContainer">
              <p style={{ whiteSpace: "pre-line" }}>
                {showMore ? place.description : trimDescription(place.description)}
              </p>
              {place.description.length > 400 && !showMore && (
                <button onClick={handleShowMore}>Show more</button>
              )}
            </div>
          </div>

          <br />
          <Details onOpen={handleScrollToTop} />
        </div>
      </div>
    </>
  );
}
