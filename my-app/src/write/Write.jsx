import React, { useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import Perks from "../Perks";
import PhotosUpLoader from "../PhotosUpLoader";
import { Navigate, useParams } from "react-router-dom";

export default function Write() {
  const cars = [
    {
      brand: "Sector 6",
      models: [
        "Morcovi",
        "Cartofi",
        "Rosi",
        "Varza",
        "Dovleac",
        "Salata",
        "Vinete",
        "Ghimbir",
        "Ceapa",
        "Usturoi",
        "Ciuperci",
        "Pastarnac",
        "Telina",
        "Loboda",
        "Ardei Gras",
        "Castravete",
        "Mazare",
        "Stevie",
        "Ridiche",
        "Ardei Iute",
      ],
    },
    { brand: "Sector 5", models: ["Mere", "Pere", "Pepene", "Portocale", "Capsuni", "Alune", "Cirese", "Grepfrut", "Clementine", "Lime", "Lamaie", "Caise", "Nectarine"] },
    { brand: "Sector 4", models: ["Carnati", "Sunca"] },
    { brand: "Sector 3", models: ["Branza", "Lapte", "Oua"] },
    { brand: "Sector 2", models: ["Vin", "Acidulate", "Neacidulate"] },
    { brand: "Sector 1", models: ["Tei", "Rapita"] },
    { brand: "Personal Ro", models: ["r", "of"] },
    { brand: "Personal Non UE", models: ["Tei", "Rapita"] },
  ];

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [nume, setNume] = useState("");
  const [mail, setMail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [culoare, setCuloare] = useState("");
  const [tractiune, setTractiune] = useState("");
  const [transmisie, setTransmisie] = useState("");
  const [caroserie, setCaroserie] = useState("");
  const [combustibil, setCombustibil] = useState("");
  const [seriesasiu, setSeriesasiu] = useState("");
  const [putere, setPutere] = useState("");
  const [normaeuro, setNormaeuro] = useState("");
  const [cilindre, setCilindre] = useState("");
  const [km, setKm] = useState("");
  const [marca, setMarca] = useState("");
  const [model, setModel] = useState("");
  const [anul, setAnul] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [modificationText, setModificationText] = useState("");
  const [perks, setPerks] = useState([]);
  const [redirect, setRedirect] = useState("");

  // New state to toggle the collapsible modification history
  const [showModifications, setShowModifications] = useState(false);

  // Helper to pretty-print values (remove quotes around strings)
  function prettyPrint(value) {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  }

  // Format modification history cleanly as plain text (for internal use)
  function formatModifications(modHistory) {
    if (!modHistory || modHistory.length === 0) return "";
    let text = "\n\n=== Istoricul modificarilor ===\n";
    modHistory.forEach((entry, i) => {
      const userName =
        entry.user?.username ||
        entry.user?.email ||
        (typeof entry.user === "string" ? entry.user : "Utilizator necunoscut");
      const date = new Date(entry.timestamp).toLocaleString();

      text += `\n[${i + 1}] ${userName} a modificat câmpul "${entry.field}":\n`;
      text += `   Veche valoare:\n     ${prettyPrint(entry.oldValue).replace(/\n/g, "\n     ")}\n`;
      text += `   Noua valoare:\n     ${prettyPrint(entry.newValue).replace(/\n/g, "\n     ")}\n`;
      text += `   La data: ${date}\n`;
    });
    return text;
  }

  // Format modifications for display with colored old/new values and separate containers
  function formatModificationsForDisplay(text) {
    if (!text) return null;

    // Split entries by pattern "\n\n[1]", "\n\n[2]", ...
    const entries = text.split(/\n\n\[\d+\]/).filter(Boolean);

    return entries.map((entry, i) => {
      // Extract user, field, oldValue, newValue, date with regex
      const userMatch = entry.match(/^\s*(.+?) a modificat câmpul "(.+?)":/m);
      const oldValMatch = entry.match(/Veche valoare:\n\s*([\s\S]*?)\n\s*Noua valoare:/m);
      const newValMatch = entry.match(/Noua valoare:\n\s*([\s\S]*?)\n\s*La data:/m);
      const dateMatch = entry.match(/La data:\s*(.+)/m);

      if (!userMatch) return <pre key={i}>{entry}</pre>;

      const user = userMatch[1].trim();
      const field = userMatch[2].trim();
      const oldValue = oldValMatch ? oldValMatch[1].trim() : "-";
      const newValue = newValMatch ? newValMatch[1].trim() : "-";
      const date = dateMatch ? dateMatch[1].trim() : "-";

      return (
        <div key={i} className="mod-entry">
          <strong>
            [{i + 1}] {user}
          </strong>{" "}
          a modificat câmpul <em>"{field}"</em>:
          <div className="old-value-box">
            <strong>Veche valoare:</strong>
            <pre>{oldValue}</pre>
          </div>
          <div className="new-value-box">
            <strong>Noua valoare:</strong>
            <pre>{newValue}</pre>
          </div>
          <div className="mod-date">
            <small>La data: {date}</small>
          </div>
        </div>
      );
    });
  }

  useEffect(() => {
    if (!id) return;
    axios.get("/places/" + id).then((response) => {
      const data = response.data;
      setCuloare(data.culoare);
      setNume(data.nume);
      setMail(data.mail);
      setTelefon(data.telefon);
      setTractiune(data.tractiune);
      setTransmisie(data.transmisie);
      setCaroserie(data.caroserie);
      setCombustibil(data.combustibil);
      setSeriesasiu(data.seriesasiu);
      setPutere(data.putere);
      setNormaeuro(data.normaeuro);
      setCilindre(data.cilindre);
      setTitle(data.title);
      setMarca(data.marca);
      setModel(data.model);
      setAddedPhotos(data.photos);
      setAnul(data.anul);
      setKm(data.km);
      setDescription(data.description || "");
      setPerks(data.perks || []);

      // Append formatted modifications text (plain text)
      setModificationText(formatModifications(data.modificationHistory));
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();

    // Save only the original description (without modifications appended)
    const cleanDescription = description;

    const placeData = {
      title,
      marca,
      model,
      km,
      anul,
      addedPhotos,
      description: cleanDescription,
      perks,
      culoare,
      cilindre,
      nume,
      mail,
      telefon,
      tractiune,
      transmisie,
      seriesasiu,
      caroserie,
      putere,
      normaeuro,
      combustibil,
    };
    if (id) {
      await axios.put("/places", { id, ...placeData });
      setRedirect("/userpage");
    } else {
      await axios.post("/places", placeData);
      setRedirect("/userpage");
    }
  }

  if (redirect) return <Navigate to={redirect} />;

  const generateModelOptions = () => {
    const selectedCar = cars.find((car) => car.brand === marca);
    if (!selectedCar) return <option value="">Selecteaza</option>;
    return (
      <>
        <option value="">Selecteaza</option>
        {selectedCar.models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="top"></div>

      <div className="write">
        <h2 style={{ color: "var(--main)" }}>Adauga o cazare</h2>
        <form onSubmit={savePlace} className="writeForm">
          <div className="writeFormGroup ">
            <h5>Addresa</h5>
            <input
              className="writeInput"
              placeholder="ex: Sector 1 Bd. Iuliu Maniu nr 1"
              type="text"
              autoFocus={true}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <h5>Sector</h5>
            <select className="writeInput" value={marca} onChange={(ev) => setMarca(ev.target.value)}>
              <option style={{ color: "#000" }} value="">
                selecteaza
              </option>
              {cars.map((car) => (
                <option key={car.brand} value={car.brand}>
                  {car.brand}
                </option>
              ))}
            </select>

            <PhotosUpLoader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            <br />
          </div>

          <div className="writeFormGroup">
            <h4>Descriere</h4>
            <textarea
              className="writeInput writeText"
              placeholder="Detalii despre produs"
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            {/* Collapsible modification history */}
            <div className="istoric-modificari">
              {modificationText && (
                <div className="modification-history-container">
                  <button
                    type="button"
                    className="toggle-modifications-btn"
                    onClick={() => setShowModifications((prev) => !prev)}
                  >
                    {showModifications
                      ? "Ascunde istoricul modificarilor ▲"
                      : "Arată istoricul modificarilor ▼"}
                  </button>
                  {showModifications && (
                    <div className="modification-history">{formatModificationsForDisplay(modificationText)}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
