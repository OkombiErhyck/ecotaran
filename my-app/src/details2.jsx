import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IndexPage.css"
import { Link } from "react-router-dom";
import Image from "./image";
import meat from "./images/mez.jpg";
import legume from "./images/legume.jpg";
import milk from "./images/milk.png";
import fruits from "./images/fructe.jpg";
import honey from "./images/honey.png";
import flour from "./images/flour.png";
import vegan from "./images/vegan.png";
import eco from "./images/eco-home.png";
import liquor from "./images/liquor.png";





import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendarAlt,faRoad } from '@fortawesome/free-solid-svg-icons';


export default function Details() {
  const [allPlaces, setAllPlaces] = useState([]);
  const [currentPlaces, setCurrentPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch places from the database and set them to state
    fetch("/api/places")
      .then(response => response.json())
      .then(data => {
        setAllPlaces(data);
        setCurrentPlaces(data);
      })
      .catch(error => console.error(error));
  }, []);

  // Function to filter places based on search query
  const filterPlaces = (query) => {
    const filteredPlaces = allPlaces.filter(place =>
      place.title.toLowerCase().includes(query.toLowerCase())
    );
    setCurrentPlaces(filteredPlaces);
  }

  // Function to add a place to the cart
  const addToCart = (place) => {
    // Implement add to cart functionality here
  }

  // Handler function for search bar input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    filterPlaces(event.target.value);
  }



  return(
    <div className="main2 container" style={{marginTop:"100px",}}>

<input
            type="text"
            className="form-control"
            placeholder="Search places"
            value={searchQuery}
            onChange={handleSearchInputChange}
          /> 

  <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4" style={{padding:"20px"}}>
  <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Fructe</h4>
          </button>
          </Link>
        </div>
      </div>
      </div>
    </div>
    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/legume" }  className="link-no-underline" >
          <img
            src={legume}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
        </div>
      </div>
    </div>
   
   
    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>


    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/carne" }  className="link-no-underline" >
          <img
            src={meat}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Carne si preparate din carne</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>


    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>


    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>



    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>



    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>



    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>



    <div className="details container">
    <div className="col">
      <div className="box card-body p-0 shadow-sm mb-5">
        <div className="box_content">
        <Link to={"/fructe" }  className="link-no-underline" >
          <img
            src={fruits}
            alt=""
            className="img-fluid"
            style={{
              height: "270px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <button
            style={{ background: "#cccccc00", color: "black" }}
            className="btn1"
          >
            <h4>Legume</h4>
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>




  </div>
  
</div>

  );
};
