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
                        onClick={() => setEditingField(null)}
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
    {selectedPlace.nume
      ? selectedPlace.nume.split(/\r?\n/).map((line, idx) => (
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
            {editingField === `nume-${idx}` ? (
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
                  onClick={() => saveField("nume", idx)}
                  style={{
                    background: "var(--main)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
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
                    borderRadius: "6px",
                    padding: "4px 8px",
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
                    setEditingField(`nume-${idx}`);
                    setFieldValue(line);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                  }}
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

    {editingField === "nume-new" && (
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
          onClick={() => saveField("nume", "new")}
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
