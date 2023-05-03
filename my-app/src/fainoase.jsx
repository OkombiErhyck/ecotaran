import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndexPage.css";
import { Link } from "react-router-dom";
import Image from "./image";

function Bauturi() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 9;

  useEffect(() => {
    axios.get("/places").then((response) => {
      const filteredPlaces = response.data.filter(
        (place) => place.marca === "Fainoase"
      );
      setPlaces(filteredPlaces);
    });
  }, []);

  const lastPlaceIndex = currentPage * placesPerPage;
  const firstPlaceIndex = lastPlaceIndex - placesPerPage;
  const currentPlaces = places.slice(firstPlaceIndex, lastPlaceIndex);
  const totalPages = Math.ceil(places.length / placesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="top"></div>
      <div className="main2">
        <div className="container">
          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentPlaces.length > 0 &&
                currentPlaces
                  .filter((place) => place.marca === "Fainoase")
                  .map((place) => (
                    <Link
                      to={"/place/" + place._id}
                      key={place._id}
                      className="link-no-underline"
                    >
                      <div className="col">
                        <div className="box card-body p-0  shadow-sm mb-5">
                          {place.photos.length > 0 && (
                            <Image
                              src={place.photos[0]}
                              className="img-fluid"
                              style={{
                                height: "270px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <div className="box_content">
                            <h4>{place.title}</h4>
                            <div className="row pl-2 pr-2">
                              <div>{place.putere}</div>
                              <button
                                style={{
                                  background: "#cccccc00",
                                  color: "var(--main)",
                                }}
                                className="btn1"
                              >
                                Detalii
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bauturi;
