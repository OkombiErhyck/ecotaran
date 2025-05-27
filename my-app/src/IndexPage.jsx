import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css";
import { Link } from "react-router-dom";
import Image from "./image";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(9);
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
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  // Filter places: show only places where marca includes "Sector" AND filters below
  const filteredPlaces = places.filter((place) => {
    return (
      place.marca?.startsWith("Sector") && // show only "Sector" places
      (selectedMarca === "" || place.marca === selectedMarca) &&
      (selectedModel === "" || place.model === selectedModel) &&
      (selectedAnul === "" || place.anul === selectedAnul) &&
      (selectedCombustibil === "" || place.combustibil === selectedCombustibil) &&
      (selectedPutere === "" ||
        (Number(place.putere) >= Number(selectedPutere) &&
          Number(place.putere) < Number(selectedPutere) + 100)) &&
      (selectedKmMin === "" || place.km >= Number(selectedKmMin)) &&
      (selectedKmMax === "" || place.km <= Number(selectedKmMax)) &&
      (selectedTitleMin === "" || place.title >= Number(selectedTitleMin)) &&
      (selectedTitleMax === "" || place.title <= Number(selectedTitleMax))
    );
  });

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

  const handleMarcaClick = (marca) => {
    setSelectedMarca(selectedMarca === marca ? "" : marca);
  };

  const resetFilters = () => {
    setSelectedMarca("");
    setSelectedModel("");
    setSelectedAnul("");
    setSelectedCombustibil("");
    setSelectedPutere("");
    setSelectedKmMin("");
    setSelectedKmMax("");
    setSelectedTitleMin("");
    setSelectedTitleMax("");
  };

  return (
    <>
      <div className="top"></div>
      <div className="main2">
        <div className="container">
          <div className="filter-container">
            <div className="marca1-buttons">
              {["Sector 6", "Sector 5", "Sector 4", "Sector 3", "Sector 2", "Sector 1"].map(
                (sector) => (
                  <button
                    key={sector}
                    onClick={() => handleMarcaClick(sector)}
                    className={`marca1-button ${selectedMarca === sector ? "active" : ""}`}
                  >
                    {sector}
                  </button>
                )
              )}
            </div>
            <div className="filter-item">
              <button onClick={resetFilters}>Reset</button>
            </div>
          </div>
          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentPlaces.length > 0 &&
                currentPlaces.map((place) => (
                  <Link to={"/place/" + place._id} key={place._id} className="link-no-underline">
                    <div className="col">
                      <div className="box card-body p-0 shadow-sm mb-5">
                        {place.photos.length > 0 && (
                          <Image
                            src={place.photos[0]}
                            className="img-fluid"
                            style={{ height: "270px", width: "100%", objectFit: "cover" }}
                          />
                        )}
                        <div className="box_content">
                          <h4>
                            {place.title} {place.km}
                          </h4>
                          <div className="row pl-2 pr-2"></div>
                          <button className="btn1">Vezi detalii</button>

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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <li key={pageNumber}>
                <button onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
 
