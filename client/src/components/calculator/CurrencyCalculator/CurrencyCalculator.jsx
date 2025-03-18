import React, { useState, useEffect } from "react";
import axios from "axios";

// Currency names mapping
const currencyNames = {
  USD: "US Dollar",  
  AED: "United Arab Emirates Dirham",  
  AFN: "Afghan Afghani",  
  ALL: "Albanian Lek",  
  AMD: "Armenian Dram",  
  ANG: "Netherlands Antillean Guilder",  
  AOA: "Angolan Kwanza",  
  ARS: "Argentine Peso",  
  AUD: "Australian Dollar",  
  AWG: "Aruban Florin",  
  AZN: "Azerbaijani Manat",  
  BAM: "Bosnia-Herzegovina Convertible Mark",  
  BBD: "Barbadian Dollar",  
  BDT: "Bangladeshi Taka",  
  BGN: "Bulgarian Lev",  
  BHD: "Bahraini Dinar",  
  BIF: "Burundian Franc",  
  BMD: "Bermudian Dollar",  
  BND: "Brunei Dollar",  
  BOB: "Bolivian Boliviano",  
  BRL: "Brazilian Real",  
  BSD: "Bahamian Dollar",  
  BTN: "Bhutanese Ngultrum",  
  BWP: "Botswana Pula",  
  BYN: "Belarusian Ruble",  
  BZD: "Belize Dollar",  
  CAD: "Canadian Dollar",  
  CDF: "Congolese Franc",  
  CHF: "Swiss Franc",  
  CLP: "Chilean Peso",  
  CNY: "Chinese Yuan",  
  COP: "Colombian Peso",  
  CRC: "Costa Rican Colón",  
  CUP: "Cuban Peso",  
  CVE: "Cape Verdean Escudo",  
  CZK: "Czech Koruna",  
  DJF: "Djiboutian Franc",  
  DKK: "Danish Krone",  
  DOP: "Dominican Peso",  
  DZD: "Algerian Dinar",  
  EGP: "Egyptian Pound",  
  ERN: "Eritrean Nakfa",  
  ETB: "Ethiopian Birr",  
  EUR: "Euro",  
  FJD: "Fijian Dollar",  
  FKP: "Falkland Islands Pound",  
  FOK: "Faroese Króna",  
  GBP: "British Pound Sterling",  
  GEL: "Georgian Lari",  
  GGP: "Guernsey Pound",  
  GHS: "Ghanaian Cedi",  
  GIP: "Gibraltar Pound",  
  GMD: "Gambian Dalasi",  
  GNF: "Guinean Franc",  
  GTQ: "Guatemalan Quetzal",  
  GYD: "Guyanese Dollar",  
  HKD: "Hong Kong Dollar",  
  HNL: "Honduran Lempira",  
  HRK: "Croatian Kuna",  
  HTG: "Haitian Gourde",  
  HUF: "Hungarian Forint",  
  IDR: "Indonesian Rupiah",  
  ILS: "Israeli New Shekel",  
  IMP: "Isle of Man Pound",  
  INR: "Indian Rupee",  
  IQD: "Iraqi Dinar",  
  IRR: "Iranian Rial",  
  ISK: "Icelandic Króna",  
  JEP: "Jersey Pound",  
  JMD: "Jamaican Dollar",  
  JOD: "Jordanian Dinar",  
  JPY: "Japanese Yen",  
  KES: "Kenyan Shilling",  
  KGS: "Kyrgyzstani Som",  
  KHR: "Cambodian Riel",  
  KID: "Kiribati Dollar",  
  KMF: "Comorian Franc",  
  KRW: "South Korean Won",  
  KWD: "Kuwaiti Dinar",  
  KYD: "Cayman Islands Dollar",  
  KZT: "Kazakhstani Tenge",  
  LAK: "Lao Kip",  
  LBP: "Lebanese Pound",  
  LKR: "Sri Lankan Rupee",  
  LRD: "Liberian Dollar",  
  LSL: "Lesotho Loti",  
  LYD: "Libyan Dinar",  
  MAD: "Moroccan Dirham",  
  MDL: "Moldovan Leu",  
  MGA: "Malagasy Ariary",  
  MKD: "Macedonian Denar",  
  MMK: "Myanmar Kyat",  
  MNT: "Mongolian Tögrög",  
  MOP: "Macanese Pataca",  
  MRU: "Mauritanian Ouguiya",  
  MUR: "Mauritian Rupee",  
  MVR: "Maldivian Rufiyaa",  
  MWK: "Malawian Kwacha",  
  MXN: "Mexican Peso",  
  MYR: "Malaysian Ringgit",  
  MZN: "Mozambican Metical",  
  NAD: "Namibian Dollar",  
  NGN: "Nigerian Naira",  
  NIO: "Nicaraguan Córdoba",  
  NOK: "Norwegian Krone",  
  NPR: "Nepalese Rupee",  
  NZD: "New Zealand Dollar",  
  OMR: "Omani Rial",  
  PAB: "Panamanian Balboa",  
  PEN: "Peruvian Sol",  
  PGK: "Papua New Guinean Kina",  
  PHP: "Philippine Peso",  
  PKR: "Pakistani Rupee",  
  PLN: "Polish Złoty",  
  PYG: "Paraguayan Guaraní",  
  QAR: "Qatari Rial",  
  RON: "Romanian Leu",  
  RSD: "Serbian Dinar",  
  RUB: "Russian Ruble",  
  RWF: "Rwandan Franc",  
  SAR: "Saudi Riyal",  
  SBD: "Solomon Islands Dollar",  
  SCR: "Seychellois Rupee",  
  SDG: "Sudanese Pound",  
  SEK: "Swedish Krona",  
  SGD: "Singapore Dollar",  
  SHP: "Saint Helena Pound",  
  SLE: "Sierra Leonean Leone",  
  SLL: "Sierra Leonean Leone",  
  SOS: "Somali Shilling",  
  SRD: "Surinamese Dollar",  
  SSP: "South Sudanese Pound",  
  STN: "São Tomé and Príncipe Dobra",  
  SYP: "Syrian Pound",  
  SZL: "Eswatini Lilangeni",  
  THB: "Thai Baht",  
  TJS: "Tajikistani Somoni",  
  TMT: "Turkmenistani Manat",  
  TND: "Tunisian Dinar",  
  TOP: "Tongan Paʻanga",  
  TRY: "Turkish Lira",  
  TTD: "Trinidad and Tobago Dollar",  
  TVD: "Tuvaluan Dollar",  
  TWD: "New Taiwan Dollar",  
  TZS: "Tanzanian Shilling",  
  UAH: "Ukrainian Hryvnia",  
  UGX: "Ugandan Shilling",  
  UYU: "Uruguayan Peso",  
  UZS: "Uzbekistani Soʻm",  
  VES: "Venezuelan Bolívar",  
  VND: "Vietnamese Đồng",  
  VUV: "Vanuatu Vatu",  
  WST: "Samoan Tālā",  
  XAF: "Central African CFA Franc",  
  XCD: "East Caribbean Dollar",  
  XDR: "Special Drawing Rights",  
  XOF: "West African CFA Franc",  
  XPF: "CFP Franc",  
  YER: "Yemeni Rial",  
  ZAR: "South African Rand",  
  ZMW: "Zambian Kwacha",  
  ZWL: "Zimbabwean Dollar"  
  };
  

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

  // Get full currency name
  const getCurrencyName = (code) => {
    return currencyNames[code] ? `${code} - ${currencyNames[code]}` : code;
  };

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
                {getCurrencyName(currency)}
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
                {getCurrencyName(currency)}
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
            className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {convertedAmount !== null && !loading && (
          <div className="mt-4 text-white text-center p-3 bg-gray-800 rounded-lg">
            <p className="text-lg">
              <span className="font-semibold">{amount}</span> {getCurrencyName(fromCurrency).split(' - ')[0]} = 
              <span className="font-semibold text-green-400 ml-2">{convertedAmount}</span> {getCurrencyName(toCurrency).split(' - ')[0]}
            </p>
            {currencyNames[fromCurrency] && currencyNames[toCurrency] && (
              <p className="text-sm text-gray-300 mt-1">
                {currencyNames[fromCurrency]} to {currencyNames[toCurrency]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;