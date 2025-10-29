// src/components/AQICard.js
import React from "react";

export default function AQICard({ data }) {
  const getLevel = (aqi) => {
    switch (aqi) {
      case 1:
        return { label: "Good", color: "green" };
      case 2:
        return { label: "Fair", color: "lightgreen" };
      case 3:
        return { label: "Moderate", color: "orange" };
      case 4:
        return { label: "Poor", color: "red" };
      case 5:
        return { label: "Very Poor", color: "darkred" };
      default:
        return { label: "Unknown", color: "gray" };
    }
  };

  const { label, color } = getLevel(data.main.aqi);

  return (
    <div className="card mt-3 p-3 shadow-sm">
      <h5 className="text-center">🌫️ Air Quality Index</h5>
      <div className="text-center mt-2">
        <strong style={{ color }}>{label}</strong>
      </div>
    </div>
  );
}
