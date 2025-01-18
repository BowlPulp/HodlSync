import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FDCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(5);
  const [timePeriod, setTimePeriod] = useState(2);
  const [compoundInterest, setCompoundInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateCompoundInterest = () => {
    const n = 4; // Quarterly compounding
    const ratePerPeriod = annualRate / (n * 100);
    const totalPeriods = timePeriod * n;

    const total = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
    const CI = total - principal;

    setCompoundInterest(CI);
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, annualRate, timePeriod]);

  const investedPercentage = (principal / totalAmount) * 100;
  const interestPercentage = 100 - investedPercentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center space-x-8">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Fixed Deposit (FD) Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate the Compound Interest and Total Amount for your Fixed Deposit.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Principal Amount (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100"
                  max="1000000"
                  step="100"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Annual Rate of Interest (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Time Period (Years)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                />
              </div>
            </div>
          </div>

          {compoundInterest > 0 && (
            <div className="mt-6 bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
                Results
              </h2>
              <div className="space-y-2">
                <p className="text-gray-200">
                  Principal Amount: <span className="font-bold text-white">₹{formatNumber(principal)}</span>
                </p>
                <p className="text-gray-200">
                  Compound Interest: <span className="font-bold text-white">₹{formatNumber(compoundInterest)}</span>
                </p>
                <p className="text-gray-200">
                  Total Amount: <span className="font-bold text-white">₹{formatNumber(totalAmount)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {compoundInterest > 0 && (
          <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4">
            <div className="w-48 h-48">
              <CircularProgressbar
                value={investedPercentage}
                maxValue={100}
                text=""
                styles={buildStyles({
                  pathColor: "#fbbf24",
                  trailColor: "#4c4f56",
                  textColor: "#ffffff",
                  textSize: "16px",
                })}
              />
            </div>
            <div className="flex space-x-6">
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-4 h-4 rounded-full bg-yellow-600 mb-2"></div>
                <p>Principal Amount</p>
              </div>
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
                <p>Compound Interest</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FDCalculator;
