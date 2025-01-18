import React, { useState, useEffect } from "react";

const TargetAmountCalculator = () => {
  const [targetAmount, setTargetAmount] = useState(10000); // Desired future value
  const [inflationRate, setInflationRate] = useState(5); // Annual Inflation Rate
  const [returnRate, setReturnRate] = useState(8); // Expected Return Rate
  const [timePeriod, setTimePeriod] = useState(10); // Time Period in Years
  const [investmentNeeded, setInvestmentNeeded] = useState(0); // Investment required today
  const [interestType, setInterestType] = useState("compound"); // Interest Type: Simple or Compound

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateInvestment = () => {
    // Adjust target amount for inflation
    const inflatedTarget = targetAmount * Math.pow(1 + inflationRate / 100, timePeriod);

    let investment;

    // Simple Interest Calculation
    if (interestType === "simple") {
      investment = inflatedTarget / (1 + (returnRate / 100) * timePeriod);
    }
    // Compound Interest Calculation
    else {
      investment = inflatedTarget / Math.pow(1 + returnRate / 100, timePeriod);
    }

    setInvestmentNeeded(investment);
  };

  useEffect(() => {
    calculateInvestment();
  }, [targetAmount, inflationRate, returnRate, timePeriod, interestType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-2xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col space-y-8">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Target Amount Investment Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate how much you need to invest today to reach your target amount considering inflation and expected returns.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Target Amount (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  step="1000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Annual Inflation Rate (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Expected Return Rate (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
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
                  max="50"
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

            {/* Interest Type Selection */}
            <div className="space-x-4">
              <label className="inline-flex items-center text-gray-300">
                <input
                  type="radio"
                  value="simple"
                  checked={interestType === "simple"}
                  onChange={() => setInterestType("simple")}
                  className="form-radio text-yellow-400"
                />
                <span className="ml-2">Simple Interest</span>
              </label>
              <label className="inline-flex items-center text-gray-300">
                <input
                  type="radio"
                  value="compound"
                  checked={interestType === "compound"}
                  onChange={() => setInterestType("compound")}
                  className="form-radio text-yellow-400"
                />
                <span className="ml-2">Compound Interest</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
            Results
          </h2>
          <div className="space-y-2">
            <p className="text-gray-200">
              Target Amount:{" "}
              <span className="font-bold text-white">₹{formatNumber(targetAmount)}</span>
            </p>
            <p className="text-gray-200">
              Inflated Target Amount After {timePeriod} Years(Amount Saved): {" "}
              <span className="font-bold text-white">₹{formatNumber(targetAmount * Math.pow(1 + inflationRate / 100, timePeriod))}</span>
            </p>
            <p className="text-gray-200">
              Amount to Invest Today:{" "}
              <span className="font-bold text-white">₹{formatNumber(investmentNeeded)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetAmountCalculator;
