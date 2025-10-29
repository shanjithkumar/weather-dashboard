// src/components/WeatherChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function WeatherChart({ forecast }) {
  // ✅ 1. Validate forecast data
  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>No forecast data available to display the chart.</p>
      </div>
    );
  }

  // ✅ 2. Extract labels and temperature safely
  const labels = forecast
    .filter((item) => item && item.dt)
    .map((item) => {
      const date = new Date(item.dt * 1000);
      return `${date.getDate()}/${date.getMonth() + 1} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:00`;
    });

  const temps = forecast
    .filter((item) => item && item.main && item.main.temp !== undefined)
    .map((item) => item.main.temp);

  // ✅ 3. Chart data setup
  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  // ✅ 4. Chart options for better UX
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Temperature Trend (Next 5 Days)" },
    },
    scales: {
      x: { ticks: { maxRotation: 90, minRotation: 45 } },
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title text-center">Temperature Trend</h5>
        <Line data={data} options={options} />
      </div>
      
    </div>
  );
}
