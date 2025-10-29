// src/components/WeatherApp.js
import React, { useState } from "react";
import WeatherCard from "./WeatherCard";
import ForecastCard from "./ForecastCard";
import AQICard from "./AQICard";
import WeatherChart from "./WeatherChart";
import RecentSearches from "./RecentSearches";
import SearchBar from "./SearchBar";

const API_KEY = "29e5be8b8331fb31c42e381720730f0b";
const API_BASE = "http://localhost/weather-dashboard-api";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- Fetch by city name ----
  const fetchWeather = async (cityName = city) => {
    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "City not found");

      setWeather(data);
      const { lat, lon } = data.coord;
      fetchExtras(lat, lon);

      fetch(`${API_BASE}/add_search.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityName }),
      }).catch((err) => console.warn("Search log failed:", err));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Fetch forecast + AQI ----
  const fetchExtras = async (lat, lon) => {
    try {
      const [forecastRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ),
      ]);

      const forecastData = await forecastRes.json();
      const aqiData = await aqiRes.json();

      if (forecastData?.list?.length) setForecast(forecastData.list.slice(0, 40));
      else setForecast([]);

      setAqi(aqiData?.list?.[0] || null);
    } catch (error) {
      console.error("Forecast/AQI fetch failed:", error);
      setForecast([]);
    }
  };

  // ---- Fetch current location weather ----
  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const geoData = await geoRes.json();
          const detectedCity = geoData?.[0]?.name || "Your Location";

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          setWeather(data);
          setCity(detectedCity);
          fetchExtras(latitude, longitude);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch current location weather.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("Location access denied. Please enable GPS.");
      }
    );
  };

  // ---- Dynamic background based on weather ----
  const getWeatherBg = () => {
    if (!weather) return "from-blue-200 via-blue-300 to-blue-400";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clear")) return "from-yellow-300 via-orange-400 to-red-400";
    if (condition.includes("cloud")) return "from-gray-300 via-gray-400 to-gray-500";
    if (condition.includes("rain")) return "from-blue-500 via-blue-600 to-gray-700";
    if (condition.includes("thunder")) return "from-gray-700 via-blue-800 to-black";
    if (condition.includes("snow")) return "from-blue-100 via-white to-blue-200";
    if (condition.includes("mist") || condition.includes("fog"))
      return "from-gray-200 via-gray-300 to-gray-400";

    return "from-blue-200 via-blue-300 to-blue-400";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-700 bg-gradient-to-br ${getWeatherBg()}`}
    >
      <div className="max-w-3xl w-full mx-auto mt-10 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🌍 Smart Weather Dashboard
        </h2>

        {/* 🔍 SearchBar + Current Location */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
          <div className="w-full sm:w-3/4">
            <SearchBar city={city} setCity={setCity} onSearch={() => fetchWeather(city)} />
          </div>
          <button
            onClick={fetchByLocation}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition w-full sm:w-auto"
          >
            📍 Current Location
          </button>
        </div>

        {/* ⚠️ Error / Loading */}
        {error && (
          <div className="text-red-600 text-center font-medium mb-4">{error}</div>
        )}
        {loading && (
          <div className="text-gray-600 text-center font-medium mb-4 animate-pulse">
            Fetching weather data...
          </div>
        )}

        {/* 🌦️ Weather Display */}
        {weather ? (
          <>
            <WeatherCard data={weather} />
            {aqi && <AQICard data={aqi} />}
            {forecast.length > 0 && <ForecastCard data={forecast} />}
            {forecast.length > 0 && <WeatherChart forecast={forecast} />}
            <RecentSearches onSelect={fetchWeather} />
          </>
        ) : (
          <div className="text-center text-gray-600 mt-6">
            <p>🌤️ Enter a city name or use your current location to see the weather.</p>
          </div>
        )}
      </div>
    </div>
  );
}
