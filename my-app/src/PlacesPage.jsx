import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Myadds.css';
import Image from './image';
import { Link } from 'react-router-dom';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 9;

  const [selectedSector, setSelectedSector] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAnul, setSelectedAnul] = useState("");
  const [selectedCombustibil, setSelectedCombustibil] = useState("");
  const [selectedPutere, setSelectedPutere] = useState("");
  const [selectedKmMin, setSelectedKmMin] = useState("");
  const [selectedKmMax, setSelectedKmMax] = useState("");
  const [selectedTitleMin, setSelectedTitleMin] = useState("");
  const [selectedTitleMax, setSelectedTitleMax] = useState("");

  useEffect(() => {
    axios.get('/places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesSector =
      selectedSector === "" || (place.title && place.title.toLowerCase().includes(selectedSector.toLowerCase()));

    return (
      matchesSector &&
      /sector [1-6]/i.test(place.title || '') && // ensure title contains sector 1-6 pattern
      (selectedMarca === "" || place.marca === selectedMarca) &&
      (selectedModel === "" || place.model === selectedModel) &&
      (selectedAnul === "" || place.anul === selectedAnul) &&
      (selectedCombustibil === "" || place.combustibil === selectedCombustibil) &&
      (selectedPutere === "" ||
        (Number(place.putere) >= Number(selectedPutere) &&
          Number(place.putere) < Number(selectedPutere) + 100)) &&
      (selectedKmMin === "" || Number(place.km) >= Number(selectedKmMin)) &&
      (selectedKmMax === "" || Number(place.km) <= Number(selectedKmMax)) &&
      (selectedTitleMin === "" || Number(place.title) >= Number(selectedTitleMin)) &&
      (selectedTitleMax === "" || Number(place.title) <= Number(selectedTitleMax))
    );
  });

  // Pagination logic
  const lastPlaceIndex = currentPage * placesPerPage;
  const firstPlaceIndex = lastPlaceIndex - placesPerPage;
  const currentPlaces = filteredPlaces.slice(firstPlaceIndex, lastPlaceIndex);
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  };

  const handleSectorClick = (sector) => {
    setSelectedSector(selectedSector === sector ? "" : sector);
    setCurrentPage(1); // reset to first page on filter change
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    axios.delete(`/places/${id}`).then(() => {
      setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== id));
    });
  };

  const resetFilters = () => {
    setSelectedSector("");
    setSelectedMarca("");
    setSelectedModel("");
    setSelectedAnul("");
    setSelectedCombustibil("");
    setSelectedPutere("");
    setSelectedKmMin("");
    setSelectedKmMax("");
    setSelectedTitleMin("");
    setSelectedTitleMax("");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="top" style={{ marginTop: '80px' }}></div>

      <div className="main2">
        <div className="container">
          <div className="filter-container">
            <div className="marca1-buttons">
              {["Sector 6", "Sector 5", "Sector 4", "Sector 3", "Sector 2", "Sector 1"].map((sector) => (
                <button
                  key={sector}
                  onClick={() => handleSectorClick(sector)}
                  className={`marca1-button ${selectedSector === sector ? "active" : ""}`}
                >
                  {sector}
                </button>
              ))}
            </div>
            <div className="filter-item">
              <button onClick={resetFilters}>Reset</button>
            </div>
          </div>

          <div className="details container">
            <div className="row row-cols-1 row-cols-md-4 g-4">
              {currentPlaces.length > 0 ? (
                currentPlaces.map((place) => (
                  <Link className="link-no-underline" to={"/write/" + place._id} key={place._id}>
                    <div className="col">
                      <div className="box card-body p-0 shadow-sm mb-5">
                        {place.photos && place.photos.length > 0 && (
                          <Image
                            src={place.photos[0]}
                            className="img-fluid"
                            style={{ height: "270px", width: "100%", objectFit: "cover" }}
                          />
                        )}
                        <div className="box_content">
                          <h4>{place.title}</h4>
                          <div className="row pl-2 pr-2">
                            <div>{place.putere}</div>
                            <button style={{ background: "#cccccc00", color: "var(--main)" }} className="btn1">
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
                <div className="col">
                  <p>Nu există anunțuri pentru aceste filtre.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pagination">
            <ul>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <li key={pageNumber}>
                  <button onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
