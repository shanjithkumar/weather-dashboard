// src/components/ForecastCard.js
import React from "react";

export default function ForecastCard({ data }) {
  // ✅ Handle no or bad data gracefully
  if (!data || data.length === 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm">No forecast data available.</p>
      </div>
    );
  }

  // ✅ Group forecast data by day
  const dailyForecasts = data.reduce((acc, item) => {
    if (!item || !item.dt || !item.main || !item.weather) return acc;
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // ✅ Compute daily averages and representative icons
  const days = Object.keys(dailyForecasts).map((date) => {
    const items = dailyForecasts[date].filter(
      (f) => f.main && typeof f.main.temp === "number"
    );

    if (items.length === 0) return null;

    const avgTemp =
      items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;

    const icon = items[0].weather?.[0]?.icon || "01d";
    const desc = items[0].weather?.[0]?.description || "N/A";

    return {
      date,
      avgTemp: avgTemp.toFixed(1),
      icon,
      desc,
    };
  });

  // ✅ Display forecast cards (filtered to only valid entries)
  return (
    <div className="mt-6">
      <h2 className="text-center text-xl font-semibold mb-4 text-gray-800">
        5-Day Forecast
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {days
          .filter(Boolean)
          .slice(0, 5)
          .map((day, idx) => (
            <div
              key={idx}
              className="bg-white/60 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 w-40 text-center border border-gray-200"
            >
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {day.date}
              </h3>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.desc}
                className="mx-auto w-14"
              />
              <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                {day.avgTemp}°C
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 capitalize mt-1">
                {day.desc}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
