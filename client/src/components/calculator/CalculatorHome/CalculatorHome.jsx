import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CalculatorHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const calculators = [
    { name: "SIP & Lumpsum Calculator", path: "/calculator/sip-calculator", description: "Plan and estimate returns on your SIP and lump sum investments to reach your financial goals.", icon: "💰" },
    { name: "Loan Calculator", path: "/calculator/loan-calculator", description: "Calculate your loan EMIs easily based on principal, interest rate, and tenure.", icon: "🏠" },
    { name: "Simple Interest Calculator", path: "/calculator/simple-interest-calculator", description: "Estimate your returns with simple interest on your investment.", icon: "📈" },
    { name: "Compound Interest Calculator", path: "/calculator/compound-interest-calculator", description: "Calculate returns with compound interest and visualize wealth growth over time.", icon: "📊" },
    { name: "FD Calculator", path: "/calculator/fd-calculator", description: "Calculate the returns on your Fixed Deposit based on amount, tenure, and interest rate.", icon: "🏦" },
    { name: "SWP Calculator", path: "/calculator/swp-calculator", description: "Plan and manage regular withdrawals from your investments for steady income.", icon: "💸" },
    { name: "Inflation Calculator", path: "/calculator/inflation-calculator", description: "Estimate how inflation will affect the cost of items and your purchasing power.", icon: "🔥" },
    { name: "Target Amount Calculator", path: "/calculator/target-amount-calculator", description: "Find out how much to invest today to reach a target amount in the future, considering inflation and returns.", icon: "🎯" },
    { name: "Arbitrage Calculator", path: "/calculator/arbitrage-calculator", description: "Arbitrage calculator allows you to enter the odds of two (or more) different bets to determine how much you should stake on each to guarantee a profit.", icon: "⚖️" },
    { name: "Currency Conversion Calculator", path: "/calculator/currency-calculator", description: "Convert currencies instantly with real-time exchange rates. Easily switch between different currencies for accurate conversions.", icon: "💱" },
    { name: "Retirement Calculator", path: "/calculator/retirement-calculator", description: "Plan your retirement savings and estimate how much you need to save monthly to achieve your retirement goals.", icon: "👴" },
    { name: "Tax Calculator", path: "/calculator/tax-calculator", description: "Estimate your income tax liability and plan your tax savings investments effectively.", icon: "📝" },
    { name: "AI Calculator", path: "/calculator/ai-calculator", description: "Ai Based Calculation", icon: "📝" },
  ];

  // Filter calculators based on search query
  const filteredCalculators = calculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.15)"
    }
  };

  const headingVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 py-10 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          <h1 className="text-4xl font-bold text-white mb-2 mt-20">Financial Calculators</h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-300 mb-8 text-lg">
            Choose from a variety of calculators to manage your financial goals.
          </p>
        </motion.div>

        {/* Search Bar with Animation */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="relative w-full max-w-md group">
            <input
              type="text"
              className="w-full px-6 py-3 pl-12 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all duration-300 shadow-md bg-white border border-gray-300"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Display filtered calculators */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCalculators.length === 0 ? (
            <motion.p 
              className="text-white font-semibold text-lg col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No calculators found for "{searchQuery}". Try a different search term.
            </motion.p>
          ) : (
            filteredCalculators.map((calc, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
              >
                <Link
                  to={calc.path}
                  className="block bg-white bg-opacity-10 shadow-xl rounded-lg p-6 transition-all duration-300 h-full"
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-4 bg-green-700 bg-opacity-30 p-2 rounded-full h-14 w-14 flex items-center justify-center">
                      {calc.icon}
                    </span>
                    <div className="text-left flex-1">
                      <h2 className="text-xl font-semibold text-white mb-2">{calc.name}</h2>
                      <p className="text-gray-400 text-sm">{calc.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-yellow-400 font-semibold flex items-center justify-end">
                    <span>Explore</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "mirror", 
                        duration: 1,
                        ease: "easeInOut"
                      }}
                      className="ml-1"
                    >
                      →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Floating action button */}
        {/* <motion.button
          className="fixed bottom-8 right-8 bg-yellow-500 text-black rounded-full p-4 shadow-lg z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button> */}
      </div>
    </div>
  );
};

export default CalculatorHome;