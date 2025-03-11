import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/users/logout", {}, { withCredentials: true });
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

        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200">
          Logout
        </button>
      </div>

      <JoinButton />
    </nav>
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
