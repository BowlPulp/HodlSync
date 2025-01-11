import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SipCalculator = () => {
  const [mode, setMode] = useState("sip");
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [lumpSumInvestment, setLumpSumInvestment] = useState(100000);
  const [annualRate, setAnnualRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [futureValue, setFutureValue] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);

  const formatNumber = (num) => {
    return Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateInvestment = () => {
    const r = annualRate / 100 / 12;
    const n = timePeriod * 12;

    if (mode === "sip") {
      const P = monthlyInvestment;
      const FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = P * n;
      const growth = FV - invested;

      setFutureValue(FV);
      setInvestedAmount(invested);
      setTotalGrowth(growth);
    } else if (mode === "lump-sum") {
      const P = lumpSumInvestment;
      const FV = P * Math.pow(1 + annualRate / 100, timePeriod);
      const invested = P;
      const growth = FV - invested;

      setFutureValue(FV);
      setInvestedAmount(invested);
      setTotalGrowth(growth);
    }
  };

  useEffect(() => {
    calculateInvestment();
  }, [monthlyInvestment, lumpSumInvestment, annualRate, timePeriod, mode]);

  const investedPercentage = (investedAmount / (investedAmount + totalGrowth)) * 100;
  const returnsPercentage = 100 - investedPercentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center space-x-8">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-center text-green-400 mb-4">
            Investment Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate your returns for SIP or Lump Sum investments in real time.
          </p>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setMode("sip")}
              className={`px-4 py-2 rounded-md ${
                mode === "sip"
                  ? "bg-green-500 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              SIP
            </button>
            <button
              onClick={() => setMode("lump-sum")}
              className={`px-4 py-2 rounded-md ${
                mode === "lump-sum"
                  ? "bg-green-500 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              Lump Sum
            </button>
          </div>

          <div className="space-y-6">
            {mode === "sip" ? (
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Monthly Investment (₹)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="100"
                    max="1000000" // SIP max value
                    step="100"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(
                        Math.min(Number(e.target.value), 1000000) // SIP max value
                      )
                    }
                    className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg appearance-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Lump Sum Investment (₹)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="100"
                    max="10000000" // Lump sum max value
                    step="100"
                    value={lumpSumInvestment}
                    onChange={(e) =>
                      setLumpSumInvestment(Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={lumpSumInvestment}
                    onChange={(e) =>
                      setLumpSumInvestment(
                        Math.min(Number(e.target.value), 10000000) // Lump sum max value
                      )
                    }
                    className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg appearance-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Expected Annual Returns (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg"
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
                  className="w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400 text-black text-lg"
                />
              </div>
            </div>
          </div>

          {futureValue > 0 && (
            <div className="mt-6 bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold text-green-400 mb-4 text-center">
                Results
              </h2>
              <div className="space-y-2">
                <p className="text-gray-200">
                  Invested Amount:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(investedAmount)}
                  </span>
                </p>
                <p className="text-gray-200">
                  Estimated Returns:{" "}
                  <span className="font-bold text-white">
                    ₹{formatNumber(totalGrowth)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {futureValue > 0 && (
          <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4">
            <div className="w-48 h-48">
              <CircularProgressbar
                value={investedPercentage}
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
                <p>Invested Amount</p>
              </div>
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
                <p>Estimated Returns</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SipCalculator;
