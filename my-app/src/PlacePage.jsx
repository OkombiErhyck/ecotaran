import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./PlacePlage.css";
import Carousel from "react-bootstrap/Carousel";
import Image from "./image";
import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { cart, setCart } = useContext(UserContext);
  const { updateCartQuantity } = useContext(CartContext);
  const [vin, setVin] = useState('');
  const [quantity, setQuantity] = useState(1);
const [showDocuments, setShowDocuments] = useState(false);
const documentsRef = useRef(null);
const [showAmanunte, setShowAmanunte] = useState(false);
const amanunteRef = useRef(null);




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

  const getDocumentName = (url) => {
  const filename = decodeURIComponent(url.split("/").pop().split("?")[0]);

  // Remove numeric prefix followed by a dash (e.g. 1748696351916-)
  const cleanName = filename.replace(/^\d+-/, "");

  return cleanName
    .replace(/[-_]+/g, " ")           // Replace dashes/underscores with space
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
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

        <div className="info-grid">
          {/* Left Large Column: Description */}
          <div className="info-section large">
            <h3>Descriere</h3>
            <div className="descriptionContainer">
              <p style={{ whiteSpace: "pre-line" }}>
                {showMore ? place.description : trimDescription(place.description)}
              </p>
              {place.description.length > 400 && !showMore && (
                <button onClick={handleShowMore}>Show more</button>
              )}
            </div>
          </div>

          {/* Right Top Small Column: Documents */}
         <div className="info-section small">
  <h3
    onClick={() => setShowDocuments(!showDocuments)}
    style={{
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    Documente atașate
    <span style={{ fontSize: "1.2em" }}>{showDocuments ? "▲" : "▼"}</span>
  </h3>

  <div
    ref={documentsRef}
    style={{
      maxHeight: showDocuments
        ? `${documentsRef.current?.scrollHeight}px`
        : "0px",
      overflow: "hidden",
      transition: "max-height 0.4s ease",
    }}
  >
    {place.documents && place.documents.length > 0 ? (
      <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "10px" }}>
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
          </li>
        ))}
      </ul>
    ) : (
      <p style={{ color: "#aaa" }}>Niciun document atașat.</p>
    )}
  </div>
</div>


          {/* Right Bottom Small Column: Empty */}
          {/* Right Bottom Small Column: Display nume */}
<div style={{ whiteSpace: "pre-wrap" }} className="info-section small">
  <h3
    onClick={() => setShowAmanunte(!showAmanunte)}
    style={{ cursor: "pointer", userSelect: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
  >
    Amanunte
    <span style={{ fontSize: "1.2em" }}>{showAmanunte ? "▲" : "▼"}</span>
  </h3>
  <div
    ref={amanunteRef}
    style={{
      maxHeight: showAmanunte ? `${amanunteRef.current?.scrollHeight}px` : "0px",
      overflow: "hidden",
      transition: "max-height 0.4s ease",
    }}
  >
    <p>{place.nume || "Nu a fost adaugat nimic."}</p>
  </div>
</div>


        </div>
      </div>
    </>
  );
}
