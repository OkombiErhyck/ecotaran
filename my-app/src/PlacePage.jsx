import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- added useNavigate
import "./PlacePlage.css";
import Carousel from "react-bootstrap/Carousel";
import Image from "./image";
import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";

export default function PlacePage() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- added hook
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
    const cleanName = filename.replace(/^\d+-/, "");
    return cleanName
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleFuzzyNavigate = async (partialTitle) => {
  try {
    const res = await axios.get(`/place/search-by-title/${encodeURIComponent(partialTitle)}`);
    if (res.data && res.data._id) {
      navigate(`/place/${res.data._id}`);
    } else {
      alert("Nu a fost găsit niciun loc cu acest nume.");
    }
  } catch (err) {
    console.error("Eroare la căutare:", err);
    alert("Nu a fost gasit .");
  }
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
           {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            margin: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "var(--main)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ← Înapoi
        </button>
        </div>

        <div className="info-grid">
          {/* Left Large Column: Description */}
         {/* Left Large Column: Description */}
<div className="info-section large">
  <h3>Descriere</h3>
  <div
    className="descriptionContainer"
    style={{
      maxHeight: showMore ? "none" : "4000px",
      overflowY: showMore ? "visible" : "auto",
      paddingRight: "5px",
    }}
  >
    {place.description ? (
     <ul className="line-list">
  {(showMore ? place.description : trimDescription(place.description))
    .split(/\r?\n/)
    .filter(line => line.trim() !== "")
    .map((line, index) => {
      const match = line.match(/^(Contract de munca|Angajator|Locuinta)\s*:\s*(.+)$/i);

      if (match) {
        const label = match[1];     // "Contract de munca" or "Angajator" or "Locuinta"
        const extracted = match[2]; // the text after colon

        return (
          <li key={index}>
            {label}:{" "}
            <span
              onClick={() => handleFuzzyNavigate(extracted.trim())}
              style={{ cursor: "pointer", color: "var(--main)", fontWeight: "bold" }}
            >
              {extracted}
            </span>
          </li>
        );
      } else {
        return <li key={index}>{line}</li>;
      }
    })}
</ul>



    ) : (
      <p style={{ color: "#aaa" }}>Nu a fost adăugat nimic.</p>
    )}
    {!showMore && place.description.length > 400 && (
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
                maxHeight: showDocuments ? `${documentsRef.current?.scrollHeight}px` : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              {place.documents && place.documents.length > 0 ? (
                <ul className="doc-list-grid">
                  {place.documents.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer" title={getDocumentName(url)}>
                        <span className="doc-icon">📄</span>
                        <span className="doc-name">{getDocumentName(url)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#aaa" }}>Niciun document atașat.</p>
              )}
            </div>
          </div>

          {/* Right Bottom Small Column: Amanunte */}
         <div className="info-section small">
  <h3
    onClick={() => setShowAmanunte(!showAmanunte)}
    style={{
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    Amanunte
    <span style={{ fontSize: "1.2em" }}>{showAmanunte ? "▲" : "▼"}</span>
  </h3>

 <div
  ref={amanunteRef}
  className={`amanunte-container ${showAmanunte ? "expanded" : ""}`}
  style={{
    maxHeight: showAmanunte ? "400px" : "0px",
    overflowY: "auto",
    overflowX: "visible",
    transition: "max-height 0.4s ease",
  }}
>
  {place.nume ? (
   <ul className="line-list">
  {place.nume
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const match = line.match(/^(Personal in leasing)\s*:\s*(.+)$/i);

      if (match) {
        const label = match[1];
        const extracted = match[2].trim(); // gets text after colon
        return (
          <li key={index}>
            {label}:{" "}
            <span
              onClick={() => handleFuzzyNavigate(extracted)}
              style={{ cursor: "pointer", color: "var(--main)", fontWeight: "bold" }}
            >
              {extracted}
            </span>
          </li>
        );
      } else {
        return <li key={index}>{line}</li>;
      }
    })}
</ul>

  ) : (
    <p style={{ margin: 0, color: "#888" }}>Nu a fost adăugat nimic.</p>
  )}
</div>

</div>

        </div>
      </div>
    </>
  );
}
