import axios from "axios";
import { useState } from "react";
import "./PhotosUploader.css";
import Image from "./image";

export default function PhotosUpLoader({addedPhotos,onChange}) {
  const [isLoading, setIsLoading] = useState(false);

  function uploadPhoto(ev) {
    const files = ev.target.files;
    setIsLoading(true);
  
    for (let i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append("photo", files[i]);
      axios.post("/upload", data, {
        headers: {"Content-type": "multipart/form-data"}
      }).then(response => {
        const {data:filename} = response;
        onChange(prev => {
          return[...prev, filename];
        });
        setIsLoading(false);
      }).catch(error => {
        console.error(error);
        setIsLoading(false);
      });
    }
  }
  

  function removePhoto(ev,filename) {
    ev.preventDefault();
    onChange([...addedPhotos.filter(photo => photo !== filename)]);
  }

  function selectAsMainPhoto(ev,filename) {
    ev.preventDefault();
    const addedPhotosWithoutSelected = addedPhotos
    .filter(photo => photo !== filename);
    const newAddedPhotos =[filename,...addedPhotosWithoutSelected];
    onChange(newAddedPhotos);
  }

  return (
  <div className="photos-uploader">
    <label className="upload-label">
      <input type="file" multiple onChange={uploadPhoto} />
      <span className="upload-text">Upload Photos</span>
    </label>

    {isLoading && <div className="loading">Se încarcă...</div>}

    <div className="photos-grid">
      {addedPhotos.map(link => (
        <div className="photo-card" key={link}>
          <Image className="photo-img" src={link} />
          <div className="photo-actions">
            <button onClick={ev => removePhoto(ev, link)} className="action-button delete-button" title="Șterge">
              🗑️
            </button>
            <button onClick={ev => selectAsMainPhoto(ev, link)} className="action-button main-button" title="Setează ca principală">
              {link === addedPhotos[0] ? '⭐' : '☆'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
