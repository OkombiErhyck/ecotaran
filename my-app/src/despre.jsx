import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext"; 
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "./image";
import display from "./images/display.png"; // fallback/default image
import "./userpage.css";
import Logout from "./images/logout.png";
import setting from "./images/setting.png";
import Carousel from "react-bootstrap/Carousel";



export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);
const [showMore, setShowMore] = useState(false);

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null); // 👈 NEW: virtual page 2
  const [searchTitle, setSearchTitle] = useState("");
  const { user } = useContext(UserContext);

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

  const [categories, setCategories] = useState([]);

  const categoryIcons = {
    "Personal Ro": "https://img.icons8.com/ios/100/user--v1.png",
    "Personal Non UE": "https://img.icons8.com/ios/100/conference-call.png",
    "Automobile": "https://img.icons8.com/ios/100/car--v1.png",
    "Companie": "https://img.icons8.com/ios/100/company.png",
    "Cazare": "https://img.icons8.com/ios/100/real-estate.png",
  };

  // Fetch places
  useEffect(() => {
    axios.get("/places").then((res) => {
      setPlaces(res.data);

      // Detect all categories dynamically from places
      const allCategories = res.data
        .map(place => place.marca)
        .filter(Boolean);

      setCategories([...new Set(allCategories)]);
    });
  }, []);

  // Filter places
  const filteredPlaces = places.filter((place) => {
    if (user?.family && place.family !== user.family) return false;
    if (selectedMarca && place.marca !== selectedMarca) return false;
    if (searchTitle && !place.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    if (selectedModel && place.model !== selectedModel) return false;
    if (selectedAnul && place.anul !== selectedAnul) return false;
    if (selectedCombustibil && place.combustibil !== selectedCombustibil) return false;
    if (selectedPutere && !(Number(place.putere) >= Number(selectedPutere) && Number(place.putere) < Number(selectedPutere) + 100)) return false;
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
const [showDocuments, setShowDocuments] = React.useState(false);
const [showAmanunte, setShowAmanunte] = React.useState(false);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (window.pageYOffset > 0) window.scrollTo(0, 0);
  };

  const resetFilters = () => {
    setSelectedMarca("");
    setSelectedPlace(null); // reset place details too
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
        <h1 style={{ marginBottom: "40px", textAlign: "center", color: "aliceblue", fontSize: "38px", fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
          {selectedMarca ? (selectedPlace ? selectedPlace.title : selectedMarca) : 
          <><span style={{ color: "var(--main, #4CAF50)" }}>Bine ai venit, </span>{user?.name}</>}
        </h1>

        {/* PAGE 1 - CATEGORY GRID */}
        {!selectedMarca && (
          <div className="details container">
            <div className="row">
              {categories.length > 0 ? categories.map((marca) => (
                <div key={marca} className="col-lg-4 col-xs-6 mb-3">
                  <div className="box card-body p-0 shadow-sm">
                    <div className="box_content text-center">
                      <img
                        src={categoryIcons[marca] || display}
                        className="img-fluid mb-2"
                        alt={marca}
                        style={{ height: "75px", objectFit: "contain" }}
                      />
                      <button className="btn1" onClick={() => setSelectedMarca(marca)}>
                        {marca}
                      </button>
                    </div>
                  </div>
                </div>
              )) : <p style={{ color: "white" }}>Se incarca...</p>}

              {/* ADMIN BUTTON */}
              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/fructe">
                      <img src={setting} className="img-fluid" alt="" />
                      <button className="btn1">Administrare</button>
                    </a>
                  </div>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="col-lg-4 col-xs-6 mb-3">
                <div className="box card-body p-0 shadow-sm">
                  <div className="box_content text-center">
                    <img src={Logout} className="img-fluid" alt="" />
                    <button
                      className="btn1"
                      onClick={async () => {
                        await axios.post("/logout");
                        window.location.href = "/";
                      }}
                    >
                      Iesire
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PAGE 2 - PLACES GRID */}
        {selectedMarca && !selectedPlace && (
          <>
            <div className="details container mb-4">
              <div className="row justify-content-center align-items-center" style={{ gap: "20px" }}>
                {/* BACK BUTTON */}
                <div className="col-lg-3 col-xs-6 mb-2">
                  <button style={{ width: "100%" }}
                    className="btn1"
                    onClick={resetFilters}
                  >Înapoi</button>
                </div>
                {/* SEARCH BAR */}
                <div className="col-lg-4 col-xs-6 mb-2" style={{ position: "relative" }}>
                  <input type="text"
                    placeholder="Cautare..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    style={{ padding: "12px 15px", width: "100%", borderRadius: "12px" }}
                  />
                </div>
              </div>
            </div>
            

            <div className="details container">
              <div className="row">
                {currentPlaces.length > 0 ? currentPlaces.map((place) => (
                  <div key={place._id} className="col-lg-4 col-xs-6">
                    <div className="box card-body p-0 shadow-sm mb-5" style={{ position: "relative" }}>
                      {place.photos.length > 0 ? (
                        <Image src={place.photos[0]} className="img-fluid" style={{ height: "270px", width: "100%", objectFit: "cover" }} />
                      ) : (
                        <img src={display} alt="fallback" style={{ height: "270px", width: "100%", objectFit: "cover" }} />
                      )}

                      <div className="box_content text-center" style={{ paddingTop: "10px" }}>
                        <h4>{place.title}</h4>
                        <button className="btn1" onClick={() => setSelectedPlace(place)}>
                          Vezi detalii
                        </button>
                      </div>
                    </div>
                  </div>
                )) : <p style={{ color: "white" }}>Nu s-au găsit rezultate.</p>}
              </div>
            </div>
          </>
        )}

        {/* PAGE 3 - PLACE DETAILS */}
   {selectedPlace && (
  <div
    style={{
      marginTop: "90px",
      background: "#3c3c3c",
      padding: "20px",
      borderBottom: "2px solid var(--main)",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    }}
  >
    {/* Back Button */}
    <div style={{ marginBottom: "1rem" }}>
      <button
        onClick={() => setSelectedPlace(null)}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "var(--main)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ← Înapoi la listă
      </button>
    </div>

    {/* Carousel */}
    {selectedPlace.photos?.length > 0 && (
      <Carousel
        style={{
          borderBottom: "2px solid var(--main)",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        {selectedPlace.photos.map((photo, index) => (
          <Carousel.Item key={index}>
            <Image
              className="d-block w-100"
              src={photo}
              alt={`Slide ${index + 1}`}
              style={{
                objectFit: "contain",
                maxHeight: "500px",
                width: "100%"
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )}

    {/* Info Grid (Responsive) */}
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
      }}
    >
      {/* Description */}
      <div
        style={{
          flex: "2 1 600px", // takes 2/3 width on large, full width on small
          background: "#1a1a1a",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          color: "wheat"
        }}
      >
        <h3 style={{ color: "var(--main)", marginBottom: "0.5rem" }}>
          Descriere
        </h3>

        {selectedPlace.description ? (
          selectedPlace.description.length > 400 ? (
            <>
              <div
                style={{
                  maxHeight: showMore ? "none" : "200px",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease"
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  {selectedPlace.description
                    .split(/\r?\n/)
                    .filter((line) => line.trim() !== "")
                    .map((line, idx) => (
                      <li
                        key={idx}
                        style={{
                          background: "#2a2a2a",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        {line}
                      </li>
                    ))}
                </ul>
              </div>
              <button
                onClick={() => setShowMore((prev) => !prev)}
                style={{
                  marginTop: "8px",
                  padding: "0.4rem 0.8rem",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "var(--main)",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            </>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              {selectedPlace.description
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "")
                .map((line, idx) => (
                  <li
                    key={idx}
                    style={{
                      background: "#2a2a2a",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                    }}
                  >
                    {line}
                  </li>
                ))}
            </ul>
          )
        ) : (
          <p style={{ color: "#aaa" }}>Nu a fost adăugat nimic.</p>
        )}
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: "1 1 300px", // shrinks to fit, full width on small
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {/* Documents */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            color: "wheat"
          }}
        >
          <h3
            onClick={() => setShowDocuments((prev) => !prev)}
            style={{
              color: "var(--main)",
              marginBottom: "0.5rem",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            Documente atașate <span>{showDocuments ? "▲" : "▼"}</span>
          </h3>
          <div
            style={{
              maxHeight: showDocuments ? "200px" : "0px",
              overflowY: "auto",
              transition: "max-height 0.3s ease"
            }}
          >
            {selectedPlace.documents &&
            selectedPlace.documents.length > 0 ? (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                {selectedPlace.documents.map((url, index) => {
                  const filename = decodeURIComponent(
                    url.split("/").pop().split("?")[0]
                  ).replace(/^\d+-/, "");
                  return (
                    <li
                      key={index}
                      style={{
                        background: "#2a2a2a",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                      }}
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--main)",
                          textDecoration: "none"
                        }}
                      >
                        📄 {filename}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p style={{ color: "#aaa" }}>Niciun document atașat.</p>
            )}
          </div>
        </div>

        {/* Amanunte */}
       <div
          style={{
            background: "#1a1a1a",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            color: "wheat"
          }}
        >
          <h3
            onClick={() => setShowAmanunte(prev => !prev)}
            style={{
              color: "var(--main)",
              marginBottom: "0.5rem",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            Amanunte <span>{showAmanunte ? "▲" : "▼"}</span>
          </h3>
          <div style={{ maxHeight: showAmanunte ? "300px" : "0px", overflowY: "auto", transition: "max-height 0.4s ease" }}>
            {selectedPlace.nume ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedPlace.nume
                  .split(/\r?\n/)
                  .filter(line => line.trim() !== "")
                  .map((line, idx) => (
                    <li
                      key={idx}
                      style={{
                        background: "#2a2a2a",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.2)" 
                      }}
                    >
                      {line}
                    </li>
                  ))}
              </ul>
            ) : (
              <p style={{ color: "#aaa", margin: 0 }}>Nu a fost adăugat nimic.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}



      </div>
    </div>
  );
}
