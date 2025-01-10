import React from "react";
import { Link } from "react-router-dom";

const CalculatorHome = () => {
  const calculators = [
    { name: "SIP Calculator", path: "/calculator/sip-calculator", description: "Plan your investments effectively." },
    { name: "Loan Calculator", path: "/calculator/loan-calculator", description: "Calculate your loan EMIs easily." },
    { name: "FD Calculator", path: "/calculator/fd-calculator", description: "Estimate your fixed deposit returns." },
    { name: "Retirement Calculator", path: "/calculator/retirement-calculator", description: "Secure your future with better planning." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-6 mt-20">Financial Calculators</h1>
        <p className="text-gray-600 mb-8">
          Choose from a variety of calculators to manage your financial goals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {calculators.map((calc, index) => (
            <Link
              to={calc.path}
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">{calc.name}</h2>
              <p className="text-gray-600 mt-2">{calc.description}</p>
              <div className="mt-4 text-blue-500 font-bold">Explore →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorHome;
