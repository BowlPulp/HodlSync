import React from "react";
import { Link } from "react-router-dom";

const CalculatorHome = () => {
  const calculators = [
    { name: "SIP & Lumpsum Calculator", path: "/calculator/sip-calculator", description: "Plan and estimate returns on your SIP and lump sum investments to reach your financial goals." },
    { name: "Loan Calculator", path: "/calculator/loan-calculator", description: "Calculate your loan EMIs easily based on principal, interest rate, and tenure." },
    { name: "Simple Interest Calculator", path: "/calculator/simple-interest-calculator", description: "Estimate your returns with simple interest on your investment." },
    { name: "Compound Interest Calculator", path: "/calculator/compound-interest-calculator", description: "Calculate returns with compound interest and visualize wealth growth over time." },
    { name: "FD Calculator", path: "/calculator/fd-calculator", description: "Calculate the returns on your Fixed Deposit based on amount, tenure, and interest rate." },
    { name: "SWP Calculator", path: "/calculator/swp-calculator", description: "Plan and manage regular withdrawals from your investments for steady income." },
    { name: "Inflation Calculator", path: "/calculator/inflation-calculator", description: "Estimate how inflation will affect the cost of items and your purchasing power." },
    { name: "Target Amount Calculator", path: "/calculator/target-amount-calculator", description: "Find out how much to invest today to reach a target amount in the future, considering inflation and returns." },
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
              className="bg-gray-400 shadow-lg rounded-lg p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1"
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
