import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlacePlage.css";
import Carousel from "react-bootstrap/Carousel";
import Image from "./image";
import Details from './details';
import Carvertical from "./images/menu.png";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showPerks, setShowPerks] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [vin, setVin] = useState('');

  const handleVinChange = (event) => {
    setVin(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `https://www.carvertical.com/ro/landing/v3?utm_source=aff&a=LSAuto&b=0eb206ae`;
  };

  // Add place to cart
   
  
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
        title: place.title ,
        text: place.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error(error.message);
    }
  };


  const addToCart = () => {
    let cart = localStorage.getItem('cart');
    if (!cart) {
      cart = [];
    } else {
      cart = JSON.parse(cart);
    }

    cart.push(place);

    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Place added to cart!');
  };

  if (!place) {
    return null;
  }
   
  return (
    <>
      <div className="main3">
        <div className="carousel-container">
        <Carousel className="carousel" style={{borderBottom: "solid 1px var(--main)"}}>
            {place.photos?.map((photo, index) => (
              <Carousel.Item key={index}>
                <Image
                  className="d-block w-100"
                  src={photo}
                  alt={"Slide " + (index + 1)}
                  style={{ objectFit: "contain",maxHeight: "546px" }}
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
                {place.km} lei kg
              </span>{" "}
              {place.title}
            </h2>
            <div style={{ color: "wheat" }}>
            {place.marca} | {place.model}|  
              
              <button
                onClick={addToCart}
                style={{
                  marginLeft: "10px",
                  padding: "-1px",
                  backgroundColor: "wheat",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <br />
          <div className="containere"></div>
          <div className="desContainer">
            <h3>
             
               
              
            </h3>
            <br />
            
              <ul className="perksList noDotList">
                {place.perks.map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
          
            <h3>DESCRIERE</h3>
            <div className="descriptionContainer">
              <p style={{ whiteSpace: "pre-line" }}>
                {showMore
                  ? place.description
                  : trimDescription(place.description)}
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
};
