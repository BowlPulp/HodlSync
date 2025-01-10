import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TopCryptoList = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    const interval = setInterval(fetchCryptoData, 1200000); // Refresh every 20 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gray-900">
        <p>Loading top cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-green bg-opacity-40 backdrop-blur-lg text-white rounded-lg shadow-xl max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Top 5 Cryptocurrencies</h2>
      <ul className="space-y-8">
        {cryptoData.map((coin) => (
          <li
            key={coin.id}
            className="flex items-center gap-6 border-b border-gray-700 py-6"
          >
            {/* Coin Info */}
            <div className="flex items-center gap-6 flex-1">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-14 h-14 rounded-full shadow-md"
              />
              <div>
                <p className="text-xl font-semibold">{coin.name}</p>
                <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                <p
                  className={`text-sm font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  24h: {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Current Price */}
            <div className="text-right flex-1">
              <p className="text-xl font-semibold">${coin.current_price.toLocaleString()}</p>
            </div>

            {/* 7-Day Sparkline */}
            <div className="flex-1">
              <Line
                data={{
                  labels: coin.sparkline_in_7d.price.map((_, index) => index), // Dummy labels
                  datasets: [
                    {
                      label: "7d Trend",
                      data: coin.sparkline_in_7d.price,
                      borderColor: "#4F46E5",
                      backgroundColor: "rgba(79, 70, 229, 0.2)",
                      borderWidth: 2,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                }}
                className="h-16"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCryptoList;
