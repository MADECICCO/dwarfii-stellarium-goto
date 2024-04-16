import React, { useState, useEffect } from "react";
import WeatherInfo from "./weather/WeatherInfo";
import WeatherForecast from "./weather/WeatherForecast";
import axios from "axios";

interface WeatherData {
  ready: boolean;
  coordinates?: { lat: number; lon: number };
  city?: string;
  date?: Date;
  temperature?: number;
  temp_min?: number;
  temp_max?: number;
  feels_like?: number;
  humidity?: number;
  wind?: number;
  description?: string;
  icon?: string;
}

function Weather() {
  const [cityInput, setCityInput] = useState(
    typeof window !== "undefined" ? localStorage.getItem("city") || "" : ""
  );
  const [apiKey, setApiKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("apiKey") || "" : ""
  );
  const [weatherData, setWeatherData] = useState<WeatherData>({ ready: false });

  useEffect(() => {
    if (apiKey && cityInput) {
      search();
    }
  }, [apiKey, cityInput]);

  function handleResponse(response) {
    setWeatherData({
      ready: true,
      coordinates: response.data.city.coord,
      city: response.data.city.name,
      date: new Date(response.data.list[0].dt * 1000),
      temperature: response.data.list[0].main.temp,
      temp_min: response.data.list[0].main.temp_min,
      temp_max: response.data.list[0].main.temp_max,
      feels_like: response.data.list[0].main.feels_like,
      humidity: response.data.list[0].main.humidity,
      wind: response.data.list[0].wind.speed,
      description: response.data.list[0].weather[0].description,
      icon: response.data.list[0].weather[0].icon,
    });
    localStorage.setItem("city", response.data.city.name);
  }

  function search() {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then(handleResponse)
      .catch((error) => {
        console.error("Weather data fetch error:", error);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function handleCityInput(event) {
    setCityInput(event.target.value);
  }

  function handleApiKeyChange(event) {
    setApiKey(event.target.value);
  }

  function handleSaveApiKey(event) {
    event.preventDefault();
    localStorage.setItem("apiKey", apiKey);
  }

  return (
    <div className="Weather">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-3">
            <input
              type="search"
              value={cityInput}
              placeholder="Enter a city..."
              className="form-control-weather"
              autoFocus={true}
              onChange={handleCityInput}
            />
          </div>
          <div className="col-search">
            <input
              type="submit"
              value="Search"
              className="btn btn-more02 w-100"
            />
          </div>
          <div className="col-3">
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter API-key"
              className="form-control-weather"
            />
          </div>
          <div className="col-api">
            <button
              type="submit"
              onClick={handleSaveApiKey}
              className="btn btn-more02 w-100"
            >
              Save API Key
            </button>
          </div>
        </div>
      </form>
      {weatherData.ready ? (
        <>
          <WeatherInfo infoData={weatherData} />
          <WeatherForecast
            coordinates={weatherData.coordinates || { lat: 0, lon: 0 }}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Weather;
