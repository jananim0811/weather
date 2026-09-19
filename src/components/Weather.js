import React, { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      // First API: Find latitude and longitude of the city
      const locationResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city.trim()
        )}&count=1&language=en&format=json`
      );

      if (
        !locationResponse.data.results ||
        locationResponse.data.results.length === 0
      ) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const location = locationResponse.data.results[0];

      const latitude = location.latitude;
      const longitude = location.longitude;

      // Second API: Get weather using latitude and longitude
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
      );

      const current = weatherResponse.data.current;

      setWeather({
        city: location.name,
        country: location.country,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Unable to get weather data");
      setWeather(null);
      setLoading(false);
    }
  };

  const getWeatherDescription = (code) => {
    if (code === 0) {
      return "Clear sky";
    }

    if (code === 1 || code === 2 || code === 3) {
      return "Partly cloudy";
    }

    if (code === 45 || code === 48) {
      return "Fog";
    }

    if (
      code === 51 ||
      code === 53 ||
      code === 55 ||
      code === 56 ||
      code === 57
    ) {
      return "Drizzle";
    }

    if (
      code === 61 ||
      code === 63 ||
      code === 65 ||
      code === 66 ||
      code === 67
    ) {
      return "Rain";
    }

    if (
      code === 71 ||
      code === 73 ||
      code === 75 ||
      code === 77
    ) {
      return "Snow";
    }

    if (
      code === 80 ||
      code === 81 ||
      code === 82
    ) {
      return "Rain showers";
    }

    if (code === 85 || code === 86) {
      return "Snow showers";
    }

    if (code === 95) {
      return "Thunderstorm";
    }

    if (code === 96 || code === 99) {
      return "Thunderstorm with hail";
    }

    return "Unknown weather";
  };

  return (
    <div className="weather-container">
      <h1>Weather Report</h1>

      <p>I can give you a weather report about your city !</p>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            getWeather();
          }
        }}
      />

      <br />

      <button onClick={getWeather}>
        Get Report
      </button>

      {loading && (
        <p className="loading">
          Getting weather data...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {weather && (
        <div className="weather-result">
          <p>
            <b>City:</b> {weather.city}, {weather.country}
          </p>

          <p>
            <b>Weather:</b>{" "}
            {getWeatherDescription(weather.weatherCode)}
          </p>

          <p>
            <b>Temperature:</b>{" "}
            {weather.temperature} °C
          </p>

          <p>
            <b>Description:</b>{" "}
            {getWeatherDescription(weather.weatherCode)}
          </p>

        
        </div>
      )}
    </div>
  );
}

export default Weather;