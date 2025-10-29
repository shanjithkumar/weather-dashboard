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

  // ✅ 4. Responsive chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 👈 makes it adapt to parent div
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Temperature Trend (Next 5 Days)",
        font: { size: 14 },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 60,
          minRotation: 30,
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          font: { size: 10 },
        },
      },
    },
  };

  // ✅ 5. Responsive container with Tailwind
  return (
    <div className="card mt-4 w-full">
      <div className="card-body p-2 sm:p-4">
        <h5 className="card-title text-center text-base sm:text-lg font-semibold mb-2">
          Temperature Trend
        </h5>

        {/* Responsive chart wrapper */}
        <div className="relative w-full h-[250px] sm:h-[400px]">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Add space after chart */}
      <br />
    </div>
  );
}
