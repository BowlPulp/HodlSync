import React, { useState } from "react";
import { Link } from "react-router-dom";

const CalculatorHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const calculators = [
    { name: "SIP & Lumpsum Calculator", path: "/calculator/sip-calculator", description: "Plan and estimate returns on your SIP and lump sum investments to reach your financial goals." },
    { name: "Loan Calculator", path: "/calculator/loan-calculator", description: "Calculate your loan EMIs easily based on principal, interest rate, and tenure." },
    { name: "Simple Interest Calculator", path: "/calculator/simple-interest-calculator", description: "Estimate your returns with simple interest on your investment." },
    { name: "Compound Interest Calculator", path: "/calculator/compound-interest-calculator", description: "Calculate returns with compound interest and visualize wealth growth over time." },
    { name: "FD Calculator", path: "/calculator/fd-calculator", description: "Calculate the returns on your Fixed Deposit based on amount, tenure, and interest rate." },
    { name: "SWP Calculator", path: "/calculator/swp-calculator", description: "Plan and manage regular withdrawals from your investments for steady income." },
    { name: "Inflation Calculator", path: "/calculator/inflation-calculator", description: "Estimate how inflation will affect the cost of items and your purchasing power." },
    { name: "Target Amount Calculator", path: "/calculator/target-amount-calculator", description: "Find out how much to invest today to reach a target amount in the future, considering inflation and returns." },
    { name: "Arbitrage Calculator", path: "/calculator/arbitrage-calculator", description: "Arbitrage calculator allows you to enter the odds of two (or more) different bets to determine how much you should stake on each to guarantee a profit." },
    { name: "Currency Conversion Calculator", path: "/calculator/currency-calculator", description: "Convert currencies instantly with real-time exchange rates. Easily switch between different currencies for accurate conversions." },
  ];

  // Filter calculators based on search query
  const filteredCalculators = calculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 py-10">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-6 mt-20">Financial Calculators</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Choose from a variety of calculators to manage your financial goals.
        </p>

          {/* Search Bar */}
  <div className="mb-8 flex justify-center">
    <div className="relative w-full max-w-md">
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
    </div>
  </div>


        {/* Display filtered calculators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCalculators.length === 0 ? (
            <p className="text-white font-semibold text-lg">No calculators found.</p>
          ) : (
            filteredCalculators.map((calc, index) => (
              <Link
                to={calc.path}
                key={index}
                className="bg-white bg-opacity-10 shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-opacity-20"
              >
                <h2 className="text-2xl font-semibold text-white mb-2">{calc.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{calc.description}</p>
                <div className="mt-4 text-blue-500 font-semibold hover:underline">
                  Explore →
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorHome;
