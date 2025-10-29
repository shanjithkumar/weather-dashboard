// src/components/SearchBar.js
import React, { useState } from "react";

const API_KEY = "29e5be8b8331fb31c42e381720730f0b";

export default function SearchBar({ city, setCity, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const val = e.target.value;
    setCity(val);

    if (val.length > 2) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (city.trim() === "") return;
    setSuggestions([]); // ✅ Hide suggestions
    onSearch();
  };

  const selectCity = (name) => {
    setCity(name);
    setSuggestions([]);
    onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <input
          type="text"
          value={city}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter city or region..."
          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition"
        >
          🔍
        </button>
      </div>

      {/* 🔽 Auto-suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white shadow-lg border border-gray-200 mt-1 rounded-lg z-10 max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => selectCity(s.name)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {s.name}, {s.state ? `${s.state}, ` : ""}{s.country}
            </li>
          ))}
        </ul>
      )}

      {/* Optional: small loader */}
      {loading && (
        <div className="absolute right-3 top-2 text-sm text-gray-500">
          ⏳
        </div>
      )}
    </div>
  );
}
