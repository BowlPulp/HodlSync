import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualRate, setAnnualRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [futureValue, setFutureValue] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const r = annualRate / 100 / 12; // Monthly interest rate
    const n = timePeriod * 12; // Total months

    const FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n; // Total invested amount
    const growth = FV - invested; // Growth from investment

    setFutureValue(FV.toFixed(2));
    setInvestedAmount(invested.toFixed(2));
    setTotalGrowth(growth.toFixed(2));
  };

  const data = {
    labels: ["Invested Amount", "Growth"],
    datasets: [
      {
        data: [investedAmount, totalGrowth],
        backgroundColor: ["#4ADE80", "#60A5FA"], // Tailwind green and blue
        hoverBackgroundColor: ["#34D399", "#3B82F6"],
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-4">SIP Calculator</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Monthly Investment (₹)
        </label>
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(+e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Expected Returns (Annual %) 
        </label>
        <input
          type="number"
          value={annualRate}
          onChange={(e) => setAnnualRate(+e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Time Period (Years)
        </label>
        <input
          type="number"
          value={timePeriod}
          onChange={(e) => setTimePeriod(+e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <button
        onClick={calculateSIP}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
      >
        Calculate
      </button>

      {futureValue > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            Results
          </h2>
          <p className="text-gray-700 mb-2">
            Future Value: <span className="font-bold">₹{futureValue}</span>
          </p>
          <p className="text-gray-700 mb-2">
            Invested Amount: <span className="font-bold">₹{investedAmount}</span>
          </p>
          <p className="text-gray-700 mb-2">
            Total Growth: <span className="font-bold">₹{totalGrowth}</span>
          </p>
          <div className="mt-4">
            <Doughnut data={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SipCalculator;
