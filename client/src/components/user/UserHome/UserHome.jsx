// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Pie, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend, Title);

// const UserHome = () => {
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [address, setAddress] = useState("");
//   const [addresses, setAddresses] = useState([]);
//   const [tokens, setTokens] = useState({});
//   const [totalBalances, setTotalBalances] = useState({});
//   const [netWorth, setNetWorth] = useState(null);
//   const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/dashboard`, { withCredentials: true })
//       .then((res) => {
//         setMessage(res.data.message);
//         fetchUserAddresses();
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || "Something went wrong");
//         navigate("/");
//       });
//   }, [navigate]);

//   const fetchUserAddresses = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/fetch-addresses`, { withCredentials: true });
//       console.log("Fetched Addresses from API:", res.data.addresses);
//       setAddresses(res.data.addresses);

//       // If no addresses, reset related state
//       if (res.data.addresses.length === 0) {
//         setTokens({});
//         setTotalBalances({});
//         setNetWorth(null);
//       } else {
//         setTokens({});
//         await Promise.all(res.data.addresses.map(fetchUserTokens));
//         await fetchNetWorth(res.data.addresses);
//       }

//       // Cache addresses for reference in netWorth, but not for primary fetch
//       localStorage.setItem("cachedAddresses", JSON.stringify(res.data.addresses));
//       localStorage.setItem("lastFetchTime", Date.now());
//     } catch (err) {
//       console.error("Error fetching addresses:", err);
//       setError("Failed to fetch addresses");
//       setAddresses([]); // Reset to empty on error to avoid stale data
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUserTokens = async (walletAddress) => {
//     const cacheKey = `tokens_${walletAddress}`;
//     const lastFetched = localStorage.getItem(`${cacheKey}_time`);
//     const cachedTokens = JSON.parse(localStorage.getItem(cacheKey)) || [];
//     const now = Date.now();

//     if (lastFetched && now - lastFetched < 900000 && cachedTokens.length > 0) {
//       console.log(`Using cached tokens for ${walletAddress}:`, cachedTokens);
//       setTokens((prevTokens) => ({
//         ...prevTokens,
//         [walletAddress]: cachedTokens,
//       }));
//       updateTotalBalances(cachedTokens);
//       return;
//     }

//     // https://deep-index.moralis.io/api/v2.2/wallets/0xcB1C1FdE09f811B294172696404e88E658659905/tokens?chain=eth
//     // https://deep-index.moralis.io/api/v2.2/0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326/erc20?chain=eth
//     try {
//       const response = await axios.get(
//         `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/tokens?chain=eth&exclude_spam=true`,
//         {
//           headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
//         }
//       );
//       console.log(`Fetched tokens for ${walletAddress}:`, response.data);

//       setTokens((prevTokens) => ({
//         ...prevTokens,
//         [walletAddress]: response.data.result,
//       }));
//       updateTotalBalances(response.data.result);

//       localStorage.setItem(cacheKey, JSON.stringify(response.data));
//       localStorage.setItem(`${cacheKey}_time`, now);
//     } catch (error) {
//       console.error(`Error fetching tokens for ${walletAddress}:`, error.response?.data || error.message);
//       if (cachedTokens.length > 0) {
//         setTokens((prevTokens) => ({
//           ...prevTokens,
//           [walletAddress]: cachedTokens,
//         }));
//         updateTotalBalances(cachedTokens);
//       }
//     }
//   };

//   const fetchNetWorth = async (walletAddresses) => {
//     if (!walletAddresses.length) {
//       setNetWorth(null);
//       localStorage.removeItem("cachedNetWorth");
//       localStorage.removeItem("cachedNetWorth_time");
//       return;
//     }

//     const cacheKey = "cachedNetWorth";
//     const lastFetched = localStorage.getItem(`${cacheKey}_time`);
//     const cachedNetWorth = localStorage.getItem(cacheKey);
//     const cachedAddresses = JSON.parse(localStorage.getItem("cachedAddresses")) || [];
//     const now = Date.now();
//     const addressesChanged = JSON.stringify(walletAddresses) !== JSON.stringify(cachedAddresses);

//     if (!addressesChanged && lastFetched && now - lastFetched < 900000 && cachedNetWorth) {
//       console.log("Using cached net worth:", cachedNetWorth);
//       setNetWorth(parseFloat(cachedNetWorth).toFixed(2));
//       return;
//     }

//     try {
//       const netWorthResponses = await Promise.all(
//         walletAddresses.map(async (walletAddress) => {
//           const response = await axios.get(
//             `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?exclude_spam=true&exclude_unverified_contracts=false`,
//             {
//               headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
//             }
//           );
//           return response.data.total_networth_usd || 0;
//         })
//       );

//       const totalNetWorth = netWorthResponses.reduce((sum, value) => sum + Number(value), 0);
//       console.log("Fetched net worth:", totalNetWorth);
//       setNetWorth(totalNetWorth.toFixed(2));

//       localStorage.setItem("cachedAddresses", JSON.stringify(walletAddresses));
//       localStorage.setItem(cacheKey, totalNetWorth);
//       localStorage.setItem(`${cacheKey}_time`, now);
//     } catch (error) {
//       console.error("Error fetching net worth:", error.response?.data || error.message);
//       if (cachedNetWorth) {
//         setNetWorth(parseFloat(cachedNetWorth).toFixed(2));
//       }
//     }
//   };

//   const updateTotalBalances = (newTokens) => {
//     setTotalBalances((prevBalances) => {
//       const updatedBalances = { ...prevBalances };

//       newTokens.forEach((token) => {
//         const tokenSymbol = token.symbol;
//         const tokenBalance = token.balance / Math.pow(10, token.decimals);
//         updatedBalances[tokenSymbol] = updatedBalances[tokenSymbol] || {
//           balance: 0,
//           usdPrice: token.usd_price || 0,
//           thumbnail: token.thumbnail || token.logo || "/client/public/sync.png",
//           name: token.name,
//           usdValue: 0,
//         };
//         updatedBalances[tokenSymbol].balance += tokenBalance;
//         updatedBalances[tokenSymbol].usdPrice = token.usd_price || 0;
//         updatedBalances[tokenSymbol].usdValue = updatedBalances[tokenSymbol].balance * updatedBalances[tokenSymbol].usdPrice;
//       });

//       return updatedBalances;
//     });
//   };

//   const handleAddAddress = async () => {
//     if (!address.trim()) {
//       toast.error("Please enter a valid address");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/add-address`, { address }, { withCredentials: true });
//       toast.success("Address added successfully");
//       setAddress("");
//       setIsAddAddressOpen(false);
//       await fetchUserAddresses(); // Fetch fresh data immediately
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add address");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteAddress = async (addressToDelete) => {
//     try {
//       setIsLoading(true);
//       await axios.patch(
//         `${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/remove-address`,
//         { address: addressToDelete },
//         { withCredentials: true }
//       );
//       toast.success("Address deleted successfully");
//       if (selectedAddress === addressToDelete) {
//         setSelectedAddress(null);
//       }
//       await fetchUserAddresses(); // Fetch fresh data immediately
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete address");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getPortfolioData = () => {
//     const sortedBalances = Object.entries(totalBalances)
//       .sort((a, b) => b[1].usdValue - a[1].usdValue);

//     // Take top 5 tokens, group rest as "Others"
//     let topTokens = sortedBalances.slice(0, 5);
//     let otherTokens = sortedBalances.slice(5);

//     let labels = topTokens.map(([_, data]) => data.name);
//     let data = topTokens.map(([_, data]) => data.usdValue);

//     // Add "Others" category if there are more tokens
//     if (otherTokens.length > 0) {
//       const otherValue = otherTokens.reduce((sum, [_, data]) => sum + data.usdValue, 0);
//       labels.push("Others");
//       data.push(otherValue);
//     }

//     // Generate gradient colors from blue to green
//     const backgroundColors = labels.map(
//       (_, index) => `hsl(${180 + (index * 25)}, 70%, 50%)`
//     );

//     return {
//       labels,
//       datasets: [
//         {
//           data,
//           backgroundColor: backgroundColors,
//           borderColor: "#ffffff",
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "right",
//         labels: {
//           color: "#ffffff",
//           font: {
//             size: 12
//           }
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `${context.label}: $${context.raw.toFixed(2)} (${((context.raw / context.chart.getDatasetMeta(0).total) * 100).toFixed(1)}%)`,
//         },
//       },
//       title: {
//         display: true,
//         text: 'Portfolio Distribution',
//         color: '#ffffff',
//         font: {
//           size: 16
//         }
//       }
//     },
//   };

//   const getAddressTokens = (address) => {
//     return tokens[address] || [];
//   };

//   const truncateAddress = (address) => {
//     if (!address) return "";
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   const getTrendingTokens = () => {
//     // Sort tokens by USD value
//     return Object.entries(totalBalances)
//       .sort((a, b) => b[1].usdValue - a[1].usdValue)
//       .slice(0, 4);
//   };

//   const formatUSD = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(value);
//   };

//   const refreshData = () => {
//     // Clear cache
//     localStorage.removeItem("cachedNetWorth");
//     localStorage.removeItem("cachedNetWorth_time");
//     setTokens({});
//     setTotalBalances({});
//     setNetWorth(null);
//     Object.keys(tokens).forEach(address => {
//       localStorage.removeItem(`tokens_${address}`);
//       localStorage.removeItem(`tokens_${address}_time`);
//     });

//     toast.info("Refreshing data...");
//     fetchUserAddresses();
//   };

//   const renderAddressTokens = () => {
//     if (!selectedAddress) return null;

//     const addressTokens = getAddressTokens(selectedAddress);
//     if (!addressTokens.length) {
//       return (
//         <div className="flex items-center justify-center h-40">
//           <p className="text-gray-400">No tokens found for this address</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold text-gray-200">Tokens for {truncateAddress(selectedAddress)}</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {addressTokens.map((token, index) => {
//             const tokenBalance = token.balance / Math.pow(10, token.decimals);
//             const usdValue = tokenBalance * (token.usd_price || 0);

//             return (
//               <div
//                 key={index}
//                 className="p-4 break-all bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={token.thumbnail || token.logo || "/sync.png"}
//                     alt={token.symbol}
//                     className="w-10 h-10 rounded-full bg-gray-700"
//                     onError={(e) => { e.target.src = "/sync.png" }}
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-200">{token.name}</h4>
//                     <p className="text-sm text-gray-400">{token.symbol}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-gray-200">{tokenBalance.toFixed(2)}</p>
//                     <p className="text-sm text-blue-400">{formatUSD(usdValue)}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderDashboard = () => {
//     if (activeTab === "overview") {
//       return (
//         <div className="space-y-8">
//           {/* Net Worth Card */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="col-span-2 p-6 bg-gradient-to-br from-gray-800/80 to-blue-900/40 backdrop-blur-md rounded-xl shadow-xl border border-blue-700/30 flex flex-col justify-center items-center">
//               <h3 className="text-lg font-medium text-gray-300 mb-2">Total Net Worth</h3>
//               {netWorth !== null ? (
//                 <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
//                   {formatUSD(netWorth)}
//                 </p>
//               ) : (
//                 <p className="text-xl text-gray-400 animate-pulse">Add a wallet address to get started</p>
//               )}
//               <button
//                 onClick={refreshData}
//                 className="mt-4 flex items-center gap-2 p-2 px-4 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg transition-all text-sm font-medium"
//                 disabled={isLoading}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 {isLoading ? 'Loading...' : 'Refresh Data'}
//               </button>
//             </div>

//             {/* Trending Tokens */}
//             {getTrendingTokens().map(([symbol, data], index) => (
//               <div key={symbol} className="p-4 bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700/50 flex flex-col items-center justify-center">
//                 <img
//                   src={data.thumbnail}
//                   alt={symbol}
//                   className="w-8 h-8 rounded-full mb-2"
//                   onError={(e) => { e.target.src = "/sync.png" }}
//                 />
//                 <h4 className="text-sm font-medium text-gray-300">{symbol}</h4>
//                 <p className="text-lg font-bold text-blue-400">{data.balance.toFixed(2)}</p>
//                 <p className="text-xs text-gray-400">{formatUSD(data.usdValue)}</p>
//               </div>
//             ))}
//           </div>

//           {/* Portfolio Chart */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 h-80">
//               {Object.keys(totalBalances).length > 0 ? (
//                 <Doughnut data={getPortfolioData()} options={pieOptions} />
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-gray-400">No portfolio data available</p>
//                 </div>
//               )}
//             </div>

//             {/* Token List */}
//             <div className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50">
//               <h3 className="text-xl font-semibold text-gray-200 mb-4">Holdings</h3>
//               <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                 {Object.entries(totalBalances)
//                   .sort((a, b) => b[1].usdValue - a[1].usdValue)
//                   .map(([symbol, data]) => (
//                     <div
//                       key={symbol}
//                       className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg hover:bg-gray-900/60 transition-all"
//                     >
//                       <img
//                         src={data.thumbnail}
//                         alt={symbol}
//                         className="w-8 h-8 rounded-full border border-gray-700"
//                         onError={(e) => { e.target.src = "/sync.png" }}
//                       />
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-200">{data.name}</p>
//                         <p className="text-xs text-gray-400">{symbol}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium text-gray-200">{data.balance.toFixed(3)}</p>
//                         <p className="text-xs text-blue-400">{formatUSD(data.usdValue)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 {Object.keys(totalBalances).length === 0 && (
//                   <p className="text-gray-400 text-center py-4">No tokens found</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//       );
//     } else if (activeTab === "wallets") {
//       return (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Wallets List */}
//             <div className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50">
//               <h3 className="text-xl font-semibold text-gray-200 mb-4">Your Wallets</h3>
//               <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                 {addresses.length > 0 ? (
//                   addresses.map((addr, index) => (
//                     <div
//                       key={index}
//                       className={`p-4 ${selectedAddress === addr ? 'bg-blue-900/30 border-blue-500/50' : 'bg-gray-900/30 border-gray-700/50'} backdrop-blur-sm rounded-xl border hover:border-blue-500/30 transition-all flex justify-between items-center cursor-pointer`}
//                       onClick={() => setSelectedAddress(addr)}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-800 rounded-full">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                           </svg>
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-medium text-gray-200">Wallet {index + 1}</h4>
//                           <p className="text-xs text-gray-400 truncate max-w-xs">{addr}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteAddress(addr);
//                         }}
//                         className="p-2 text-gray-400 hover:text-red-400 transition-all"
//                         title="Delete Address"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0V5m-4 2h12" />
//                         </svg>
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 text-center py-4">No wallets added yet</p>
//                 )}
//               </div>
//             </div>

//             {/* Wallet Details */}
//             <div className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50">
//               {selectedAddress ? renderAddressTokens() : (
//                 <div className="flex flex-col items-center justify-center h-64">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                   </svg>
//                   <p className="text-gray-400 mt-4">Select a wallet to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-green-900 text-white">
//       {/* Header
//       <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
//             Crypto Dashboard
//           </h1>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg text-sm font-medium"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Wallet
//             </button>
//           </div>
//         </div>
//       </header> */}

//       {/* Main Content */}
//       <main className="pt-28 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Tabs */}
//           <div className="mb-8 flex border-b border-gray-700">
//             <button
//               className={`px-4 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               Overview
//             </button>
//             <button
//               className={`px-4 py-3 font-medium text-sm ${activeTab === 'wallets' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
//               onClick={() => setActiveTab('wallets')}
//             >
//               Wallets
//             </button>
//             <div className="ml-auto">
//               <button onClick={() => setIsAddAddressOpen(!isAddAddressOpen)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg text-sm font-medium">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add Wallet
//               </button>
//             </div>
//           </div>

//           {/* Add Address Modal */}
//           {isAddAddressOpen && (
//             <div className="mb-8 p-6 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-blue-700/30 animate-fade-in">
//               <h3 className="text-xl font-semibold text-gray-200 mb-4">Add New Wallet</h3>
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="flex-1 p-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                   placeholder="Enter Ethereum wallet address (0x...)"
//                 />
//                 <button
//                   onClick={handleAddAddress}
//                   className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Adding...' : 'Add Wallet'}
//                 </button>
//               </div>
//               {message && <p className="mt-3 text-green-400 text-sm">{message}</p>}
//               {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
//             </div>
//           )}

//           {/* Dashboard Content */}
//           {isLoading && addresses.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-64">
//               <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//               <p className="mt-4 text-gray-400">Loading your portfolio...</p>
//             </div>
//           ) : (
//             renderDashboard()
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserHome;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Filler } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Filler);

const UserHome = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [tokens, setTokens] = useState({});
  const [totalBalances, setTotalBalances] = useState({});
  const [netWorth, setNetWorth] = useState(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [dateRange, setDateRange] = useState("1w"); // 1d, 1w, 1m, 3m, 1y
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/dashboard`, { withCredentials: true })
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
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/fetch-addresses`, { withCredentials: true });
      console.log("Fetched Addresses from API:", res.data.addresses);
      setAddresses(res.data.addresses);

      // If no addresses, reset related state
      if (res.data.addresses.length === 0) {
        setTokens({});
        setTotalBalances({});
        setNetWorth(null);
        setTransactions([]);
        setNfts([]);
        setHistoricalData([]);
      } else {
        setTokens({});
        await Promise.all(res.data.addresses.map(fetchUserTokens));
        await fetchNetWorth(res.data.addresses);
        
        // If there's a selected address, fetch additional data for it
        if (selectedAddress) {
          fetchTransactions(selectedAddress);
          fetchNfts(selectedAddress);
        } else if (res.data.addresses.length > 0) {
          // Select first address if none selected
          setSelectedAddress(res.data.addresses[0]);
          fetchTransactions(res.data.addresses[0]);
          fetchNfts(res.data.addresses[0]);
        }
        
        // Generate mock historical data
        generateHistoricalData();
      }

      // Cache addresses for reference in netWorth, but not for primary fetch
      localStorage.setItem("cachedAddresses", JSON.stringify(res.data.addresses));
      localStorage.setItem("lastFetchTime", Date.now());
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch addresses");
      setAddresses([]); // Reset to empty on error to avoid stale data
    } finally {
      setIsLoading(false);
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
        `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/tokens?chain=eth&exclude_spam=true`,
        {
          headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
        }
      );
      console.log(`Fetched tokens for ${walletAddress}:`, response.data);

      setTokens((prevTokens) => ({
        ...prevTokens,
        [walletAddress]: response.data.result,
      }));
      updateTotalBalances(response.data.result);

      localStorage.setItem(cacheKey, JSON.stringify(response.data.result));
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
            `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?exclude_spam=true&exclude_unverified_contracts=false`,
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

  const fetchTransactions = async (walletAddress) => {
    const cacheKey = `transactions_${walletAddress}`;
    const lastFetched = localStorage.getItem(`${cacheKey}_time`);
    const cachedTransactions = JSON.parse(localStorage.getItem(cacheKey)) || [];
    const now = Date.now();

    if (lastFetched && now - lastFetched < 900000 && cachedTransactions.length > 0) {
      console.log(`Using cached transactions for ${walletAddress}:`, cachedTransactions);
      setTransactions(cachedTransactions);
      return;
    }

    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20/transfers?chain=eth&limit=20`,
        {
          headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
        }
      );
      console.log(`Fetched transactions for ${walletAddress}:`, response.data);
      setTransactions(response.data.result || []);

      localStorage.setItem(cacheKey, JSON.stringify(response.data.result || []));
      localStorage.setItem(`${cacheKey}_time`, now);
    } catch (error) {
      console.error(`Error fetching transactions for ${walletAddress}:`, error.response?.data || error.message);
      if (cachedTransactions.length > 0) {
        setTransactions(cachedTransactions);
      }
    }
  };

  const fetchNfts = async (walletAddress) => {
    const cacheKey = `nfts_${walletAddress}`;
    const lastFetched = localStorage.getItem(`${cacheKey}_time`);
    const cachedNfts = JSON.parse(localStorage.getItem(cacheKey)) || [];
    const now = Date.now();

    if (lastFetched && now - lastFetched < 900000 && cachedNfts.length > 0) {
      console.log(`Using cached NFTs for ${walletAddress}:`, cachedNfts);
      setNfts(cachedNfts);
      return;
    }

    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2.2/${walletAddress}/nft?chain=eth&limit=8&exclude_spam=true`,
        {
          headers: { "X-API-Key": import.meta.env.VITE_REACT_APP_MORALIS_API_KEY },
        }
      );
      console.log(`Fetched NFTs for ${walletAddress}:`, response.data);
      setNfts(response.data.result || []);

      localStorage.setItem(cacheKey, JSON.stringify(response.data.result || []));
      localStorage.setItem(`${cacheKey}_time`, now);
    } catch (error) {
      console.error(`Error fetching NFTs for ${walletAddress}:`, error.response?.data || error.message);
      if (cachedNfts.length > 0) {
        setNfts(cachedNfts);
      }
    }
  };

  // Generate mock historical data for portfolio growth
  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    
    // Different ranges for different timeframes
    let days = 0;
    switch(dateRange) {
      case "1d": days = 1; break;
      case "1w": days = 7; break;
      case "1m": days = 30; break;
      case "3m": days = 90; break;
      case "1y": days = 365; break;
      default: days = 7;
    }
    
    const startValue = netWorth ? parseFloat(netWorth) * 0.85 : 10000;
    const endValue = netWorth ? parseFloat(netWorth) : 12000;
    
    // Generate data points
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Add some randomness to create a realistic looking chart
      const progress = 1 - (i / days);
      const randomFactor = Math.random() * 0.1 - 0.05; // Random factor between -5% and +5%
      const value = startValue + (endValue - startValue) * progress + (startValue * randomFactor);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: value.toFixed(2)
      });
    }
    
    setHistoricalData(data);
  };

  useEffect(() => {
    generateHistoricalData();
  }, [dateRange, netWorth]);

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
          usdValue: 0,
        };
        updatedBalances[tokenSymbol].balance += tokenBalance;
        updatedBalances[tokenSymbol].usdPrice = token.usd_price || 0;
        updatedBalances[tokenSymbol].usdValue = updatedBalances[tokenSymbol].balance * updatedBalances[tokenSymbol].usdPrice;
      });

      return updatedBalances;
    });
  };

  const handleAddAddress = async () => {
    if (!address.trim()) {
      toast.error("Please enter a valid address");
      return;
    }

    try {
      setIsLoading(true);
      await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/add-address`, { address }, { withCredentials: true });
      toast.success("Address added successfully");
      setAddress("");
      setIsAddAddressOpen(false);
      await fetchUserAddresses(); // Fetch fresh data immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/remove-address`,
        { address: addressToDelete },
        { withCredentials: true }
      );
      toast.success("Address deleted successfully");
      if (selectedAddress === addressToDelete) {
        setSelectedAddress(null);
      }
      await fetchUserAddresses(); // Fetch fresh data immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  const getPortfolioData = () => {
    const sortedBalances = Object.entries(totalBalances)
      .sort((a, b) => b[1].usdValue - a[1].usdValue);

    // Take top 5 tokens, group rest as "Others"
    let topTokens = sortedBalances.slice(0, 5);
    let otherTokens = sortedBalances.slice(5);

    let labels = topTokens.map(([_, data]) => data.name);
    let data = topTokens.map(([_, data]) => data.usdValue);

    // Add "Others" category if there are more tokens
    if (otherTokens.length > 0) {
      const otherValue = otherTokens.reduce((sum, [_, data]) => sum + data.usdValue, 0);
      labels.push("Others");
      data.push(otherValue);
    }

    // Generate teal to blue color gradient
    const backgroundColors = labels.map(
      (_, index) => `hsl(${180 - (index * 15)}, 80%, 50%)`
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#e0f2f1",
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: $${context.raw.toFixed(2)} (${((context.raw / context.chart.getDatasetMeta(0).total) * 100).toFixed(1)}%)`,
        },
      },
      title: {
        display: true,
        text: 'Portfolio Distribution',
        color: '#e0f2f1',
        font: {
          size: 16
        }
      }
    },
  };

  const getHistoricalChartData = () => {
    return {
      labels: historicalData.map(item => item.date),
      datasets: [
        {
          label: 'Portfolio Value (USD)',
          data: historicalData.map(item => item.value),
          fill: true,
          backgroundColor: 'rgba(0, 176, 155, 0.2)',
          borderColor: 'rgba(0, 176, 155, 1)',
          tension: 0.4,
          pointRadius: 2,
          pointBackgroundColor: 'rgba(0, 176, 155, 1)',
        }
      ]
    };
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Portfolio Value: ${formatUSD(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#e0f2f1',
          maxRotation: 0,
          maxTicksLimit: 7,
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#e0f2f1',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const getAddressTokens = (address) => {
    return tokens[address] || [];
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const truncateHash = (hash) => {
    if (!hash) return "";
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTrendingTokens = () => {
    // Sort tokens by USD value
    return Object.entries(totalBalances)
      .sort((a, b) => b[1].usdValue - a[1].usdValue)
      .slice(0, 4);
  };

  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const refreshData = () => {
    // Clear cache
    localStorage.removeItem("cachedNetWorth");
    localStorage.removeItem("cachedNetWorth_time");
    setTokens({});
    setTotalBalances({});
    setNetWorth(null);
    Object.keys(tokens).forEach(address => {
      localStorage.removeItem(`tokens_${address}`);
      localStorage.removeItem(`tokens_${address}_time`);
      localStorage.removeItem(`transactions_${address}`);
      localStorage.removeItem(`transactions_${address}_time`);
      localStorage.removeItem(`nfts_${address}`);
      localStorage.removeItem(`nfts_${address}_time`);
    });

    toast.info("Refreshing data...");
    fetchUserAddresses();
  };

  const renderAddressTokens = () => {
    if (!selectedAddress) return null;

    const addressTokens = getAddressTokens(selectedAddress);
    if (!addressTokens.length) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">No tokens found for this address</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-100">Tokens for {truncateAddress(selectedAddress)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressTokens.map((token, index) => {
            const tokenBalance = token.balance / Math.pow(10, token.decimals);
            const usdValue = tokenBalance * (token.usd_price || 0);

            return (
              <div
                key={index}
                className="p-4 break-all bg-gradient-to-br from-gray-900/90 to-blue-900/40 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-teal-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.thumbnail || token.logo || "/sync.png"}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-full bg-gray-800 object-cover"
                    onError={(e) => { e.target.src = "/sync.png" }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-teal-50">{token.name}</h4>
                    <p className="text-sm text-teal-300">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-200">{tokenBalance.toFixed(4)}</p>
                    <p className="text-sm text-teal-400">{formatUSD(usdValue)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    if (!selectedAddress) return null;

    if (!transactions.length) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">No recent transactions found for this address</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-100">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-teal-300">Token</th>
                <th className="px-4 py-3 text-left text-teal-300">Amount</th>
                <th className="px-4 py-3 text-left text-teal-300">Type</th>
                <th className="px-4 py-3 text-left text-teal-300">Hash</th>
                <th className="px-4 py-3 text-left text-teal-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((tx, index) => {
                const isReceived = tx.to_address.toLowerCase() === selectedAddress.toLowerCase();
                const formattedAmount = (tx.value / Math.pow(10, parseInt(tx.decimals))).toFixed(4);
                
                return (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={tx.logo || "/sync.png"} 
                          alt={tx.symbol} 
                          className="w-6 h-6 rounded-full bg-gray-800"
                          onError={(e) => { e.target.src = "/sync.png" }}
                        />
                        <span className="text-gray-200">{tx.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-200">{formattedAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${isReceived ? 'bg-teal-900/50 text-teal-300' : 'bg-blue-900/50 text-blue-300'}`}>
                        {isReceived ? 'Received' : 'Sent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{truncateHash(tx.transaction_hash)}</td>
                    <td className="px-4 py-3 text-gray-400">{formatTimestamp(tx.block_timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNfts = () => {
    if (!selectedAddress) return null;

    if (!nfts.length) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">No NFTs found for this address</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-100">NFT Collection</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {nfts.map((nft, index) => {
            const metadata = nft.metadata ? JSON.parse(nft.metadata) : {};
            const imageUrl = metadata.image || metadata.image_url || "/sync.png";
            const name = metadata.name || `NFT #${nft.token_id?.substring(0, 4)}`;
            
            return (
              <div key={index} className="p-3 bg-gradient-to-br from-gray-900/90 to-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-teal-500/50 transition-all">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 mb-2">
                  <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/sync.png" }}
                  />
                </div>
                <div className="mt-2">
                  <h4 className="font-medium text-teal-50 truncate">{name}</h4>
                  <p className="text-xs text-teal-300 truncate">{nft.name || "Unknown Collection"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (activeTab === "overview") {
      return (
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2 p-6 bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-md rounded-xl shadow-xl border border-teal-500/30 flex flex-col justify-center items-center">
              <h3 className="text-lg font-medium text-teal-300 mb-2">Total Net Worth</h3>
              {netWorth !== null ? (
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-300">
                  {formatUSD(netWorth)}
                </p>
              ) : (
                <p className="text-xl text-gray-400 animate-pulse">Add a wallet address to get started</p>
              )}
              <button
                onClick={refreshData}
                className="mt-4 flex items-center gap-2 p-2 px-4 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg transition-all text-sm font-medium"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>

            {/* Trending Tokens */}
            {getTrendingTokens().map(([symbol, data], index) => (
              <div key={symbol} className="p-4 bg-gradient-to-br from-gray-900/90 to-blue-900/30 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={data.thumbnail || "/sync.png"}
                  alt={symbol}
                  className="w-6 h-6 rounded-full bg-gray-800"
                  onError={(e) => { e.target.src = "/sync.png" }}
                />
                <span className="font-medium text-teal-100">{symbol}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-200">{data.balance.toFixed(4)}</p>
              <p className="text-sm text-teal-400">{formatUSD(data.usdValue)}</p>
            </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Distribution Chart */}
            <div className="p-6 bg-gradient-to-br from-gray-900/90 to-blue-900/30 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="h-80">
                {Object.keys(totalBalances).length > 0 ? (
                  <Doughnut data={getPortfolioData()} options={pieOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No portfolio data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Chart */}
            <div className="p-6 bg-gradient-to-br from-gray-900/90 to-blue-900/30 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-teal-200">Portfolio History</h3>
                <div className="flex gap-2">
                  {["1d", "1w", "1m", "3m", "1y"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-2 py-1 text-xs rounded-md ${
                        dateRange === range
                          ? "bg-teal-600 text-teal-50"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                {historicalData.length > 0 ? (
                  <Line data={getHistoricalChartData()} options={lineOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No historical data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-teal-100">Your Wallets</h3>
              <button
                onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
                className="p-2 px-4 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Wallet
              </button>
            </div>

            {isAddAddressOpen && (
              <div className="p-4 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter ETH wallet address (0x...)"
                    className="flex-1 p-2 px-4 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-200"
                  />
                  <button
                    onClick={handleAddAddress}
                    disabled={isLoading}
                    className="p-2 px-6 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all text-sm font-medium"
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {addresses.length === 0 ? (
                <div className="p-8 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700 text-center">
                  <p className="text-gray-400">No wallet addresses found. Add one to get started.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr}
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-center
                      ${selectedAddress === addr
                        ? "bg-teal-900/30 border-teal-500/40"
                        : "bg-gray-800/70 border-gray-700 hover:border-teal-500/30"
                      }`}
                    onClick={() => {
                      setSelectedAddress(addr);
                      fetchTransactions(addr);
                      fetchNfts(addr);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{truncateAddress(addr)}</p>
                        <p className="text-xs text-teal-400 mt-1">
                          {tokens[addr]?.length || 0} tokens
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeTab === "tokens") {
      return renderAddressTokens();
    } else if (activeTab === "transactions") {
      return renderTransactions();
    } else if (activeTab === "nfts") {
      return renderNfts();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all text-sm font-medium"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8 pt-4 mt-16">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-teal-300">Portfolio Tracker</h1>
              <p className="text-teal-500 mt-1">{message}</p>
            </div>
            {/* <button
              onClick={() => {
                axios
                  .get(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/logout`, { withCredentials: true })
                  .then(() => {
                    navigate("/");
                  })
                  .catch((err) => {
                    console.error("Logout error:", err);
                    navigate("/");
                  });
              }}
              className="p-2 px-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm font-medium border border-gray-700"
            >
              Logout
            </button> */}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700 pb-2">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 font-medium transition-all border-b-2 ${
                activeTab === "overview"
                  ? "text-teal-300 border-teal-400"
                  : "text-gray-400 border-transparent hover:text-teal-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tokens")}
              className={`pb-2 font-medium transition-all border-b-2 ${
                activeTab === "tokens"
                  ? "text-teal-300 border-teal-400"
                  : "text-gray-400 border-transparent hover:text-teal-100"
              }`}
              disabled={!selectedAddress}
            >
              Tokens
            </button>
            {/* <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-2 font-medium transition-all border-b-2 ${
                activeTab === "transactions"
                  ? "text-teal-300 border-teal-400"
                  : "text-gray-400 border-transparent hover:text-teal-100"
              }`}
              disabled={!selectedAddress}
            >
              Transactions
            </button> */}
            <button
              onClick={() => setActiveTab("nfts")}
              className={`pb-2 font-medium transition-all border-b-2 ${
                activeTab === "nfts"
                  ? "text-teal-300 border-teal-400"
                  : "text-gray-400 border-transparent hover:text-teal-100"
              }`}
              disabled={!selectedAddress}
            >
              NFTs
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <main>
          {isLoading && addresses.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-teal-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-teal-300">Loading your portfolio...</p>
              </div>
            </div>
          ) : (
            renderDashboard()
          )}
        </main>
      </div>
    </div>
  );
};

export default UserHome;