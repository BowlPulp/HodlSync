import React, { useState } from "react";
import Footer from "../../footer/Footer";
import HomeNavbar from "../HomeNavbar/HomeNavbar";

const HomePricing = () => {
  const walletAddress = "0x3E09abaCA3a9F2f51201C411DdCb1c56007AEFE2";
  const totalProjectCost = 11.26;
  
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Main Content Card */}
          <div className="mt-8 max-w-4xl mx-auto bg-gray-800/80 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            {/* Header Section with Glowing Effect */}
            <div className="relative px-6 pt-10 pb-8 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500"></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                Supporting Our Free Platform
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                This project was created with a vision to provide a platform where users could get the help they need, 
                absolutely free of cost. Our mission is to make information and tools accessible to everyone without any financial barriers.
              </p>
            </div>
            
            {/* Project Cost Section */}
            <div className="px-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">
                <div className="bg-gray-900/80 p-8 rounded-xl shadow-lg border border-gray-700 w-full">
                  <h2 className="text-xl font-semibold mb-3 text-blue-300">Project Expenses</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-gray-300">Server Costs</span>
                      <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-gray-300">Logo Design</span>
                      <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-gray-300">Domain Name</span>
                      <span className="text-green-400 font-medium">$11.26</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2">
                      <span className="text-lg font-medium text-white">Total Cost</span>
                      <span className="text-xl font-bold text-white">${totalProjectCost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallet Address Section */}
            <div className="px-6 pb-10">
              <div className="bg-gray-900/80 p-6 rounded-xl shadow-lg border border-gray-700">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                    <h2 className="text-xl font-semibold mb-3 text-blue-300">
                      Cryptocurrency Donation
                    </h2>
                    <p className="text-gray-300 mb-4">
                      If you'd like to support this initiative, feel free to donate to the wallet address below. 
                      Every contribution helps keep this service running and free for everyone!
                    </p>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 font-mono text-green-400 break-all mb-4">
                      {walletAddress}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                      >
                        {copied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Address
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowQR(!showQR)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        {showQR ? "Hide QR Code" : "Show QR Code"}
                      </button>
                    </div>
                  </div>
                  
                  {showQR && (
                    <div className="md:w-1/3 flex justify-center">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="w-40 h-40 bg-gradient-to-r  flex items-center justify-center text-white text-xs text-center p-2">
                      <img src="/walletaddy.png" />
                         
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Testimonials/Thanks Section
            <div className="px-6 pb-10">
              <h2 className="text-xl font-semibold mb-6 text-center text-blue-300">
                Thank You to Our Supporters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-300 italic mb-2">
                      "This platform has been incredibly helpful. Happy to support!"
                    </p>
                    <p className="text-right text-green-400 font-medium">- Supporter #{i}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePricing;