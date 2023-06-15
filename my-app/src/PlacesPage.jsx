import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Myadds.css';
import Image from './image';
import { Link, useParams } from 'react-router-dom';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  const handleModelSelect = (event) => setSelectedModel(event.target.value);
  const handleDelete = (event, id) => {
    event.preventDefault();
    axios.delete(`/places/${id}`).then(() => {
      setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== id));
    });
  };
  const resetFilters = () => {
    setSelectedMarca("");
    setSelectedModel("");
    
    
    
  };
  const filteredPlaces = selectedMarca
    ? places.filter(place => place.marca === selectedMarca)
    : places;

  return (
    <>
      <div className="top" style={{marginTop:"80px"}}></div>

      <div className="main2"> 
      <div className="filter-container">
        

        <div className="marcas-buttons">
  <button
    onClick={() => setSelectedMarca('Fructe')}
    className={`marca-button ${selectedMarca === 'Fructe' ? 'active' : ''}`}
  >
    Fructe
  </button>
  <button
    onClick={() => setSelectedMarca('Legume')}
    className={`marca-button ${selectedMarca === 'Legume' ? 'active' : ''}`}
  >
    Legume
  </button>
  <button
    onClick={() => setSelectedMarca('Carne')}
    className={`marca-button ${selectedMarca === 'Carne' ? 'active' : ''}`}
  >
    Carne 
  </button>
  <button
    onClick={() => setSelectedMarca('Bauturi')}
    className={`marca-button ${selectedMarca === 'Bauturi' ? 'active' : ''}`}
  >
    Bauturi
  </button>
  <button
    onClick={() => setSelectedMarca('Pleascoi')}
    className={`marca-button ${selectedMarca === 'Pleascoi' ? 'active' : ''}`}
  >
    Pleascoi
  </button>
  <button
    onClick={() => setSelectedMarca('Vegan')}
    className={`marca-button ${selectedMarca === 'Vegan' ? 'active' : ''}`}
  >
    Vegan
  </button>
  <button
    onClick={() => setSelectedMarca('Fainoase')}
    className={`marca-button ${selectedMarca === 'Fainoase' ? 'active' : ''}`}
  >
    Fainoase
  </button>
  <button
    onClick={() => setSelectedMarca('CamaraEco')}
    className={`marca-button ${selectedMarca === 'CamaraEco' ? 'active' : ''}`}
  >
    Camaraeco
  </button>
  <button
    onClick={() => setSelectedMarca('Lactate')}
    className={`marca-button ${selectedMarca === 'Lactate' ? 'active' : ''}`}
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
    <div className="container">
        <div className="details container">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredPlaces.length > 0 && filteredPlaces.map(place => (
              <Link className="link-no-underline" to={"/write/"+place._id}>
                  <div className="col ">
                    <div className="box card-body p-0  shadow-sm mb-5">
                      {place.photos.length > 0 && (
                        <Image src={place.photos[0]} className="img-fluid" style={{height: "270px", width: "100%", objectFit: "cover"}}/>
                      )}
                      <div className="box_content" style={{display:"contain"}}>
                     <h4> {place.title}</h4>
                     <div className="row pl-2 pr-2">
    <div > 
      {place.putere} 
  </div>
 
                     


  <button style={{background : "#cccccc00", color : "var(--main)"}} className="btn1">Detalii</button>
                         
                        <button style={{color : "red"}} className="btn1" onClick={(event) => handleDelete(event, place._id)}>Sterge</button>
                     </div>
                    </div>
                  </div></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}