import React from "react";
import Footer from "../../footer/Footer";
import HomeNavbar from "../homenavbar/homenavbar";

const HomePricing = () => {
  const walletAddress = "0x3E09abaCA3a9F2f51201C411DdCb1c56007AEFE2"; // Replace with your actual wallet address
  const totalProjectCost = 11.26; // Replace with the updated cost whenever needed

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied to clipboard!");
  };

  return (
    <>
    <HomeNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 text-center">
        {/* Pricing Header */}
        <p className="text-lg text-gray-400 mb-8">
          This project was created with a vision to provide a platform where users could get the help they need, 
          absolutely free of cost. Our mission is to make information and tools accessible to everyone without any financial barriers.
        </p>

        {/* Cost Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 inline-block">
          <p className="text-sm text-gray-400">Total Cost Spent on the Project:</p>
          <p className="text-xl font-semibold mt-2">${totalProjectCost}</p>
        </div>

        {/* Donation Section */}
        <div className="mt-8 text-sm text-gray-400">
          <p>
            If you'd like to support this initiative, feel free to donate to the wallet address below. 
            Every contribution helps keep this service running and free for everyone!
          </p>
          <p className="text-green-400 font-mono mt-4 break-all">{walletAddress}</p>
          <button
            onClick={copyToClipboard}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Copy Wallet Address
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HomePricing;
