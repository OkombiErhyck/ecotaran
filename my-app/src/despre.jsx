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
import Anunt from "./images/add.png";


export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);
const [showMore, setShowMore] = useState(false);
 const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

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

 const saveField = async (field) => {
    try {
      const res = await axios.put(`/places/${selectedPlace._id}/update-field`, {
        field,
        value: fieldValue,
      });
      setSelectedPlace(res.data);
      setEditingField(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update field");
    }
  };

  // --- Upload doc ---
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await axios.post(
        `/places/${selectedPlace._id}/upload-doc`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSelectedPlace(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // --- Delete doc ---
  const handleDocDelete = async (url) => {
    try {
      const filename = url.split("/").pop();
      await axios.delete(`/places/${selectedPlace._id}/delete-doc`, {
        data: { filename },
      });
      setSelectedPlace((prev) => ({
        ...prev,
        documents: prev.documents.filter((d) => d !== url),
      }));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const getDocumentName = (url) => {
    const filename = decodeURIComponent(url.split("/").pop().split("?")[0]);
    return filename.replace(/^\d+-/, "").replace(/[-_]+/g, " ");
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



 {/* Adauga BUTTON */}
<div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/write">
                      <img src={Anunt} className="img-fluid" alt="" />
                      <button className="btn1">Adauga</button>
                    </a>
                  </div>
                </div>
              </div>



              {/* ADMIN BUTTON  
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
*/}
               
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
      {/* Place Image */}
      {place.photos.length > 0 && (
        <Image
          src={place.photos[0]}
          className="img-fluid"
          style={{ height: "270px", width: "100%", objectFit: "cover",   }}
        />
      )}

      {/* ✏️ Edit Place Button */}
      <button
  onClick={() => window.location.href = `/write/${place._id}`}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.4)";
  }}
>
  <img
    src="https://img.icons8.com/ios-filled/16/ffffff/pencil.png"
    alt="Edit"
    style={{ width: "16px", height: "16px" }}
  />
</button>


      {/* Place Info */}
      <div className="box_content text-center">
        <h4>{place.title}</h4>
        <button  onClick={() => setSelectedPlace(place)}className="btn1">Vezi detalii</button>
      </div>
    </div>
  </div>
)) : <p>Nu s-au găsit rezultate.</p>}

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
              gap: "2rem",
            }}
          >
            {/* Back */}
            <button
              onClick={() => setSelectedPlace(null)}
              style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "var(--main)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              ← Înapoi la listă
            </button>

            {/* Carousel */}
            {selectedPlace.photos?.length > 0 && (
              <Carousel>
                {selectedPlace.photos.map((photo, i) => (
                  <Carousel.Item key={i}>
                    <Image
                      className="d-block w-100"
                      src={photo}
                      alt=""
                      style={{ objectFit: "contain", maxHeight: "500px" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}

            {/* Info Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {/* Description with inline edit */}
              <div style={{ flex: "2 1 600px", background: "#1a1a1a", padding: "1rem", borderRadius: "10px", color: "wheat" }}>
                <h3 style={{ color: "var(--main)" }}>Descriere</h3>
                {editingField === "description" ? (
                  <div>
                    <textarea
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      rows={6}
                      style={{ width: "100%" }}
                    />
                    <button onClick={() => saveField("description")}>💾 Save</button>
                    <button onClick={() => setEditingField(null)}>✖ Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p>{selectedPlace.description || "Nu a fost adăugat nimic."}</p>
                    <button
                      onClick={() => {
                        setEditingField("description");
                        setFieldValue(selectedPlace.description || "");
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div style={{ flex: "1 1 300px", background: "#1a1a1a", padding: "1rem", borderRadius: "10px", color: "wheat" }}>
                <h3
                  onClick={() => setShowDocuments((p) => !p)}
                  style={{ color: "var(--main)", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                >
                  Documente atașate <span>{showDocuments ? "▲" : "▼"}</span>
                </h3>
                <div style={{ maxHeight: showDocuments ? "300px" : "0px", overflowY: "auto", transition: "max-height 0.3s ease" }}>
                  {selectedPlace.documents?.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {selectedPlace.documents.map((url, i) => (
                        <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--main)" }}>
                            📄 {getDocumentName(url)}
                          </a>
                          <button onClick={() => handleDocDelete(url)}>🗑️</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#aaa" }}>Niciun document atașat.</p>
                  )}
                  <input type="file" onChange={handleDocUpload} />
                </div>
              </div>

              {/* Amanunte */}
              <div style={{ flex: "1 1 300px", background: "#1a1a1a", padding: "1rem", borderRadius: "10px", color: "wheat" }}>
                <h3
                  onClick={() => setShowAmanunte((p) => !p)}
                  style={{ color: "var(--main)", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                >
                  Amanunte <span>{showAmanunte ? "▲" : "▼"}</span>
                </h3>
                <div style={{ maxHeight: showAmanunte ? "300px" : "0px", overflowY: "auto", transition: "max-height 0.3s ease" }}>
                  {selectedPlace.nume ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {selectedPlace.nume.split(/\r?\n/).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#aaa" }}>Nu a fost adăugat nimic.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
