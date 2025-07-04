import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css";
import { Link } from "react-router-dom";
import Image from "./image";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);

  const [searchTitle, setSearchTitle] = useState("");

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAnul, setSelectedAnul] = useState("");
  const [selectedCombustibil, setSelectedCombustibil] = useState("");
  const [selectedPutere, setSelectedPutere] = useState("");
  const [selectedKmMin, setSelectedKmMin] = useState("");
  const [selectedKmMax, setSelectedKmMax] = useState("");
  const [selectedTitleMin, setSelectedTitleMin] = useState("");
  const [selectedTitleMax, setSelectedTitleMax] = useState("");

  const [activeFilter, setActiveFilter] = useState(""); // "continental", "hard", "novotel" or ""

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  const filteredPlaces = places.filter((place) => {
    if (place.marca?.toLowerCase() !== "companie") return false;

    if (searchTitle && !place.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;

    if (selectedModel && place.model !== selectedModel) return false;
    if (selectedAnul && place.anul !== selectedAnul) return false;
    if (selectedCombustibil && place.combustibil !== selectedCombustibil) return false;
    if (
      selectedPutere &&
      !(Number(place.putere) >= Number(selectedPutere) && Number(place.putere) < Number(selectedPutere) + 100)
    ) return false;

    if (selectedKmMin && !(place.km >= Number(selectedKmMin))) return false;
    if (selectedKmMax && !(place.km <= Number(selectedKmMax))) return false;
    if (selectedTitleMin && !(place.title >= Number(selectedTitleMin))) return false;
    if (selectedTitleMax && !(place.title <= Number(selectedTitleMax))) return false;

    // Exclusive active filter
    if (activeFilter === "continental" && !place.description?.toLowerCase().includes("curatenie")) return false;
    if (activeFilter === "hard" && !place.description?.toLowerCase().includes("ddd")) return false;
    if (activeFilter === "novotel" && !place.description?.toLowerCase().includes("leasing")) return false;

    return true;
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

  const resetFilters = () => {
    setSearchTitle("");
    setSelectedModel("");
    setSelectedAnul("");
    setSelectedCombustibil("");
    setSelectedPutere("");
    setSelectedKmMin("");
    setSelectedKmMax("");
    setSelectedTitleMin("");
    setSelectedTitleMax("");
    setActiveFilter("");
  };

  return (
    <>
      <div className="top"></div>
      <div className="main2">
        <div className="container">
          <div className="filter-container">
            <div className="filter-item" style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
              />
            </div>

            <div className="marca1-buttons">
              <button
                onClick={() =>
                  setActiveFilter((prev) => (prev === "continental" ? "" : "continental"))
                }
                className={`marca1-button capital-clean ${activeFilter === "continental" ? "active" : ""}`}
              >
                Curățenie
              </button>

              <button
                onClick={() =>
                  setActiveFilter((prev) => (prev === "hard" ? "" : "hard"))
                }
                className={`marca1-button complete-recruitment ${activeFilter === "hard" ? "active" : ""}`}
              >
                DDD
              </button>

              <button
                onClick={() =>
                  setActiveFilter((prev) => (prev === "novotel" ? "" : "novotel"))
                }
                className={`marca1-button amt ${activeFilter === "novotel" ? "active" : ""}`}
              >
                Leasing
              </button>
            </div>

            <div className="filter-item">
              <button onClick={resetFilters}>Reset</button>
            </div>
          </div>

          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-4 g-4">
              {currentPlaces.length > 0 ? (
                currentPlaces.map((place) => (
                  <Link to={"/place/" + place._id} key={place._id} className="link-no-underline">
                    <div className="col">
                      <div className="box card-body p-0 shadow-sm mb-5">
                        {place.photos.length > 0 && (
                          <Image
                            src={place.photos[0]}
                            className="img-fluid"
                            style={{
                              height: "270px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div className="box_content">
                          <h4>
                            {place.title} {place.km}
                          </h4>
                          <button className="btn1">Vezi detalii</button>
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
