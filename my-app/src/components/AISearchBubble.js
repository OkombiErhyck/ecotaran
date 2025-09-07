import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AISearchBubble.css";

export default function AISearchBubble() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ✅ Check login status from backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://ecotaran-nigs.vercel.app/profile", {
          method: "GET",
          credentials: "include", // important to send cookies
        });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(!!data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleSearch = async () => {
    if (!isLoggedIn) {
      setError("⚠️ You must be logged in to search.");
      return;
    }

    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://ecotaran-nigs.vercel.app/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Failed to fetch results");

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: "#ffe58f" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderField = (label, value) => {
    if (!value) return null;
    if (typeof value === "object") return null;
    return (
      <p className="field">
        <strong>{label}:</strong> {highlightText(value.toString())}
      </p>
    );
  };

  const handlePlaceClick = (id) => {
    navigate(`/place/${id}`);
    setOpen(false); // Close the bubble after navigation
  };

  return (
    <div
      className={`ai-bubble ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      {!open && <div className="bubble-icon">🔍</div>}

      {open && (
        <div className="bubble-container" onClick={(e) => e.stopPropagation()}>
          <div className="bubble-header">
            <span>AI Search</span>
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="bubble-body">
            {!isLoggedIn ? (
              <p className="status error">⚠️ Please log in to use search.</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search for a place..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </>
            )}

            {loading && <p className="status">Loading...</p>}
            {error && <p className="status error">{error}</p>}

            <div className="results">
              {results.length === 0 && !loading && isLoggedIn && (
                <p>No results found</p>
              )}

              {results.map((place) => {
                const isExpanded = expanded[place._id] || false;
                const fields = Object.entries(place).filter(
                  ([key, value]) =>
                    value &&
                    !["_id", "photos", "title", "modificationHistory"].includes(
                      key
                    )
                );
                const shortFields = fields.slice(0, 5);
                const extraFields = fields.slice(5);

                return (
                  <div
                    className="result-card"
                    key={place._id}
                    onClick={() => handlePlaceClick(place._id)}
                  >
                    {place.title && <h4>{highlightText(place.title)}</h4>}

                    {place.photos && place.photos.length > 0 && (
                      <div className="result-images">
                        {place.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`${place.title}-${i}`}
                            className="result-image"
                          />
                        ))}
                      </div>
                    )}

                    <div className="result-fields">
                      {shortFields.map(([key, value]) =>
                        renderField(
                          key.charAt(0).toUpperCase() + key.slice(1),
                          value
                        )
                      )}

                      {isExpanded &&
                        extraFields.map(([key, value]) =>
                          renderField(
                            key.charAt(0).toUpperCase() + key.slice(1),
                            value
                          )
                        )}

                      {extraFields.length > 0 && (
                        <button
                          className="toggle-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating
                            setExpanded((prev) => ({
                              ...prev,
                              [place._id]: !prev[place._id],
                            }));
                          }}
                        >
                          {isExpanded ? "Show less ▲" : "Show more ▼"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
