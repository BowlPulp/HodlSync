import React from 'react';
import { motion } from 'framer-motion';

const AboutHodlSync = () => {
  return (
    <section className="py-12 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          HODLSync
        </motion.h2>

        <motion.p
          className="text-lg mb-6 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          HODLSync is the ultimate platform for crypto enthusiasts to effortlessly track and manage all your wallet addresses in one place. Whether you hold coins across multiple wallets or exchanges, HODLSync gives you a comprehensive overview of your portfolio's performance.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-lg shadow-lg text-center">
            <motion.h3
              className="text-2xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Track Multiple Wallets
            </motion.h3>
            <p className="text-lg text-neutral-200">
              With HODLSync, you can easily add and track multiple wallet addresses. All your wallets are synced into a single dashboard, making it easy to monitor your portfolio's value.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-lg shadow-lg text-center">
            <motion.h3
              className="text-2xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Wallet Balance Insights
            </motion.h3>
            <p className="text-lg text-neutral-200">
              Get a detailed summary of all your balances across different wallets. We show you your total crypto holdings, including breakdowns per wallet and asset type, so you can easily see where your value is stored.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-lg shadow-lg text-center">
          <motion.h3
            className="text-2xl font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Portfolio Analytics & Graphs
          </motion.h3>
          <p className="text-lg text-neutral-200 mb-4">
            Visualize your crypto portfolio's performance with interactive charts and graphs. HODLSync helps you analyze trends over time, spot potential growth, and track your portfolio's gains or losses.
          </p>
          {/* <motion.button
            className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Get Started with HODLSync
          </motion.button> */}
        </div>
      </div>
    </section>
  );
};

export default AboutHodlSync;
