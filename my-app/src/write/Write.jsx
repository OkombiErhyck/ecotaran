import React, { useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import Perks from "../Perks";
import PhotosUpLoader from "../PhotosUpLoader";
import { Navigate, useParams } from "react-router-dom";

export default function Write() {
  const cars = [
    
     
    { brand: "Cazare", models: ["Tei", "Rapita"] },
    { brand: "Personal Ro", models: ["r", "of"] },
    { brand: "Personal Non UE", models: ["Tei", "Rapita"] },
     { brand: "Automobile", models: ["mas", "ina"] },
     { brand: "Companie", models: ["ms", "ia"] },
  ];

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState([]);
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
  const [showModifications, setShowModifications] = useState(false);

  // Helper: pretty print values
  function prettyPrint(value) {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  }

  // Diff highlighting helper — simple word diff
  function diffHighlight(oldStr, newStr) {
    // Split by words (space/newline), keep separators
    const oldWords = oldStr.split(/(\s+)/);
    const newWords = newStr.split(/(\s+)/);

    // We'll do a very simple diff: highlight words that are in old but not in new as removed
    // and words that are in new but not in old as added.
    // For a more robust diff, consider importing 'diff' package, but here is a simple approach.

    // Create sets for quick lookup
    const oldSet = new Set(oldWords.filter(w => w.trim() !== ""));
    const newSet = new Set(newWords.filter(w => w.trim() !== ""));

    // Render old with removals highlighted if missing in new
    const oldRendered = oldWords.map((word, idx) => {
      if (word.trim() === "") return word; // keep spaces as is
      if (!newSet.has(word)) {
        return (
          <span key={"old_" + idx} className="diff-removed">
            {word}
          </span>
        );
      }
      return word;
    });

    
    // Render new with additions highlighted if missing in old
    const newRendered = newWords.map((word, idx) => {
      if (word.trim() === "") return word;
      if (!oldSet.has(word)) {
        return (
          <span key={"new_" + idx} className="diff-added">
            {word}
          </span>
        );
      }
      return word;
    });

    return { oldRendered, newRendered };
  }


  // Set default description based on marca if no id is provided
  // This is useful for new entries where marca is selected but no id exists yet
 

useEffect(() => {
  if (!id && marca && defaultDescriptions[marca]) {
    setDescription(defaultDescriptions[marca]);
  }
}, [marca, id]);

useEffect(() => {
  if (marca && defaultNumeTexts[marca] !== undefined) {
    setNume(defaultNumeTexts[marca]);
  }
  // Don't overwrite if no default is found
}, [marca]);



  // Format modification history plain text, filter out "owner"
  function formatModifications(modHistory) {
    if (!modHistory || modHistory.length === 0) return "";
    let text = "\n\n=== Istoricul modificarilor ===\n";

    const filteredHistory = modHistory.filter((entry) => entry.field !== "owner");

    filteredHistory.forEach((entry, i) => {
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

  // Format modification history for display with exact change highlighting for description field only
  function formatModificationsForDisplay(text) {
    if (!text) return null;

    const entries = text.split(/\n\n\[\d+\]/).filter(Boolean);

    return entries.map((entry, i) => {
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

      // If field is description, highlight exact changes inside
      if (field === "description") {
        const { oldRendered, newRendered } = diffHighlight(oldValue, newValue);

        return (
          <div key={i} className="mod-entry">
            <strong>
              [{i + 1}] {user}
            </strong>{" "}
            a modificat câmpul <em>"{field}"</em>:
            <div className="old-value-box">
              <strong>Veche valoare:</strong>
              <pre>{oldRendered}</pre>
            </div>
            <div className="new-value-box">
              <strong>Noua valoare:</strong>
              <pre>{newRendered}</pre>
            </div>
            <div className="mod-date">
              <small>La data: {date}</small>
            </div>
          </div>
        );
      }

      // Default display without diff for other fields
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
      setDocuments(data.documents || []);
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
      setModificationText(formatModifications(data.modificationHistory));
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();

    const cleanDescription = description;

    const placeData = {
      title,
      documents,
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

  async function uploadDocument(ev) {
  const file = ev.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("document", file);

  try {
    const { data } = await axios.post("/upload-doc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // data = { url: "...", originalName: "..." } from your backend
    setDocuments((prev) => [...prev, { url: data.url, originalName: data.originalName }]);
  } catch (e) {
    alert("Failed to upload document");
  }
}

async function deleteDocument(docUrl) {
  // extrage numele fișierului din URL
  const filename = docUrl.split('/').pop();

  try {
    await axios.delete('/upload-doc', { data: { filename } });
    // elimină din lista documents
    setDocuments((prev) => prev.filter((doc) => doc !== docUrl));
  } catch (e) {
    alert('Failed to delete document');
  }
}

const defaultDescriptions = {
  
  "Cazare": `Chiriasi :
Numar locatari :
Proprietar : 
Utilitati: 
Administratie:
Program Administratie:
Data afisare intretinere:
Intretinere:
Cont Bancar Administratie:`,

  "Personal Ro": `Angajator :  
Contract de munca : 
Ore de lucru: 
Zile de lucru :
Leasing: 
Locuinta : 
Data incepere CIM :
Salariu: 
Telefon : `,

  "Personal Non UE": `Angajator : 
Responsabil :  
Contract de munca : 
Ore de lucru: 
Zile de lucru :
Leasing: 
Locuinta : 
Data incepere CIM : 
Salariu: `,

  "Automobile": `Marca: 
Numar Inmatriculare: 
Data expirare RCA:  
Data expirare ITP:  
Data expirare Rovinieta:  
Data ultima revizie : `,

  "Companie": `Adresa: 
Persoana de contact :  
Telefon :  
Tip contract : 
Responsabil :  `,
};

const defaultNumeTexts = {
  "Cazare": `Data darii in utilizare:
Data ultimei verificari:
Conditiile in care a fost gasita cazarea:
Ce a fost reparat-data:
Ce a fost cumparat-data:`
  ,
  "Personal Ro": `Nume predefinit pentru Personal Ro`,
  "Personal Non UE": `Nume predefinit pentru Personal Non UE`,
  "Automobile": `Nume predefinit pentru Automobile`,
  "Companie": `Nume predefinit pentru Companie`,
};


  return (
    <>
      <div className="top"></div>

      <div className="write">
        <h2 style={{ color: "var(--main)" }}>Adauga  </h2>
        <form onSubmit={savePlace} className="writeForm">
          <div className="writeFormGroup ">
            <h5>Titlu</h5>
            <input
              className="writeInput"
              placeholder="ex: Nume/Adresa/Marca/Firma"
              type="text"
              autoFocus={true}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <h5>Categorie</h5>
            <select
              className="writeInput"
              value={marca}
              onChange={(ev) => setMarca(ev.target.value)}
            >
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
            <div className="writeFormGroup">
  <h5>Document Upload</h5>
  <input type="file" onChange={uploadDocument} />
  
  <ul>
  {documents.map((doc, idx) => (
    <li key={idx}>
      <a href={doc.url} target="_blank" rel="noopener noreferrer">
        {doc.originalName || doc.url.split("/").pop()}
      </a>
    </li>
  ))}
</ul>

</div>

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

<div className="writeFormGroup">
  <h5>Amanunte</h5>
  <textarea
    className="writeInput writeText"
    placeholder="Introduceți numele"
    type="text"
    value={nume}
    onChange={ev => setNume(ev.target.value)}
  />
</div>

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
                    <div
                      className="modification-history"
                      style={{ overflow: "visible", maxHeight: "none" }}
                    >
                      {formatModificationsForDisplay(modificationText)}
                    </div>
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
