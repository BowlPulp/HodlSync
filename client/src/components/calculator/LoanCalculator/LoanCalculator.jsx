import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [amortizationPeriod, setAmortizationPeriod] = useState("Monthly");

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateLoan = () => {
    const principal = loanAmount;
    const annualInterest = interestRate / 100;
    const months = loanTenure * 12;

    const monthlyInterestRate = annualInterest / 12;
    const emiAmount =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, months)) /
      (Math.pow(1 + monthlyInterestRate, months) - 1);

    const totalPaid = emiAmount * months;
    const totalInterest = totalPaid - principal;

    setEmi(emiAmount);
    setTotalAmountPaid(totalPaid);
    setTotalInterestPaid(totalInterest);
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTenure]);

  const principalPercentage = ((loanAmount / totalAmountPaid) * 100).toFixed(0);
  const interestPercentage = ((totalInterestPaid / totalAmountPaid) * 100).toFixed(0);

  const generateAmortizationData = () => {
    const months = loanTenure * 12;
    let balance = loanAmount; // Initialize balance with the loan amount
    let amortization = [];

    for (let month = 1; month <= months; month++) {
      const interestPaid = balance * (interestRate / 1200); // Monthly interest rate
      const principalPaid = emi - interestPaid; // Principal is EMI minus interest
      balance -= principalPaid; // Update the balance by deducting the principal

      amortization.push({
        month: month,
        principalPaid: principalPaid.toFixed(0),
        interestPaid: interestPaid.toFixed(0),
        totalPayment: emi.toFixed(0),
        balance: Math.max(0, balance.toFixed(0)), // Ensure balance doesn't go negative
      });
    }
    return amortization;
  };

  const amortizationData = generateAmortizationData();
  const periodData = amortizationPeriod === "Monthly" ? amortizationData : amortizationData.filter((item) => item.month % 12 === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex flex-col items-center justify-start p-6 pt-24 space-y-12">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center space-x-8">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-center text-green-400 mb-4">
            Loan Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate your EMI, Total Amount Paid, and Interest for a loan in real time.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Loan Amount (₹)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Interest Rate (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Loan Tenure (Years)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg"
                />
              </div>
            </div>
          </div>

          {emi > 0 && (
            <div className="mt-6 bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold text-green-400 mb-4 text-center">
                Results
              </h2>
              <div className="space-y-2">
                <p className="text-gray-200">
                  Monthly EMI:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(emi.toFixed(0))}
                  </span>
                </p>
                <p className="text-gray-200">
                  Principal Amount:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(loanAmount.toFixed(0))}
                  </span>
                </p>
                <p className="text-gray-200">
                  Total Interest:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(totalInterestPaid.toFixed(0))}
                  </span>
                </p>
                <p className="text-gray-200">
                  Total Amount:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(totalAmountPaid.toFixed(0))}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {emi > 0 && (
          <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4">
            <div className="w-48 h-48">
              <CircularProgressbar
                value={principalPercentage}
                maxValue={100}
                text=""
                styles={buildStyles({
                  pathColor: "#2d6a4f",
                  trailColor: "#4c4f56",
                  textColor: "#ffffff",
                  textSize: "16px",
                })}
              />
            </div>
            <div className="flex space-x-6">
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-4 h-4 rounded-full bg-green-600 mb-2"></div>
                <p>Principal</p>
              </div>
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
                <p>Interest</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-green-400 text-center mb-4">
          Your Amortization Details
        </h2>
        <div className="mb-4">
          <label className="text-gray-300 font-medium mb-2">View by:</label>
          <select
            value={amortizationPeriod}
            onChange={(e) => setAmortizationPeriod(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-green-400"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">Principal Paid</th>
                <th className="px-4 py-2 text-left">Interest Paid</th>
                <th className="px-4 py-2 text-left">Total Payment</th>
                <th className="px-4 py-2 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {periodData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.month}</td>
                  <td className="px-4 py-2">₹{formatNumber(item.principalPaid)}</td>
                  <td className="px-4 py-2">₹{formatNumber(item.interestPaid)}</td>
                  <td className="px-4 py-2">₹{formatNumber(item.totalPayment)}</td>
                  <td className="px-4 py-2">₹{formatNumber(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
