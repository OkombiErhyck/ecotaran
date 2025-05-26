import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Myadds.css';
import Image from './image';
import { Link } from 'react-router-dom';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    // Fetch all places instead of user-specific places
    axios.get('/places').then(({ data }) => {
      // Filter places that include "personal" in the 'marca' field (case-insensitive)
      const filtered = data.filter(place =>
        place.marca && place.marca.toLowerCase().includes("companie")
      );
      setPlaces(filtered);
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
    setSearchTitle("");
  };

  const filteredPlaces = places.filter(place => {
    const matchesMarca = selectedMarca ? place.marca === selectedMarca : true;
    const matchesTitle = searchTitle
      ? place.title?.toLowerCase().includes(searchTitle.toLowerCase())
      : true;
    return matchesMarca && matchesTitle;
  });

  return (
    <>
      <div className="top" style={{ marginTop: "80px" }}></div>

      <div className="main2">
        <div className="filter-container">

 <div className="filter-item">
            <input
              type="text"
              placeholder="Caută după titlu..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              style={{ padding: "8px", width: "200px" }}
            />
          </div>

           

          

          <div className="filter-item">
            <button onClick={resetFilters}>Reset</button>
          </div>
        </div>

        <div className="container">
          <div className="details container">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map(place => (
                  <Link className="link-no-underline" to={"/write/" + place._id} key={place._id}>
                    <div className="col">
                      <div className="box card-body p-0 shadow-sm mb-5">
                        {place.photos.length > 0 && (
                          <Image
                            src={place.photos[0]}
                            className="img-fluid"
                            style={{ height: "270px", width: "100%", objectFit: "cover" }}
                          />
                        )}
                        <div className="box_content" style={{ display: "contain" }}>
                          <h4>{place.title}</h4>
                          <div className="row pl-2 pr-2">
                            <div>{place.putere}</div>
                            <button
                              style={{ background: "#cccccc00", color: "var(--main)" }}
                              className="btn1"
                            >
                              Detalii
                            </button>
                            <button
                              style={{ color: "red" }}
                              className="btn1"
                              onClick={(event) => handleDelete(event, place._id)}
                            >
                              Sterge
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Nu s-au găsit rezultate.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
