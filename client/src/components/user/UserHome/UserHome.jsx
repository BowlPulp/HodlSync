import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserHome = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [tokens, setTokens] = useState({});
  const [totalBalances, setTotalBalances] = useState({});
  const [netWorth, setNetWorth] = useState(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/users/dashboard", {}, { withCredentials: true })
      .then((res) => {
        setMessage(res.data.message);
        fetchUserAddresses();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
        navigate("/");
      });
  }, [navigate]);

  const fetchUserAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/fetch-addresses", { withCredentials: true });
      console.log("Fetched Addresses from API:", res.data.addresses);
      setAddresses(res.data.addresses);

      // If no addresses, reset related state
      if (res.data.addresses.length === 0) {
        setTokens({});
        setTotalBalances({});
        setNetWorth(null);
      } else {
        await Promise.all(res.data.addresses.map(fetchUserTokens));
        await fetchNetWorth(res.data.addresses);
      }

      // Cache addresses for reference in netWorth, but not for primary fetch
      localStorage.setItem("cachedAddresses", JSON.stringify(res.data.addresses));
      localStorage.setItem("lastFetchTime", Date.now());
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch addresses");
      setAddresses([]); // Reset to empty on error to avoid stale data
    }
  };

  const fetchUserTokens = async (walletAddress) => {
    const cacheKey = `tokens_${walletAddress}`;
    const lastFetched = localStorage.getItem(`${cacheKey}_time`);
    const cachedTokens = JSON.parse(localStorage.getItem(cacheKey)) || [];
    const now = Date.now();

    if (lastFetched && now - lastFetched < 900000 && cachedTokens.length > 0) {
      console.log(`Using cached tokens for ${walletAddress}:`, cachedTokens);
      setTokens((prevTokens) => ({
        ...prevTokens,
        [walletAddress]: cachedTokens,
      }));
      updateTotalBalances(cachedTokens);
      return;
    }

    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20?chain=eth&exclude_spam=true`,
        {
          headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
        }
      );
      console.log(`Fetched tokens for ${walletAddress}:`, response.data);

      setTokens((prevTokens) => ({
        ...prevTokens,
        [walletAddress]: response.data,
      }));
      updateTotalBalances(response.data);

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(`${cacheKey}_time`, now);
    } catch (error) {
      console.error(`Error fetching tokens for ${walletAddress}:`, error.response?.data || error.message);
      if (cachedTokens.length > 0) {
        setTokens((prevTokens) => ({
          ...prevTokens,
          [walletAddress]: cachedTokens,
        }));
        updateTotalBalances(cachedTokens);
      }
    }
  };

  const fetchNetWorth = async (walletAddresses) => {
    if (!walletAddresses.length) {
      setNetWorth(null);
      localStorage.removeItem("cachedNetWorth");
      localStorage.removeItem("cachedNetWorth_time");
      return;
    }

    const cacheKey = "cachedNetWorth";
    const lastFetched = localStorage.getItem(`${cacheKey}_time`);
    const cachedNetWorth = localStorage.getItem(cacheKey);
    const cachedAddresses = JSON.parse(localStorage.getItem("cachedAddresses")) || [];
    const now = Date.now();
    const addressesChanged = JSON.stringify(walletAddresses) !== JSON.stringify(cachedAddresses);

    if (!addressesChanged && lastFetched && now - lastFetched < 900000 && cachedNetWorth) {
      console.log("Using cached net worth:", cachedNetWorth);
      setNetWorth(parseFloat(cachedNetWorth).toFixed(2));
      return;
    }

    try {
      const netWorthResponses = await Promise.all(
        walletAddresses.map(async (walletAddress) => {
          const response = await axios.get(
            `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?exclude_spam=true&exclude_unverified_contracts=true`,
            {
              headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
            }
          );
          return response.data.total_networth_usd || 0;
        })
      );

      const totalNetWorth = netWorthResponses.reduce((sum, value) => sum + Number(value), 0);
      console.log("Fetched net worth:", totalNetWorth);
      setNetWorth(totalNetWorth.toFixed(2));

      localStorage.setItem("cachedAddresses", JSON.stringify(walletAddresses));
      localStorage.setItem(cacheKey, totalNetWorth);
      localStorage.setItem(`${cacheKey}_time`, now);
    } catch (error) {
      console.error("Error fetching net worth:", error.response?.data || error.message);
      if (cachedNetWorth) {
        setNetWorth(parseFloat(cachedNetWorth).toFixed(2));
      }
    }
  };

  const updateTotalBalances = (newTokens) => {
    setTotalBalances((prevBalances) => {
      const updatedBalances = { ...prevBalances };

      newTokens.forEach((token) => {
        const tokenSymbol = token.symbol;
        const tokenBalance = token.balance / Math.pow(10, token.decimals);
        updatedBalances[tokenSymbol] = updatedBalances[tokenSymbol] || {
          balance: 0,
          usdPrice: token.usd_price || 0,
          thumbnail: token.thumbnail || token.logo || "/client/public/sync.png",
          name: token.name,
        };
        updatedBalances[tokenSymbol].balance += tokenBalance;
        updatedBalances[tokenSymbol].usdPrice = token.usd_price || 0;
      });

      return updatedBalances;
    });
  };

  const handleAddAddress = async () => {
    try {
      await axios.patch("http://localhost:4000/api/users/add-address", { address }, { withCredentials: true });
      toast.success("Address added successfully");
      setAddress("");
      setIsAddAddressOpen(false);
      await fetchUserAddresses(); // Fetch fresh data immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    try {
      await axios.patch(
        "http://localhost:4000/api/users/remove-address",
        { address: addressToDelete },
        { withCredentials: true }
      );
      toast.success("Address deleted successfully");
      await fetchUserAddresses(); // Fetch fresh data immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address");
    }
  };

  const getPortfolioData = () => {
    const labels = Object.keys(totalBalances).map((symbol) => totalBalances[symbol].name);
    const data = Object.keys(totalBalances).map((symbol) => {
      const { balance, usdPrice } = totalBalances[symbol];
      return balance * usdPrice;
    });
    const backgroundColors = Object.keys(totalBalances).map(
      (_, index) => `hsl(${(index * 360) / Object.keys(totalBalances).length}, 70%, 50%)`
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff" },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: $${context.raw.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-green-900 text-white p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between max-w-7xl mx-auto mt-32 gap-8">
        {/* Left Side */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="lg:sticky lg:top-6">
            <h1 className="text-2xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              Crypto Wallet Tracker
            </h1>
            <h2 className="text-xl font-semibold text-center mt-4 mb-2 text-gray-200">Total Net Worth</h2>
            <div className="p-4 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 text-center">
              {netWorth !== null ? (
                <p className="text-2xl font-bold text-green-400">${netWorth}</p>
              ) : (
                <p className="text-gray-400 animate-pulse">No addresses tracked</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
              className="p-2 bg-gray-700/50 rounded-full hover:bg-gray-600/50 transition-all"
              title="Add Wallet Address"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {isAddAddressOpen && (
              <div className="mt-4 w-full bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 p-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Enter wallet address..."
                  />
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm"
                  >
                    Add
                  </button>
                </div>
                {message && <p className="mt-3 text-green-400 text-center text-sm">{message}</p>}
                {error && <p className="mt-3 text-red-400 text-center text-sm">{error}</p>}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-200">Tracked Wallets</h2>
            <div className="space-y-4">
              {addresses.length > 0 ? (
                addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md border border-gray-700/50 hover:border-blue-500/50 transition-all break-all flex justify-between items-center"
                  >
                    <h3 className="text-lg font-medium text-blue-400 flex-1 truncate">{addr}</h3>
                    <button
                      onClick={() => handleDeleteAddress(addr)}
                      className="p-2 text-red-400 hover:text-red-600 transition-all"
                      title="Delete Address"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0V5m-4 2h12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No addresses added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-200">Total Balances</h2>
            <div className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50">
              {Object.keys(totalBalances).length > 0 ? (
                <ul className="space-y-4">
                  {Object.entries(totalBalances).map(([symbol, data]) => (
                    <li
                      key={symbol}
                      className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-all"
                    >
                      <img
                        src={data.thumbnail}
                        alt={symbol}
                        className="w-10 h-10 rounded-full border border-gray-600"
                        onError={(e) => (e.target.src = "/sync.png")}
                      />
                      <div>
                        <p className="font-semibold text-gray-200">
                          {data.name} ({symbol}): {data.balance.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-400">USD Price: ${data.usdPrice.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No tokens tracked</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;