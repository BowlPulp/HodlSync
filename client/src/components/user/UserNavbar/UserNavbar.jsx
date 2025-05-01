import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Fuel } from "lucide-react";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGasTracker, setShowGasTracker] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleGasTracker = () => setShowGasTracker(!showGasTracker);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/logout`, {}, { withCredentials: true });
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-8 left-1/2 w-full max-w-[1200px] -translate-x-1/2 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md z-10">
      <Logo />

      {/* Hamburger Icon */}
      <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navbar Links */}
      <div className={`${isMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-6 md:gap-12 absolute md:static bg-gray-800 md:bg-transparent top-20 md:top-0 left-0 w-full md:w-auto p-6 md:p-0`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/calculator/home">Calculators</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>

        {/* Gas Fee Tracker Button */}
        <div className="relative">
          <button
            onClick={toggleGasTracker}
            className="flex items-center gap-1 text-neutral-100 hover:text-neutral-50"
          >
            <Fuel size={16} />
            <span>Gas Tracker</span>
          </button>
          
          {/* Gas Tracker Dropdown */}
          {showGasTracker && <GasTracker />}
        </div>

        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200">
          Logout
        </button>
      </div>

      <JoinButton />
    </nav>
  );
};

const GasTracker = () => {
  const [gasData, setGasData] = useState({
    low: null,
    average: null,
    high: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=159SZWREAFHM4R82B42X478GMCFGDI1VX1');
        const data = await response.json();
        console.log(data);
        setGasData(data);
      }
      catch(error){
        console.log(error);
        setGasData(prev => ({
          ...prev,
          loading: false,
          error: "Failed to fetch gas data"
        }));
      }
    };
    fetchGasData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchGasData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (gasData.loading) {
    return (
      <div className="absolute top-10 right-0 w-64 bg-gray-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-center justify-center space-x-2 py-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-200"></div>
        </div>
        <p className="text-center text-sm mt-2">Loading gas prices...</p>
      </div>
    );
  }

  // Error state
  if (gasData.error) {
    return (
      <div className="absolute top-10 right-0 w-64 bg-gray-600 rounded-lg shadow-lg p-4 text-white">
        <p className="text-red-400 text-sm">{gasData.error}</p>
        <p className="text-xs mt-1">Please try again later</p>
      </div>
    );
  }

  // Gas price display
  return (
    <div className="absolute top-10 right-0 w-64 bg-gray-600 rounded-lg shadow-lg p-4 text-white z-20">
      <h3 className="text-sm font-bold border-b border-gray-700 pb-2 mb-3">Ethereum Gas Prices (Gwei)</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            Low:
          </span>
          <span className="font-medium">{gasData.result?.ProposeGasPrice}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
            Average:
          </span>
          <span className="font-medium">{gasData.result?.SafeGasPrice}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
            High:
          </span>
          <span className="font-medium">{gasData.result?.FastGasPrice}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-700">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">Updates every 30 seconds</p>
      </div>
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/sync.png" alt="Sync Icon" width="24" className="ml-2" />
    <span className="text-white text-xl font-semibold">HODLSync</span>
  </div>
);

const NavLink = ({ to, children }) => (
  <Link to={to} className="block overflow-hidden">
    <motion.div whileHover={{ y: -5 }} transition={{ ease: "easeOut", duration: 0.3 }} className="h-[20px] flex items-center">
      <span className="text-neutral-100 hover:text-neutral-50">{children}</span>
    </motion.div>
  </Link>
);

const JoinButton = () => (
  <Link to="/user/home">
    <button className="relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] border-neutral-700 px-4 py-1.5 font-medium text-neutral-300 transition-all duration-300
      before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-neutral-50 before:transition-transform before:duration-1000 before:content-['']
      hover:scale-105 hover:border-neutral-50 hover:text-neutral-900 hover:before:translate-y-[0%] active:scale-100">
      Dashboard
    </button>
  </Link>
);

export default UserNavbar;