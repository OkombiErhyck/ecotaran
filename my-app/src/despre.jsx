import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext"; 
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "./image";
import display from "./images/display.png"; // Default category image
import "./userpage.css"; // Apply same CSS as Userpage

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);

  const [selectedMarca, setSelectedMarca] = useState(""); // category selected
  const [searchTitle, setSearchTitle] = useState("");
const { user } = useContext(UserContext); // <-- define user
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAnul, setSelectedAnul] = useState("");
  const [selectedCombustibil, setSelectedCombustibil] = useState("");
  const [selectedPutere, setSelectedPutere] = useState("");
  const [selectedKmMin, setSelectedKmMin] = useState("");
  const [selectedKmMax, setSelectedKmMax] = useState("");
  const [selectedTitleMin, setSelectedTitleMin] = useState("");
  const [selectedTitleMax, setSelectedTitleMax] = useState("");

  const [showOnlyCapital, setShowOnlyCapital] = useState(false);
  const [showOnlyComplete, setShowOnlyComplete] = useState(false);
  const [showOnlyAMT, setShowOnlyAMT] = useState(false);

  useEffect(() => {
    axios.get("/places").then((response) => setPlaces(response.data));
  }, []);

  const marcas = ["Personal Ro", "Personal Strain", "Flota", "Companii","Cazari"];

  const filteredPlaces = places.filter((place) => {
    if (!selectedMarca) return false;
    if (place.marca !== selectedMarca) return false;
    if (searchTitle && !place.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    if (selectedModel && place.model !== selectedModel) return false;
    if (selectedAnul && place.anul !== selectedAnul) return false;
    if (selectedCombustibil && place.combustibil !== selectedCombustibil) return false;
    if (
      selectedPutere &&
      !(Number(place.putere) >= Number(selectedPutere) &&
        Number(place.putere) < Number(selectedPutere) + 100)
    ) return false;
    if (selectedKmMin && !(place.km >= Number(selectedKmMin))) return false;
    if (selectedKmMax && !(place.km <= Number(selectedKmMax))) return false;
    if (selectedTitleMin && !(place.title >= Number(selectedTitleMin))) return false;
    if (selectedTitleMax && !(place.title <= Number(selectedTitleMax))) return false;
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
    if (window.pageYOffset > 0) window.scrollTo(0, 0);
  };

  const resetFilters = () => {
    setSelectedMarca("");
    setSearchTitle("");
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
    <div className="userbox">
      <div className="usercontent">
    <h1
  style={{
    marginBottom: "40px",
    textAlign: "center",
    color: "aliceblue",
    fontSize: "38px",
    fontWeight: "bold",
    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
  }}
>
  {selectedMarca ? (
    selectedMarca
  ) : (
    <>
      <span style={{ color: "var(--main, #4CAF50)" }}>Bine ai venit, </span>
      {user?.name}
    </>
  )}
</h1>




        {!selectedMarca ? (
          <div className="details container">
            <div className="row">
              {marcas.map((marca) => (
                <div key={marca} className="col-lg-4 col-xs-6">
                  <div className="box card-body p-0 shadow-sm mb-5">
                    <div className="box_content text-center">
                      <img
                        src={display}
                        className="img-fluid mb-2"
                        alt={marca}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <button className="btn1" onClick={() => setSelectedMarca(marca)}>
                        {marca}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* BACK + SEARCH */}
           <div className="details container mb-4">
  <div className="row justify-content-center align-items-center" style={{ gap: "20px" }}>
    {/* Back Button */}
    <div className="col-lg-3 col-xs-6 mb-2">
      <div>
        <button
          style={{
            width: "100%",
            backgroundColor: "#1a1a1a",
            color: "var(--main, #4CAF50)",
            border: "2px solid var(--main, #4CAF50)",
            padding: "12px 25px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--main, #4CAF50)";
            e.target.style.color = "#fff";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0px 8px 20px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#1a1a1a";
            e.target.style.color = "var(--main, #4CAF50)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0px 5px 15px rgba(0,0,0,0.4)";
          }}
          onClick={resetFilters} // or your back function
        >
          Înapoi
        </button>
      </div>
    </div>

    {/* Search Bar */}
   <div className="col-lg-4 col-xs-6 mb-2" style={{ position: "relative" }}>
  <input
    type="text"
    placeholder="Cautare..."
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
    style={{
      padding: "12px 50px 12px 15px", // leave space for reset button
      width: "100%",
      borderRadius: "12px",
      fontSize: "16px",
      border: "2px solid var(--main, #4CAF50)",
      backgroundColor: "#1a1a1a",
      color: "aliceblue",
      boxShadow: "0px 5px 15px rgba(0,0,0,0.4)",
    }}
  />
  {searchTitle && (
    <button
      onClick={() => setSearchTitle("")}
      style={{
        position: "absolute",
        right: "19px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "var(--main, #4CAF50)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "4px 8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        e.target.style.opacity = 0.8;
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = 1;
      }}
    >
      sterge
    </button>
  )}
</div>

  </div>
</div>


            {/* PLACES GRID */}
           {/* PLACES GRID */}
<div className="details container">
  <div className="row">
    {currentPlaces.length > 0 ? (
      currentPlaces.map((place) => (
        <div key={place._id} className="col-lg-4 col-xs-6">
          <Link to={"/place/" + place._id} className="link-no-underline">
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
              <div className="box_content text-center">
                <h4>{place.title}</h4>
                <button className="btn1">Vezi detalii</button>
              </div>
            </div>
          </Link>
        </div>
      ))
    ) : (
      <p>Nu s-au găsit rezultate.</p>
    )}
  </div>
</div>


            {/* PAGINATION */}
            <div
  className="mt-4"
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  }}
>
  <ul
    style={{
      listStyle: "none",
      padding: 0,
      display: "flex",
      gap: "10px",
    }}
  >
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (pageNumber) => (
        <li key={pageNumber}>
          <button
            onClick={() => handlePageChange(pageNumber)}
            style={{
              backgroundColor: "#1a1a1a",
              color: "var(--main, #4CAF50)",
              border: "2px solid var(--main, #4CAF50)",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--main, #4CAF50)";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#1a1a1a";
              e.target.style.color = "var(--main, #4CAF50)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {pageNumber}
          </button>
        </li>
      )
    )}
  </ul>
</div>

          </>
        )}
      </div>
    </div>
  );
}
