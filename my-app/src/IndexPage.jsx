import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css"
import { Link } from "react-router-dom";
import Image from "./image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendarAlt,faRoad } from '@fortawesome/free-solid-svg-icons';
import Categorii from "./categorii";



export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAnul, setSelectedAnul] = useState("");
  const [selectedCombustibil, setSelectedCombustibil] = useState("");
  const [selectedPutere, setSelectedPutere] = useState("");
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedKmMin, setSelectedKmMin] = useState("");
  const [selectedKmMax, setSelectedKmMax] = useState("");
  const [selectedTitleMin, setSelectedTitleMin] = useState("");
  const [selectedTitleMax, setSelectedTitleMax] = useState("");


  const data = [
    {
      id: 1,
      marca: "Abarth",
      model: "124 Spider",
      title: "Abarth 124 Spider",
      // ... other details
    },
    {
      id: 2,
      marca: "Abarth",
      model: "595",
      title: "Abarth 595",
      // ... other details
    },
    {
      id: 3,
      marca: "Alfa Romeo",
      model: "Giulia",
      title: "Alfa Romeo Giulia",
      // ... other details
    },
    {
      id: 4,
      marca: "Alfa Romeo",
      model: "Stelvio",
      title: "Alfa Romeo Stelvio",
      // ... other details
    },
    // ... other places
  ];


  useEffect(() => {
    axios.get("/places").then(response => { 
      setPlaces(response.data);
    });
  }, []);

  // Calculate the index of the last place to display
  const lastPlaceIndex = currentPage * placesPerPage;
  // Calculate the index of the first place to display
  const firstPlaceIndex = lastPlaceIndex - placesPerPage;
  
  // Filter the places by marca and anul
  const filteredPlaces = places.filter(place => (
    (selectedMarca === "" || place.marca === selectedMarca) &&
    (selectedModel === "" || place.model === selectedModel) &&
    (selectedAnul === "" || place.anul === selectedAnul)&&
    (selectedCombustibil === "" || place.combustibil === selectedCombustibil)&&
    (selectedPutere === "" || (Number(place.putere) >= Number(selectedPutere) && Number(place.putere) < Number(selectedPutere) + 100))&&
    (selectedKmMin === "" || place.km >= Number(selectedKmMin)) && (selectedKmMax === "" || place.km <= Number(selectedKmMax))&&
    (selectedTitleMin === "" || place.title >= Number(selectedTitleMin)) &&
    (selectedTitleMax === "" || place.title <= Number(selectedTitleMax))
    ));

  // Get the current page's places
  const currentPlaces = filteredPlaces.slice(firstPlaceIndex, lastPlaceIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  // Change the current page
  
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  };
  // Handle marca selection
  const handleMarcaSelect = (event) => setSelectedMarca(event.target.value);
  const handleModelSelect = (event) => setSelectedModel(event.target.value);
  // Handle anul selection
  const handleAnulSelect = (event) => setSelectedAnul(event.target.value);


  const handleCombustibilSelect = (event) => setSelectedCombustibil(event.target.value);

  const handlePutereSelect = (event) => setSelectedPutere(event.target.value);

  const handleKmSelect = (event) => setSelectedKm(event.target.value);

  const handleKmMinSelect = (event) => setSelectedKmMin(event.target.value);
  
  const handleKmMaxSelect = (event) => setSelectedKmMax(event.target.value);
  
  const resetFilters = () => {
    setSelectedMarca("");
    setSelectedModel("");
    setSelectedAnul("");
    setSelectedCombustibil("");
    setSelectedPutere("");
    setSelectedKm("");
    setSelectedKmMin("");
    setSelectedKmMax("");
    setSelectedTitleMin("");
    setSelectedTitleMax("");
  };


  const kmArray = [];
  for (let km = new Date().getFullYear(); km >= 0; km--) {
 kmArray.push(km);
  };
  
  const handleMarcaClick = (marca) => {
    setSelectedMarca(selectedMarca === marca ? '' : marca);
  };

  const addToCart = (place) => {
    let cart = localStorage.getItem('cart');
    if (!cart) {
      cart = [];
    } else {
      cart = JSON.parse(cart);
    }
  
    cart.push(place);
  
    localStorage.setItem('cart', JSON.stringify(cart));
  
    
  };
  

  
  return (<> 
  <div className="top"></div>
    <div className="main2"> 
      <div className="container">
        <div className="filter-container">
        

        <div className="marca1-buttons">
        <button
        onClick={() => handleMarcaClick('Fructe')}
        className={`marca1-button ${selectedMarca === 'Fructe' ? 'active' : ''}`}
      >
        Fructe
       
      </button>



  <button
    onClick={() => setSelectedMarca('Legume')}
    className={`marca1-button ${selectedMarca === 'Legume' ? 'active' : ''}`}
  >
    Legume
  </button>
  


  <button
    onClick={() => setSelectedMarca('Mezeluri')}
    className={`marca1-button ${selectedMarca === 'Mezeluri' ? 'active' : ''}`}
  >
    Mezeluri
  </button>
  


  <button
    onClick={() => setSelectedMarca('Lactate')}
    className={`marca1-button ${selectedMarca === 'Lactate' ? 'active' : ''}`}
  >
    Lactate
  </button>
  
</div>


          <div className="filter-item">
          <label htmlFor="model-select">Tipuri</label>
      <select id="model-select" value={selectedModel} onChange={handleModelSelect}>
        <option value="">Toate</option>
        {filteredPlaces.map(place => (
          <option key={place.id} value={place.model}>{place.model}</option>
        ))}
      </select>
    </div>
          



         
          <div className="filter-item">
        <button onClick={resetFilters}>Reset</button>
      </div>
    </div>
    <Categorii />
        </div>
        <div className="details container">
          <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
          
            {currentPlaces.length > 0 && currentPlaces.map(place => ( 
              <Link to={"/place/" + place._id} key={place._id} className="link-no-underline">
                <div className="col ">
                  <div className="box card-body p-0  shadow-sm mb-5">
                    {place.photos.length > 0 && (
                      <Image src={ place.photos[0]} className="img-fluid" style={{height: "270px", width: "100%", objectFit: "cover"}}/>
                    )}
                    <div className="box_content">
                     <h4> {place.title} {place.km}    lei </h4>
                     <div className="row pl-2 pr-2">
    <div > 
      
  </div>
 
                     


  <button
  style={{
    background: "rgb(216 212 208 / 78%)",
    color: "var(--main)",
    padding: "14px",
    width: "131px",
    marginLeft: "126px",
   
  }}
  className="btn1"
  onClick={() => addToCart(place)}
>
  Adauga in Cos
</button>


                    </div>
                  </div>
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="pagination">
        <ul>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <li key={pageNumber}>
              <button onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
            </li>
          ))}
        </ul>
      </div>
     
    </>
  );
};
