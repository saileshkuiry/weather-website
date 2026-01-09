import React, { useState, useEffect } from "react";
import "./Weather.css";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isDayMode, setIsDayMode] = useState(true); // day/night toggle
  const defaultCity = "Delhi,IN";

  const searchCity = async (cityName) => {
    if (!cityName) return;
    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEYS}&q=${cityName}&aqi=no`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      setWeatherData(data);

      // Auto toggle day/night based on API is_day value
      if (data.current?.is_day !== undefined) {
        setIsDayMode(data.current.is_day === 1);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    searchCity(defaultCity);
  }, []);

  return (
    <div className={`app ${isDayMode ? "day" : "night"}`}>
      <div className="weather-card">
        <h1 className="title">Today's Weather</h1>

        {/* Day/Night Toggle */}
        <button
          className="toggle-mode"
          onClick={() => setIsDayMode(!isDayMode)}
        >
          Switch to {isDayMode ? "Night" : "Day"}
        </button>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => searchCity(`${city},IN`)}>Search</button>
        </div>

        {/* Weather Info */}
        {weatherData ? (
          <div className="weather-info">
            <div className="icon">
              <img
                src={`https:${weatherData.current?.condition?.icon}`}
                alt={weatherData.current?.condition?.text}
              />
            </div>
            <h2 className="temp">{weatherData.current?.temp_c}°C</h2>
            <p className="desc">{weatherData.current?.condition?.text}</p>
            <p className="location">
              {weatherData.location?.name}, {weatherData.location?.country}
            </p>

            {/* Extra Info Cards */}
            <div className="details">
              <div>
                <span>💧</span>
                <p>Humidity</p>
                <strong>{weatherData.current?.humidity}%</strong>
              </div>
              <div>
                <span>🌬</span>
                <p>Wind</p>
                <strong>{weatherData.current?.wind_kph} km/h</strong>
              </div>
              <div>
                <span>🌡</span>
                <p>Feels Like</p>
                <strong>{weatherData.current?.feelslike_c}°C</strong>
              </div>
              <div>
                <span>☁️</span>
                <p>Clouds</p>
                <strong>{weatherData.current?.cloud}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}
