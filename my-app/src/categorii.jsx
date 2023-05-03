import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css"
import { Link } from "react-router-dom";
import Image from "./image";
import meat from "./images/meat.png";
import vegetable from "./images/vegetables.png";
import milk from "./images/milk.png";
import fruits from "./images/fruits.png";
import honey from "./images/honey.png";
import flour from "./images/flour.png";
import vegan from "./images/vegan.png";
import eco from "./images/eco-home.png";
import liquor from "./images/liquor.png";




function Categorii() {

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

  const handleMarcaClick = (marca) => {
    setSelectedMarca(selectedMarca === marca ? '' : marca);
  };


  return (
    <>
      <div className="container">
        <div className="filter-container">
        
        <div className="news-banner">
        <div className="marca-buttons">
        <button
  onClick={() => {
    handleMarcaClick('Legume');
    window.location.href = '/legume'; // Replace with the actual URL of the Fructe page
  }}
  className={`marca-button ${selectedMarca === 'Legume' ? 'active' : ''}`}
>
<img src={vegetable} alt="" style={{ width: '146px' }} />
  <p>Legume</p> 
</button>



  <button
  onClick={() => {
    handleMarcaClick('Fainoase');
    window.location.href = '/fainoase'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Fainoase' ? 'active' : ''}`}
  >
  <img src={flour} alt="" style={{ width: '146px' }} />
   <p>Fainoase</p> 
  </button>
  


  <button
    onClick={() => {
    handleMarcaClick('vegan');
    window.location.href = '/vegan'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Vegan' ? 'active' : ''}`}
  >
  <img src={vegan} alt="" style={{ width: '146px' }} />
    <p>Vegan</p> 
  </button>
  


  <button
    onClick={() => {
    handleMarcaClick('lactate');
    window.location.href = '/lactate'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Lactate' ? 'active' : ''}`}
  >
  <img src={milk} alt="" style={{ width: '146px' }} />
   <p>Lactate</p>  
  </button>
  
  <button
    onClick={() => {
    handleMarcaClick('Carne');
    window.location.href = '/Carne'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Carne' ? 'active' : ''}`}
  >
  <img src={meat} alt="" style={{ width: '146px' }} />
    <p>Carne si preparate din carne</p>
  </button>
  
  <button
    onClick={() => {
    handleMarcaClick('camaraeco');
    window.location.href = '/camaraeco'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'CamaraEco' ? 'active' : ''}`}
  >
  <img src={eco} alt="" style={{ width: '146px' }} />
   <p>CamaraEco</p>  
  </button>

  <button
    onClick={() => {
    handleMarcaClick('bauturi');
    window.location.href = '/bauturi'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Bauturi' ? 'active' : ''}`}
  >
  <img src={liquor} alt="" style={{ width: '146px' }} />
    <p>Bauturi</p> 
  </button>

  <button
    onClick={() => {
    handleMarcaClick('miere');
    window.location.href = '/miere'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Miere' ? 'active' : ''}`}
  >
  <img src={honey} alt="" style={{ width: '146px' }} />
    <p>Miere</p>
  </button>

  <button
  onClick={() => {
    handleMarcaClick('Fructe');
    window.location.href = '/fructe'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Fructe' ? 'active' : ''}`}
  >
  <img src={fruits} alt="" style={{ width: '146px' }} />
   <p>Fructe</p> 
  </button>

   <button
    onClick={() => {
    handleMarcaClick('plescoi');
    window.location.href = '/plescoi'; // Repl 
}}
    className={`marca-button ${selectedMarca === 'Plescoi' ? 'active' : ''}`}
  >
  <img src={meat} alt="" style={{ width: '146px' }} />
    <p>Produse traditionale Plescoi</p>
  </button>


</div>
</div>

        
    </div>
    </div>
    </>
  );
}

export default Categorii;
