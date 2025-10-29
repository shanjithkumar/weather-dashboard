import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost/weather-dashboard-api";

export default function RecentSearches({ onSelect }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/get_recent.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRecent(data.recent);
      })
      .catch((err) => console.error("Error fetching recent searches:", err));
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="card p-3 mt-3">
      <h6>🕓 Recent Searches</h6>
      <div className="d-flex flex-wrap gap-2">
        {recent.map((city, index) => (
          <button
            key={index}
            className="btn btn-outline-primary btn-sm"
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
