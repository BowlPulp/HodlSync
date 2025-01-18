import React, { useState, useEffect } from "react";

const InflationCalculator = () => {
  const [currentValue, setCurrentValue] = useState(10000); // Initial value
  const [inflationRate, setInflationRate] = useState(5); // Annual Inflation Rate
  const [timePeriod, setTimePeriod] = useState(5); // Time Period in Years
  const [inflatedValue, setInflatedValue] = useState(0); // Inflated Value after inflation
  const [costIncrease, setCostIncrease] = useState(0); // Total cost increase

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateInflation = () => {
    const inflated = currentValue * Math.pow(1 + inflationRate / 100, timePeriod);
    const increase = inflated - currentValue;

    setInflatedValue(inflated);
    setCostIncrease(increase);
  };

  useEffect(() => {
    calculateInflation();
  }, [currentValue, inflationRate, timePeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-2xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col space-y-8">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Inflation Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate the effect of inflation on your current value over time.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Current Value (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  step="1000"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
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
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
            Results
          </h2>
          <div className="space-y-2">
            <p className="text-gray-200">
              Current Value:{" "}
              <span className="font-bold text-white">₹{formatNumber(currentValue)}</span>
            </p>
            <p className="text-gray-200">
              Cost Increase Due to Inflation:{" "}
              <span className="font-bold text-white">₹{formatNumber(costIncrease)}</span>
            </p>
            <p className="text-gray-200">
              Inflated Value After {timePeriod} Years:{" "}
              <span className="font-bold text-white">₹{formatNumber(currentValue-costIncrease)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
