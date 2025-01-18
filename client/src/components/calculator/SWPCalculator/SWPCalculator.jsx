import React, { useState, useEffect } from "react";

const SWPCalculator = () => {
  const [principal, setPrincipal] = useState(100000); // Initial Investment
  const [annualRate, setAnnualRate] = useState(7); // Annual Interest Rate
  const [timePeriod, setTimePeriod] = useState(10); // Time Period in Years
  const [withdrawal, setWithdrawal] = useState(5000); // Monthly Withdrawal Amount
  const [remainingBalance, setRemainingBalance] = useState(0); // Remaining Balance
  const [totalWithdrawn, setTotalWithdrawn] = useState(0); // Total Withdrawn Amount

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateSWP = () => {
    const monthlyRate = annualRate / (12 * 100); // Monthly Interest Rate
    const months = timePeriod * 12; // Total Months
    let balance = principal; // Remaining Balance
    let totalWithdrawals = 0;

    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate; // Monthly Interest
      balance = balance + interest - withdrawal; // Add Interest, Deduct Withdrawal

      if (balance < 0) {
        totalWithdrawals += withdrawal + balance; // Adjust Final Partial Withdrawal
        balance = 0;
        break;
      } else {
        totalWithdrawals += withdrawal;
      }
    }

    setTotalWithdrawn(totalWithdrawals);
    setRemainingBalance(balance);
  };

  useEffect(() => {
    calculateSWP();
  }, [principal, annualRate, timePeriod, withdrawal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex items-center justify-center p-8 pt-24">
      <div className="max-w-2xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col space-y-8">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Systematic Withdrawal Plan Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate how much you can withdraw systematically and what remains
            of your investment.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Principal Amount (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="1000"
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
                  max="15"
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

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Monthly Withdrawal (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="100"
                  value={withdrawal}
                  onChange={(e) => setWithdrawal(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={withdrawal}
                  onChange={(e) => setWithdrawal(Number(e.target.value))}
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
              Total Withdrawn Amount:{" "}
              <span className="font-bold text-white">₹{formatNumber(totalWithdrawn)}</span>
            </p>
            <p className="text-gray-200">
              Remaining Balance:{" "}
              <span className="font-bold text-white">₹{formatNumber(remainingBalance)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
