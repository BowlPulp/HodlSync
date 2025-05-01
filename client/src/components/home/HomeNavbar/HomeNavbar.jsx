import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Placeholder for auth state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  return (
    <nav className="fixed left-1/2 w-full -translate-x-1/2 flex items-center justify-between px-6 py-4 bg-[#222831] border border-[#393E46] shadow-lg z-10">
      <Logo />
      
      {/* Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-[#EEEEEE] focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Navbar Links */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-6 md:gap-8 absolute md:static bg-[#222831] md:bg-transparent top-16 left-0 w-full md:w-auto p-6 md:p-0 rounded-lg md:rounded-none border border-[#393E46] md:border-0 shadow-lg md:shadow-none z-20 transition-all duration-300 ease-in-out`}
      >
        <NavLink to="/">Home</NavLink>
        <NavLink to="/calculator/home">Calculators</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>

        {!isAuthenticated ? (
          <div className="flex flex-col md:flex-row gap-4">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-[#393E46] hover:bg-[#2d3138] text-[#EEEEEE] px-3 py-1 rounded transition duration-200"
          >
            Sign Out
          </button>
        )}
      </div>

      <div className="hidden md:block">
        <JoinButton />
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <img src="/sync.png" alt="Sync Icon" width="24" className="ml-2" />
      <span className="text-[#FFD369] text-xl font-semibold">HODLSync</span>
    </motion.div>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link to={to} className="group relative overflow-hidden">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        className="h-[20px] flex items-center"
      >
        <span className="text-[#EEEEEE] group-hover:text-[#FFD369] transition-colors duration-200">{children}</span>
      </motion.div>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD369] group-hover:w-full transition-all duration-300 ease-in-out"></span>
    </Link>
  );
};

const JoinButton = () => {
  return (
    <Link to="/user/home">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative overflow-hidden rounded-lg bg-[#FFD369] px-5 py-2 font-medium text-[#222831] shadow-md transition-all duration-300
          hover:bg-[#f8c94d] hover:shadow-lg"
      >
        <span className="flex items-center gap-2">
          Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </motion.button>
    </Link>
  );
};

export default HomeNavbar;