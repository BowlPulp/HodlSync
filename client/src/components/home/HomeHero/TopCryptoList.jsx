import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Tooltip
} from "chart.js";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// Register required ChartJS components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const TopCryptoList = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const fetchCryptoData = async () => {
    setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 1200000); // Refresh every 20 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleRefresh = () => {
    fetchCryptoData();
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(selectedCoin?.id === coin.id ? null : coin);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        <div className="flex items-center">
          <div className="w-6 h-6 border-2 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin mr-3"></div>
          <p>Loading top cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        <div className="bg-red-900 bg-opacity-30 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-md flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Top 5 Cryptocurrencies</h2>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              refreshing 
                ? "bg-gray-800 text-gray-500" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <ul className="space-y-4">
          {cryptoData.map((coin) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            const isSelected = selectedCoin?.id === coin.id;
            const statusColor = isPositive ? "green" : "red";
            
            return (
              <li
                key={coin.id}
                className={`bg-[#18171787] rounded-lg shadow-lg overflow-hidden cursor-pointer border ${
                  isPositive ? "border-green-800" : "border-red-800"
                } ${isSelected ? "border-opacity-100" : "border-opacity-30"}`}
                onClick={() => handleCoinSelect(coin)}
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  {/* Coin Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-12 h-12 rounded-full"
                      loading="lazy"
                    />
                    
                    <div>
                      <h3 className="text-lg font-semibold">{coin.name}</h3>
                      <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                      <div className="flex items-center mt-1">
                        <span className={`flex items-center text-${statusColor}-500`}>
                          {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                          {isPositive ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="text-right md:w-48">
                    <p className="text-xl font-bold">
                      ${coin.current_price.toLocaleString()}
                    </p>
                  </div>

                  {/* 7-Day Sparkline */}
                  <div className="flex-1 h-16">
                    <Line
                      data={{
                        labels: Array(coin.sparkline_in_7d.price.length).fill(""),
                        datasets: [
                          {
                            data: coin.sparkline_in_7d.price,
                            borderColor: isPositive ? "#10B981" : "#EF4444",
                            backgroundColor: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                          duration: 600
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            titleColor: "#fff",
                            bodyColor: "#f3f4f6",
                            displayColors: false,
                            callbacks: {
                              title: () => "",
                              label: (context) => `$${context.raw.toFixed(2)}`
                            }
                          }
                        },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        },
                      }}
                    />
                  </div>
                </div>
                
                {/* Expanded details */}
                {isSelected && (
                  <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-3 rounded-md">
                        <p className="text-gray-400 text-sm">24h Volume</p>
                        <p className="text-lg font-medium">${coin.total_volume.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-md">
                        <p className="text-gray-400 text-sm">All-time High</p>
                        <p className="text-lg font-medium">${coin.ath.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-md">
                        <p className="text-gray-400 text-sm">Circulating Supply</p>
                        <p className="text-lg font-medium">
                          {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TopCryptoList;