import React, { useEffect } from "react";
import { useState } from "react";
import "./write.css";
import axios from "axios";
import Perks from "../Perks"
import PhotosUpLoader from "../PhotosUpLoader";
import { Navigate, useParams } from "react-router-dom";


export default function Write() {
  const cars = [
    {
      brand: "Legume",
      models: ["Morcovi", "Cartofi", "Rosi", "Varza", "Salata", "Vinete"]
    } ,
    {
      brand: "Fructe",
      models: ["Mere", "Pere", "Pepene", "Portocale"]
      },
      {
        brand: "Carne",
        models: ["Carnati", "Sunca"]
        },
        {
          brand: "Lactate",
          models: ["Branza", "Lapte", "Oua"]
          },
          {
            brand: "Bauturi",
            models: ["Vin", "acidulate", "neacidulate"]
            },
            {
              brand: "Miere",
              models: ["Tei", "Rapita"]
              },
              {
                brand: "CamaraEco",
                models: ["Branza", "Lapte", "Oua"]
                },
                {
                  brand: "Fainoase",
                  models: ["Paste", "Malai"]
                  },
                  {
                    brand: "Plescoi",
                    models: ["Sunca", "Carnati", ]
                    },
                    {
                      brand: "Vegan",
                      models: ["Branza", "Lapte"]
                      },
      
  // Add more car brands and models here...
]
  const {id} = useParams();
  console.log({id});
  const [title,setTitle] = useState("");
  const [nume,setNume] = useState("");
  const [mail,setMail] = useState("");
  const [telefon,setTelefon] = useState("");
  const [culoare,setCuloare] = useState("");
  const [tractiune,setTractiune] = useState("");
  const [transmisie,setTransmisie] = useState("");
  const [caroserie,setCaroserie] = useState("");
  const [combustibil,setCombustibil] = useState("");
  const [seriesasiu,setSeriesasiu] = useState("");
  const [putere,setPutere] = useState("");
  const [normaeuro,setNormaeuro] = useState("");
  const [cilindre,setCilindre] = useState("");
  const [km,setKm] = useState("");
  const [marca,setMarca] = useState("");
  const [model,setModel] = useState("");
  const [anul,setAnul] = useState("");
   const [addedPhotos, setAddedPhotos] = useState([]);
  const [description,setDescription] = useState("");
  const [perks,setPerks] = useState ([]);
  const [redirect,setRedirect] = useState("");
  useEffect(() => {
     if (!id) {
      return;
     }
     axios.get("/places/"+id).then(response => {
      const {data} = response;
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
      setDescription(data.description);
      setPerks(data.perks);
     });
  },[id]);

async function savePlace(ev) {
  ev.preventDefault();
  const placeData = {
    title ,marca ,model ,km ,anul 
    ,addedPhotos ,description ,perks,
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
    combustibil
  };
if (id) {
  //update
  await axios.put("/places", {
    id, ...placeData
     
  });
  setRedirect("/");
} else {
  //new place
  await axios.post("/places", placeData);
  setRedirect("/");
}
}

if (redirect) {
  return <Navigate to={redirect}/>
}

const generateModelOptions = () => {
  const selectedCar = cars.find(car => car.brand === marca);
  if (!selectedCar) {
    return <option  value="">Selecteaza model-ul</option>;
  }
  return (
    <>
      <option   value="">Selecteaza </option>
      {selectedCar.models.map(model => (
        <option key={model} value={model}>{model}</option>
      ))}
    </>
  );
};

  return (
    <React.Fragment>
    <div className="top"></div>
     
      <div className="write">
      <h2 style={{color:"var(--main)"}}>Adauga un produs</h2>
        <form onSubmit={savePlace} className="writeForm">
        
          <div className="writeFormGroup ">
           
          <h5>nume</h5>
          <input
              className="writeInput"
              placeholder="30000"
              type="text"
              autoFocus={true}
              value={title} onChange={ev => setTitle(ev.target.value)}
            />
             <h5>categorie</h5>
             <select
      className="writeInput"
      value={marca}
      onChange={ev => setMarca(ev.target.value)}
    >
      <option style={{color:"#000"}} value="">selecteaza</option>
      {cars.map(car => (
        <option key={car.brand} value={car.brand}>{car.brand}</option>
      ))}
    </select>
            <h5>subcategorie</h5>
            <select
      className="writeInput"
      value={model}
      onChange={ev => setModel(ev.target.value)}
    >
      {generateModelOptions()}
    </select>
            

             <h5>pret</h5>
             <input
              className="writeInput"
              placeholder="10000"
              type="text"
              value={km} onChange={ev => setKm(ev.target.value)}
            />
             
             <PhotosUpLoader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
             <br></br>
            <Perks selected={perks} onChange={setPerks}/>
          
          </div>
             
            
        

           
          <div className="writeFormGroup">

          <h4>Descriere</h4>
          <textarea
  className="writeInput writeText"
  placeholder="Detalii despre vehicul"
  type="text"
  value={description}
  onChange={ev => setDescription(ev.target.value)}
  onKeyDown={ev => {
    if (ev.keyCode === 13) {
      // The Enter key was pressed, handle the new line here
      console.log('New line detected!');
    }
  }}
/>

          </div>
          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </form>
      </div>
      
    </React.Fragment>
  );
}
