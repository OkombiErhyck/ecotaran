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

const toBackendField = (field) => (field === "amanunte" ? "nume" : field);

// helper to fetch the latest place from backend (returns place object)
const fetchLatestPlace = async () => {
  const res = await axios.get(`/places/${selectedPlace._id}`);
  return res.data;
};

// apply update to server and update UI state reliably
const applyUpdateToServerAndState = async (backendField, updatedValue) => {
  // PUT the updated field
  const putRes = await axios.put(`/places/${selectedPlace._id}`, {
    [backendField]: updatedValue,
  });

  // If API returns updated doc, use it; otherwise fetch fresh
  let updatedPlace = putRes?.data;
  if (!updatedPlace || !updatedPlace._id) {
    updatedPlace = (await axios.get(`/places/${selectedPlace._id}`)).data;
  }

  // update UI state
  setSelectedPlace(updatedPlace);
  setPlaces((prev) => prev.map((p) => (p._id === updatedPlace._id ? updatedPlace : p)));
};

// Save (edit or add) a line for 'description' or 'amanunte' (maps to nume)
const saveField = async (field, target) => {
  try {
    const backendField = toBackendField(field);

    // 1) Read the latest server value to avoid overwriting concurrent updates
    const latest = await fetchLatestPlace();
    const raw = latest[backendField] ?? "";

    // 2) Build lines array (keep empty strings if present)
    // If raw === "" => lines = []
    const lines = raw === "" ? [] : raw.split(/\r?\n/);

    // 3) Apply change
    if (target === "new") {
      if (!fieldValue || !fieldValue.trim()) {
        alert("Introduceți un text valid înainte de salvare.");
        return;
      }
      lines.push(fieldValue.trim());
    } else if (typeof target === "number") {
      if (target < 0 || target >= lines.length) {
        alert("Index invalid.");
        return;
      }
      lines[target] = fieldValue; // keep exact value (no forced trim)
    } else {
      console.warn("Unknown target for saveField:", target);
      return;
    }

    // 4) Join and send
    const updatedValue = lines.join("\n");
    await applyUpdateToServerAndState(backendField, updatedValue);

    // 5) Reset editing state
    setEditingField(null);
    setFieldValue("");
  } catch (err) {
    console.error("saveField error:", err);
    alert("Nu s-a putut salva. Încearcă din nou.");
  }
};

// Delete a single row (by index) from description / amanunte
const deleteField = async (field, idx) => {
  try {
    const backendField = toBackendField(field);

    // get latest
    const latest = await fetchLatestPlace();
    const raw = latest[backendField] ?? "";
    const lines = raw === "" ? [] : raw.split(/\r?\n/);

    if (idx < 0 || idx >= lines.length) {
      alert("Index invalid pentru ștergere.");
      return;
    }

    // remove
    lines.splice(idx, 1);
    const updatedValue = lines.join("\n");

    await applyUpdateToServerAndState(backendField, updatedValue);

    // clear editing state if it targeted this row
    setEditingField(null);
    setFieldValue("");
  } catch (err) {
    console.error("deleteField error:", err);
    alert("Nu s-a putut șterge. Încearcă din nou.");
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
      {/* Place Image / PDF Preview */}
{place.photos.length > 0 && (
  place.photos[0].toLowerCase().endsWith(".pdf") ? (
    <div
      style={{
        position: "relative",
        height: "270px",
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: "6px",
        overflow: "hidden", // hide scrollbars
        background: "#f5f5f5",
      }}
    >
      <iframe
        src={place.photos[0]}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "hidden", // hide scrollbars inside iframe
        }}
        title="PDF Preview"
      />
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "2px 6px",
          borderRadius: "3px",
          fontSize: "0.85rem",
          fontWeight: "bold",
        }}
      >
        PDF
      </div>
    </div>
  ) : (
    <Image
      src={place.photos[0]}
      className="img-fluid"
      style={{
        height: "270px",
        width: "100%",
        objectFit: "cover",
        borderRadius: "6px",
      }}
    />
  )
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
    

    {/* Carousel */}
{selectedPlace.photos?.length > 0 && (
  <Carousel>
    {selectedPlace.photos.map((file, i) => {
      const isPdf = file.toLowerCase().endsWith(".pdf");

      return (
        <Carousel.Item key={i}>
          {isPdf ? (
            <div style={{ textAlign: "center" }}>
              <iframe
                src={file}
                title={`pdf-${i}`}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#fff",
                }}
              />
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "var(--main)",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                📄 Descarcă PDF
              </a>
            </div>
          ) : (
            <Image
              className="d-block w-100"
              src={file}
              alt=""
              style={{
                objectFit: "contain",
                maxHeight: "500px",
                borderRadius: "6px",
              }}
            />
          )}
        </Carousel.Item>
      );
    })}
  </Carousel>
)}



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


    {/* Info Grid */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {/* Left side: Description */}
      <div
        style={{
          flex: "2 1 600px",
          background: "#1a1a1a",
          padding: "1rem",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <h3 style={{ color: "var(--main)" }}>Descriere</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {selectedPlace.description
            ? selectedPlace.description.split(/\r?\n/).map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#2a2a2a",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {editingField === `description-${idx}` ? (
                    <>
                      <input
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #555",
                          background: "#1a1a1a",
                          color: "white",
                        }}
                      />
                      <button
                        onClick={() => saveField("description", idx)}
                        style={{
                          background: "var(--main)",
                          border: "none",
                          borderRadius: "16px",
                          padding: "4px 4px",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        💾
                      </button>
                      <button
                        onClick={() => deleteField("description", idx)}
                        style={{
                          background: "#555",
                          border: "none",
                          borderRadius: "16px",
                          padding: "2px 6px",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{line}</span>
                      <button
                        onClick={() => {
                          setEditingField(`description-${idx}`);
                          setFieldValue(line);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderRadius: "16px",
                          padding: "2px 4px",
                          cursor: "pointer",
                          color: "#fff",
                          opacity: 0.7,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = 1)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = 0.7)
                        }
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/16/ffffff/pencil.png"
                          alt="Edit"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </button>
                    </>
                  )}
                </div>
              ))
            : (
              <div style={{ color: "#aaa", fontStyle: "italic" }}>
                Nu a fost adăugat nimic.
              </div>
            )}

          {/* Add New Row */}
          <button
      onClick={() => {
        setEditingField("nume-new");
        setFieldValue("");
      }}
      style={{
        marginTop: "8px",
        padding: "6px 10px",
        backgroundColor: "var(--main)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        alignSelf: "flex-start",
      }}
    >
      <img
        src="https://img.icons8.com/ios-glyphs/24/ffffff/plus-math.png"
        alt="Add"
        style={{ width: "16px", height: "16px", marginRight: "6px" }}
      />
      Adaugă
    </button>

          {editingField === "description-new" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #555",
                  background: "#1a1a1a",
                  color: "wheat",
                }}
              />
              <button
                onClick={() => saveField("description", "new")}
                style={{
                  background: "var(--main)",
                  border: "none",
                  borderRadius: "16px",
                  padding: "4px 4px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                💾
              </button>
              <button
                onClick={() => setEditingField(null)}
                style={{
                  background: "#555",
                  border: "none",
                  borderRadius: "16px",
                  padding: "4px 4px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                ✖
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: stack Documents + Amanunte */}
      <div
        style={{
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Documents */}
<div
  style={{
    background: "#1a1a1a",
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    color: "wheat",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  }}
>
  <h3
    onClick={() => setShowDocuments((p) => !p)}
    style={{
      color: "var(--main)",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "1.2rem",
      margin: 0,
    }}
  >
    Documente atașate <span>{showDocuments ? "▲" : "▼"}</span>
  </h3>

  <div
    style={{
      maxHeight: showDocuments ? "300px" : "0px",
      overflowY: "auto",
      transition: "max-height 0.3s ease",
      paddingRight: showDocuments ? "6px" : "0px",
    }}
  >
    {selectedPlace.documents?.length > 0 ? (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {selectedPlace.documents.map((url, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#2a2a2a",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "8px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2a2a2a")}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "wheat",
                textDecoration: "none",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📄 {getDocumentName(url)}
            </a>
            <button
              onClick={() => handleDocDelete(url)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#ff6b6b",
                fontSize: "1.1rem",
              }}
              title="Șterge document"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p style={{ color: "#aaa", fontStyle: "italic", margin: 0 }}>
        Niciun document atașat.
      </p>
    )}

    {/* Upload input */}
    <label
      style={{
        display: "inline-block",
        marginTop: "10px",
        padding: "8px 14px",
        background: "var(--main)",
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.9rem",
        textAlign: "center",
      }}
    >
      📤 Încarcă document
      <input
        type="file"
        onChange={handleDocUpload}
        style={{ display: "none" }}
      />
    </label>
  </div>
</div>


       {/* Amanunte */}
<div
  style={{
    background: "#1a1a1a",
    padding: "1rem",
    borderRadius: "12px",
    color: "wheat",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  }}
>
  <h3
    onClick={() => setShowAmanunte((p) => !p)}
    style={{
      color: "var(--main)",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "1.2rem",
      margin: 0,
    }}
  >
    Amanunte <span>{showAmanunte ? "▲" : "▼"}</span>
  </h3>

  <div
    style={{
      maxHeight: showAmanunte ? "300px" : "0px",
      overflowY: "auto",
      transition: "max-height 0.3s ease",
      paddingRight: showAmanunte ? "6px" : "0px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    {(selectedPlace.nume ?? "").split(/\r?\n/).length > 0 &&
    (selectedPlace.nume ?? "") !== "" ? (
      (selectedPlace.nume ?? "").split(/\r?\n/).map((line, idx) => (
        <div
          key={idx}
          style={{
            background: "#2a2a2a",
            padding: "10px 14px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {editingField === `amanunte-${idx}` ? (
            <>
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #555",
                  background: "#1a1a1a",
                  color: "wheat",
                }}
              />
              <button
                onClick={() => saveField("amanunte", idx)}
                style={{
                  background: "var(--main)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                title="Salvează rând"
              >
                💾
              </button>
              <button
                onClick={() => deleteField("amanunte", idx)}
                style={{
                  background: "#a00",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                title="Șterge rând"
              >
                ✖
              </button>
            </>
          ) : (
            <>
              <span style={{ flex: 1 }}>{line}</span>
              <button
                onClick={() => {
                  setEditingField(`amanunte-${idx}`);
                  setFieldValue(line);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
                title="Editează rând"
              >
                <img
                  src="https://img.icons8.com/ios-filled/16/ffffff/pencil.png"
                  alt="Edit"
                  style={{ width: "16px", height: "16px" }}
                />
              </button>
            </>
          )}
        </div>
      ))
    ) : (
      <div style={{ color: "#aaa", fontStyle: "italic" }}>Nu a fost adăugat nimic.</div>
    )}

    {/* Add New Row */}
    <button
      onClick={() => {
        setEditingField("amanunte-new");
        setFieldValue("");
      }}
      style={{
        marginTop: "8px",
        padding: "6px 10px",
        backgroundColor: "var(--main)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        alignSelf: "flex-start",
      }}
    >
      <img
        src="https://img.icons8.com/ios-glyphs/24/ffffff/plus-math.png"
        alt="Add"
        style={{ width: "16px", height: "16px", marginRight: "6px" }}
      />
      Adaugă
    </button>

    {editingField === "amanunte-new" && (
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#1a1a1a",
            color: "wheat",
          }}
        />
        <button
          onClick={() => saveField("amanunte", "new")}
          style={{
            background: "var(--main)",
            border: "none",
            borderRadius: "16px",
            padding: "4px 4px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          💾
        </button>
        <button
          onClick={() => setEditingField(null)}
          style={{
            background: "#555",
            border: "none",
            borderRadius: "16px",
            padding: "4px 4px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          ✖
        </button>
      </div>
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
