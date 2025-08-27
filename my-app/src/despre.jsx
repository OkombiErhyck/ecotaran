import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext"; 
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "./image";
import display from "./images/display.png"; // fallback/default image
import "./userpage.css";
import Logout from "./images/logout.png";
import setting from "./images/setting.png";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(9);

  const [selectedMarca, setSelectedMarca] = useState("");
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
        .filter(Boolean); // remove undefined/null

      setCategories([...new Set(allCategories)]); // unique categories
    });
  }, []);

  // Filter places based on selected category, search, and only user's family
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
        <h1 style={{ marginBottom: "40px", textAlign: "center", color: "aliceblue", fontSize: "38px", fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
          {selectedMarca ? selectedMarca : <><span style={{ color: "var(--main, #4CAF50)" }}>Bine ai venit, </span>{user?.name}</>}
        </h1>

        {/* CATEGORY GRID */}
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
              )) : <p style={{ color: "white" }}>Nu există categorii.</p>}

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

        {/* BACK + SEARCH + PLACES GRID */}
       {selectedMarca && ( <> <div className="details container mb-4"> 
        <div className="row justify-content-center align-items-center" style={{ gap: "20px" }}> {/* BACK BUTTON */} <div className="col-lg-3 col-xs-6 mb-2"> <button style={{ width: "100%", backgroundColor: "#1a1a1a", color: "var(--main, #4CAF50)", border: "2px solid var(--main, #4CAF50)", padding: "12px 25px", borderRadius: "12px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0px 5px 15px rgba(0,0,0,0.4)", transition: "all 0.3s ease", }} onMouseEnter={(e) => { e.target.style.backgroundColor = "var(--main, #4CAF50)"; e.target.style.color = "#fff"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0px 8px 20px rgba(0,0,0,0.5)"; }} onMouseLeave={(e) => { e.target.style.backgroundColor = "#1a1a1a"; e.target.style.color = "var(--main, #4CAF50)"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0px 5px 15px rgba(0,0,0,0.4)"; }} onClick={resetFilters} > Înapoi </button> </div> {/* SEARCH BAR */}
        <div className="col-lg-4 col-xs-6 mb-2" style={{ position: "relative" }}> 
          <input type="text" placeholder="Cautare..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} style={{ padding: "12px 50px 12px 15px", width: "100%", borderRadius: "12px", fontSize: "16px", border: "2px solid var(--main, #4CAF50)", backgroundColor: "#1a1a1a", color: "aliceblue", boxShadow: "0px 5px 15px rgba(0,0,0,0.4)", }} />
           {searchTitle && ( <button onClick={() => setSearchTitle("")} style={{ position: "absolute", right: "19px", top: "50%", transform: "translateY(-50%)", backgroundColor: "var(--main, #4CAF50)", color: "#fff", border: "none", borderRadius: "8px", padding: "4px 8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", boxShadow: "0px 3px 10px rgba(0,0,0,0.3)", }} onMouseEnter={(e) => { e.target.style.opacity = 0.8; }} onMouseLeave={(e) => { e.target.style.opacity = 1; }} > sterge </button> )} 
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

                   <Link to={"/write/" + place._id} style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.5)", padding: "6px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "none", }} title="Editează" > <img src="https://img.icons8.com/ios-glyphs/24/ffffff/pencil.png" alt="Edit" style={{ width: "20px", height: "20px" }} /> </Link>
                      <div className="box_content text-center" style={{ paddingTop: "10px" }}>
                        <h4>{place.title}</h4>
                       <Link to={"/place/" + place._id} className="btn1" style={{ textDecoration: "none" }}> Vezi detalii </Link>
                      </div>
                    </div>
                  </div>
                )) : <p style={{ color: "white" }}>Nu s-au găsit rezultate.</p>}
              </div>
            </div>

            <div className="mt-4" style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "10px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <li key={pageNumber}>
                    <button onClick={() => handlePageChange(pageNumber)} className="btn1">{pageNumber}</button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
