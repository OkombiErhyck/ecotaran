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
    onClick={() => setSelectedMarca('Sector 6')}
    className={`marca-button ${selectedMarca === 'Sector 6' ? 'active' : ''}`}
  >
    Sector 6
  </button>
  <button
    onClick={() => setSelectedMarca('Sector 5')}
    className={`marca-button ${selectedMarca === 'Sector 5' ? 'active' : ''}`}
  >
    Sector 5
  </button>
  <button
    onClick={() => setSelectedMarca('Sector 4')}
    className={`marca-button ${selectedMarca === 'Sector 4' ? 'active' : ''}`}
  >
    Sector 4
  </button>
  <button
    onClick={() => setSelectedMarca('Sector 3')}
    className={`marca-button ${selectedMarca === 'Sector 3' ? 'active' : ''}`}
  >
    Sector 3
  </button>
  <button
    onClick={() => setSelectedMarca('Sector 2')}
    className={`marca-button ${selectedMarca === 'Sector 2' ? 'active' : ''}`}
  >
    Sector 2
  </button>
  <button
    onClick={() => setSelectedMarca('Sector 1')}
    className={`marca-button ${selectedMarca === 'Sector 1' ? 'active' : ''}`}
  >
    Sector 1
  </button>
  
</div>


          <div className="filter-item">
           
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
