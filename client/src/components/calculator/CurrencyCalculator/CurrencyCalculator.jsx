import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch currencies on load
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        const data = response.data.rates;
        setCurrencies(Object.keys(data));
      } catch (err) {
        setError("Error fetching currency data.");
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch conversion rate when currencies change
  const fetchConversionRate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      setConversionRate(response.data.rates[toCurrency]);
      const converted = (amount * response.data.rates[toCurrency]).toFixed(2);
      setConvertedAmount(converted);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch conversion rate.");
      setLoading(false);
    }
  };

  // Handle Amount Change
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Handle From Currency Change
  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  // Handle To Currency Change
  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-green-900 py-10 flex justify-center items-center">
      <div className="max-w-lg w-full bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Currency Converter</h2>

        <div className="mb-4">
          <label className="text-white">From Currency</label>
          <select
            className="w-full p-2 mt-2 bg-gray-900 text-white rounded-lg"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white">To Currency</label>
          <select
            className="w-full p-2 mt-2 bg-gray-900 text-white rounded-lg"
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 mt-2 bg-gray-900 text-white rounded-lg"
            min="1"
          />
        </div>

        <div className="mb-4 text-center">
          <button
            onClick={fetchConversionRate}
            className="w-full p-2 bg-green-600 text-white rounded-lg"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {convertedAmount !== null && !loading && (
          <div className="mt-4 text-white text-center">
            <p>
              <span className="font-semibold">{amount}</span> {fromCurrency} ={" "}
              <span className="font-semibold">{convertedAmount}</span> {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
