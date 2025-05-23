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
  const [quantity, setQuantity] = useState(1);

  const handleVinChange = (event) => {
    setVin(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `https://www.carvertical.com/ro/landing/v3?utm_source=aff&a=LSAuto&b=0eb206ae`;
  };

  useEffect(() => {
    if (!id) return;
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

    adjustCarouselImageSize();
    window.addEventListener('resize', adjustCarouselImageSize);
    return () => window.removeEventListener('resize', adjustCarouselImageSize);
  }, []);

  if (!place) return null;

  const handleShowMore = () => setShowMore(true);

  const trimDescription = (description) => {
    return description.length > 400
      ? description.substring(0, 400) + '...'
      : description;
  };

  const addToCart = () => {
    let updatedCart = localStorage.getItem('cart');
    updatedCart = updatedCart ? JSON.parse(updatedCart) : [];

    const existingPlace = updatedCart.find((item) => item.id === place.id);
    if (existingPlace) {
      existingPlace.quantity += quantity;
    } else {
      place.quantity = quantity;
      updatedCart.push(place);
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert('Place added to cart!');
  };

  // Helper function to extract and clean document name from URL
  const getDocumentName = (url) => {
    let filename = url.split("/").pop().split("?")[0].split("#")[0];
    const parts = filename.split('_');
    if (parts.length > 2) {
      // Remove first two parts (assumed to be db ids or codes)
      filename = parts.slice(2).join('_');
    }
    filename = filename.replace(/[-_]+/g, ' ');
    filename = filename.replace(/\b\w/g, (c) => c.toUpperCase());
    return filename;
  };

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
            <h2 className="h_det" style={{ color: "var(--main)", fontWeight: "bold", textAlign: "left", marginBottom: 0 }}>
              <span style={{ color: "white", fontWeight: "bold" }}>{place.km}</span> {place.title}
            </h2>
            <div style={{ color: "wheat" }}>
              {place.marca}
              <div className="quantity-container">
                <div
                  className="quantity-btn-container"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    color: "black",
                    alignContent: "flex-end",
                    justifyContent: "space-between",
                    background: "#fffff",
                    borderRadius: "10%",
                    alignItems: "center",
                  }}
                />
              </div>
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

            {/* Uploaded Documents Section */}
            {place.documents && place.documents.length > 0 && (
              <div className="document-section" style={{ marginTop: "20px" }}>
                <h3>Documente atașate</h3>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {place.documents.map((url, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--main)",
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        {getDocumentName(url)}
                      </a>

                      {/* Optional preview for PDFs */}
                      
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
