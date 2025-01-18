import React, { useState } from "react";

const ArbitrageCalculator = () => {
  const [bets, setBets] = useState([{ betOdds: "" }, { betOdds: "" }]);
  const [stake, setStake] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [stakePerBet, setStakePerBet] = useState([0, 0]);

  // Add a new bet field
  const addBet = () => {
    setBets([...bets, { betOdds: "" }]);
  };

  // Remove a bet field
  const removeBet = (index) => {
    const updatedBets = bets.filter((_, i) => i !== index);
    setBets(updatedBets);
  };

  // Handle bet inputs and calculations
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedBets = [...bets];
    updatedBets[index][name] = value;
    setBets(updatedBets);
  };

  // Handle stake input
  const handleStakeChange = (e) => {
    setStake(e.target.value);
  };

  // Calculate the arbitrage stake distribution
  const calculateArbitrage = () => {
    // Ensure the user has entered valid stake and odds values
    const odds1 = parseFloat(bets[0].betOdds);
    const odds2 = parseFloat(bets[1].betOdds);

    if (isNaN(odds1) || isNaN(odds2) || isNaN(stake) || stake <= 0) {
      alert("Please enter valid values for the odds and stake.");
      return;
    }

    // Calculate the total odds sum for dividing stake
    const totalOdds = odds1 + odds2;

    // Calculate stake for each bet (proportional to the odds)
    const stakeBet1 = ((odds2 / totalOdds) * stake).toFixed(2);
    const stakeBet2 = ((odds1 / totalOdds) * stake).toFixed(2);

    setStakePerBet([stakeBet1, stakeBet2]);

    // Calculate the potential payouts
    const payoutBet1 = (parseFloat(stakeBet1) * odds1).toFixed(2);
    const payoutBet2 = (parseFloat(stakeBet2) * odds2).toFixed(2);

    // Determine the total payout and profit
    const totalPayout = Math.max(payoutBet1, payoutBet2);
    const totalProfit = totalPayout - stake;
    const roi = ((totalProfit / stake) * 100).toFixed(2);

    setTotalPayout(totalPayout);
    setTotalProfit(totalProfit.toFixed(2));
    setRoi(roi);
  };

  // Reset the form
  const resetForm = () => {
    setBets([{ betOdds: "" }, { betOdds: "" }]);
    setStake(0);
    setTotalPayout(0);
    setTotalProfit(0);
    setRoi(0);
    setStakePerBet([0, 0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-blue-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center space-x-8">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Arbitrage Calculator
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Calculate your potential profits from betting arbitrage opportunities.
          </p>

          {/* Betting Form */}
          {bets.map((bet, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Bet {index + 1} Odds
                </label>
                <input
                  type="number"
                  name="betOdds"
                  value={bet.betOdds}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
                  placeholder="Enter Bet Odds"
                />
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeBet(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove Bet {index + 1}
                </button>
              )}
            </div>
          ))}

          {/* Add More Bets */}
          <button
            type="button"
            onClick={addBet}
            className="w-full py-2 px-4 mt-4 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Add More Bets
          </button>

          {/* Total Stake Input */}
          <div className="mt-4">
            <label className="block text-gray-300 font-medium mb-2">
              Total Stake
            </label>
            <input
              type="number"
              value={stake}
              onChange={handleStakeChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-400 text-black text-lg"
              placeholder="Enter Total Stake"
            />
          </div>

          {/* Calculate and Reset */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={calculateArbitrage}
              className="w-full py-2 px-4 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Calculate Arbitrage
            </button>
            <button
              onClick={resetForm}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          <div className="mt-6 bg-gray-800 bg-opacity-50 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
              Results
            </h2>
            <div className="space-y-2">
              <p className="text-gray-200">
                Total Stake: <span className="font-bold text-white">${stake}</span>
              </p>
              <p className="text-gray-200">
                Total Payout: <span className="font-bold text-white">${totalPayout}</span>
              </p>
              <p className="text-gray-200">
                Total Profit: <span className="font-bold text-white">${totalProfit}</span>
              </p>
              <p className="text-gray-200">
                ROI: <span className="font-bold text-white">{roi}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stake per Bet */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">
            Stake per Bet
          </h2>
          <div className="space-y-4">
            {bets.map((bet, index) => (
              <div key={index}>
                <label className="block text-gray-300 font-medium mb-2">
                  Bet {index + 1} Stake
                </label>
                <input
                  type="text"
                  value={stakePerBet[index] || "0.00"}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageCalculator;
