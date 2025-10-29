// src/components/WeatherCard.js
import React from "react";

export default function WeatherCard({ data }) {
  if (!data || !data.main || !data.weather) return null;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 mt-6 text-center transition-all duration-300 hover:shadow-2xl">
      {/* City Name */}
      <h3 className="text-2xl font-semibold text-gray-800">{data.name}</h3>
      <p className="text-lg text-gray-600 capitalize">{data.weather[0].description}</p>

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="weather icon"
        className="mx-auto w-20 h-20"
      />

      {/* Temperature */}
      <h2 className="text-4xl font-bold text-gray-900 mt-2">
        {Math.round(data.main.temp)}°C
      </h2>
      <p className="text-gray-500">Feels like {Math.round(data.main.feels_like)}°C</p>

      {/* Wind Info */}
      <div className="flex justify-around text-gray-700 mt-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl">💨</span>
          <span className="text-sm">{data.wind.speed} m/s</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">🧭</span>
          <span className="text-sm">{data.wind.deg}°</span>
        </div>
      </div>

      {/* Sunrise / Sunset */}
      <div className="mt-5 text-sm text-gray-600">
        <div>🌅 <span className="font-medium">Sunrise:</span> {sunrise}</div>
        <div>🌇 <span className="font-medium">Sunset:</span> {sunset}</div>
      </div>
    </div>
  );
}
