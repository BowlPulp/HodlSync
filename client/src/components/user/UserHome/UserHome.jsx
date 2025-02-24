import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [tokens, setTokens] = useState({});
  const [totalBalances, setTotalBalances] = useState({});
  const [netWorth, setNetWorth] = useState(null);
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
      console.log("Fetched Addresses:", res.data.addresses);
      setAddresses(res.data.addresses);
      res.data.addresses.forEach(fetchUserTokens);
      fetchNetWorth(res.data.addresses);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch addresses");
    }
  };

  const fetchUserTokens = async (walletAddress) => {
    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20?chain=eth&exclude_spam=true`,
        {
          headers: {
            "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY,
          },
        }
      );
      setTokens((prevTokens) => ({ ...prevTokens, [walletAddress]: response.data }));
      updateTotalBalances(response.data);
    } catch (error) {
      console.error("Error fetching tokens for", walletAddress, error.response?.data || error.message);
    }
  };

  const fetchNetWorth = async (walletAddresses) => {
    if (!walletAddresses.length) return;
  
    try {
      let totalNetWorth = 0;
  
      for (const walletAddress of walletAddresses) {
        const response = await axios.get(
          `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?exclude_spam=true&exclude_unverified_contracts=true`,
          {
            headers: {
              "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY,
            },
          }
        );
        totalNetWorth += response.data.total_networth_usd || 0;
      }
  
      setNetWorth(totalNetWorth); // Only set net worth once after all requests
    } catch (error) {
      console.error("Error fetching net worth:", error.response?.data || error.message);
    }
  };
  

  
  const updateTotalBalances = (newTokens) => {
    setTotalBalances((prevBalances) => {
      const updatedBalances = { ...prevBalances };
      newTokens.forEach((token) => {
        console.log("Token Price:", token.usd_price); // Debugging log
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

  const handleAddAddress = () => {
    axios
      .patch("http://localhost:4000/api/users/add-address", { address }, { withCredentials: true })
      .then((res) => {
        alert("Address added successfully");
        setAddress("");
        setAddresses((prev) => [...prev, address]);
        fetchUserTokens(address);
        fetchNetWorth(address);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to add address");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white p-4 lg-p-32 ">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl text-center mt-32">
        <h1 className="text-2xl font-bold mb-4">Crypto Wallet Tracker</h1>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded-md text-black"
          placeholder="Enter wallet address..."
        />
        <button
          onClick={handleAddAddress}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Add Address
        </button>
        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>

      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-center mb-4">Total Net Worth</h2>
        {netWorth ? (
          <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">${netWorth.total_networth_usd}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Fetching net worth...</p>
        )}
      </div>


      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-center mb-4">Tracked Wallets</h2>
        {addresses.length > 0 ? (
          addresses.map((addr, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md break-all">
              <h3 className="text-lg font-semibold text-blue-400">{addr}</h3>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No addresses added yet</p>
        )}
      </div>

      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-center mb-4">Total Balances</h2>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md break-all">
          {Object.keys(totalBalances).length > 0 ? (
            <ul>
              {Object.entries(totalBalances).map(([symbol, data]) => (
                <li key={symbol} className="flex items-center gap-4 text-gray-300">
                  <img src={data.thumbnail} alt={symbol} className="w-8 h-8 rounded-full" onError={(e) => e.target.src = "/sync.png"} />
                  <div>
                    <p className="font-semibold">{data.name} ({symbol}): {data.balance.toFixed(4)}</p>
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
  );
};

export default UserHome;
