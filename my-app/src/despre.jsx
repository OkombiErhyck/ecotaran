import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css";
import { Link } from "react-router-dom";
import Image from "./image";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAnul, setSelectedAnul] = useState("");
  const [selectedCombustibil, setSelectedCombustibil] = useState("");
  const [selectedPutere, setSelectedPutere] = useState("");
  const [selectedKmMin, setSelectedKmMin] = useState("");
  const [selectedKmMax, setSelectedKmMax] = useState("");
  const [selectedTitleMin, setSelectedTitleMin] = useState("");
  const [selectedTitleMax, setSelectedTitleMax] = useState("");

  // New states for filtering description keywords
  const [showOnlyCapital, setShowOnlyCapital] = useState(false);
  const [showOnlyComplete, setShowOnlyComplete] = useState(false);
  const [showOnlyAMT, setShowOnlyAMT] = useState(false);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  const filteredPlaces = places.filter((place) => {
    if (!place.marca?.toLowerCase().includes("personal")) return false;
    if (selectedMarca && place.marca !== selectedMarca) return false;
    if (selectedModel && place.model !== selectedModel) return false;
    if (selectedAnul && place.anul !== selectedAnul) return false;
    if (selectedCombustibil && place.combustibil !== selectedCombustibil) return false;
    if (
      selectedPutere &&
      !(Number(place.putere) >= Number(selectedPutere) && Number(place.putere) < Number(selectedPutere) + 100)
    )
      return false;
    if (selectedKmMin && !(place.km >= Number(selectedKmMin))) return false;
    if (selectedKmMax && !(place.km <= Number(selectedKmMax))) return false;
    if (selectedTitleMin && !(place.title >= Number(selectedTitleMin))) return false;
    if (selectedTitleMax && !(place.title <= Number(selectedTitleMax))) return false;

    // Description keyword filters (AND logic)
    if (showOnlyCapital && !place.description?.toLowerCase().includes("capital")) return false;
    if (showOnlyComplete && !place.description?.toLowerCase().includes("complete")) return false;
    if (showOnlyAMT && !place.description?.toLowerCase().includes("amt")) return false;

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
    setShowOnlyCapital(false);
    setShowOnlyComplete(false);
    setShowOnlyAMT(false);
  };

  return (
    <>
      <div className="top"></div>
      <div className="main2">
        <div className="container">
          <div className="filter-container">
            <div className="marca1-buttons">
  {["Personal RO", "Personal NON UE"].map((marca) => (
    <button
      key={marca}
      onClick={() => handleMarcaClick(marca)}
      className={`marca1-button ${
        selectedMarca === marca ? "active" : ""
      } ${
        marca === "Personal RO"
          ? "personal-ro"
          : marca === "Personal NON UE"
          ? "personal-non-ue"
          : ""
      }`}
    >
      {marca}
    </button>
  ))}

  {/* Capital filter button */}
  <button
    onClick={() => setShowOnlyCapital((prev) => !prev)}
    className={`marca1-button capital-clean ${showOnlyCapital ? "active" : ""}`}
  >
    Capital Clean Group
  </button>

  {/* Complete filter button */}
  <button
    onClick={() => setShowOnlyComplete((prev) => !prev)}
    className={`marca1-button complete-recruitment ${
      showOnlyComplete ? "active" : ""
    }`}
  >
    Complete Recruitment
  </button>

  {/* AMT filter button */}
  <button
    onClick={() => setShowOnlyAMT((prev) => !prev)}
    className={`marca1-button amt ${showOnlyAMT ? "active" : ""}`}
  >
    AMT
  </button>
</div>


            <div className="filter-item">
              <button onClick={resetFilters}>Reset</button>
            </div>
          </div>

          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentPlaces.length > 0 ? (
                currentPlaces.map((place) => (
                  <Link
                    to={"/place/" + place._id}
                    key={place._id}
                    className="link-no-underline"
                  >
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
                          <button
                            style={{
                              background: "rgb(216 212 208 / 78%)",
                              color: "var(--main)",
                              padding: "14px",
                              width: "131px",
                              marginLeft: "126px",
                            }}
                            className="btn1"
                          >
                            Vezi detalii
                          </button>
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
