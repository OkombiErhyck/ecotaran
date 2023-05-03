import "./carfilter.css";
import React, { useState } from "react";

const CarFilter = () => {
  const [brand, setBrand] = useState("Toyota");
  const [model, setModel] = useState("Corolla");
  const [yearFrom, setYearFrom] = useState("2015");
  const [yearTo, setYearTo] = useState("2022");
  const [fuel, setFuel] = useState("gasoline");
  const [type, setType] = useState("sedan");
  const [km, setKm] = useState("");

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleYearFromChange = (event) => {
    setYearFrom(event.target.value);
  };

  const handleYearToChange = (event) => {
    setYearTo(event.target.value);
  };

  const handleFuelChange = (event) => {
    setFuel(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleKmChange = (event) => {
    setKm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle filter submission
  };

  return (
    <form className="filter" onSubmit={handleSubmit}>
      <label className="label">
        Brand:
        <select value={type} onChange={handleTypeChange}>
          <option value="BMW">BMW</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Audi">Audi</option>
          <option value="Volvo">Volvo</option>
        </select>
      </label>
      <label className="label">
        Model:
        <select value={type} onChange={handleTypeChange}>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="suv">SUV</option>
          <option value="pickup">Pickup</option>
        </select>
      </label>
     
      <label className="label">
        Fuel:
        <select value={type} onChange={handleTypeChange}>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="suv">SUV</option>
          <option value="pickup">Pickup</option>
        </select>
      </label>
      <label className="label">
        Type:
        <select value={type} onChange={handleTypeChange}>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="suv">SUV</option>
          <option value="pickup">Pickup</option>
        </select>
      </label>
      <label className="label">
        Kilometers:
        <select value={type} onChange={handleTypeChange}>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="suv">SUV</option>
          <option value="pickup">Pickup</option>
        </select>
      </label>
      <button type="submit">Filter</button>
    </form>
  );
};

export default CarFilter;
