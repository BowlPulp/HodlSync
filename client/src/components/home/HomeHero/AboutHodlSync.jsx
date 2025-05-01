import React from 'react';
import { motion } from 'framer-motion';

const AboutHodlSync = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      repeatType: "reverse" 
    }
  };

  return (
    <section className="py-16 bg-black text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-500"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, 15, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-indigo-600"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-500"
          >
            HODLSync
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl mb-8 text-center max-w-3xl mx-auto leading-relaxed"
          >
            HODLSync is the ultimate platform for crypto enthusiasts to effortlessly track and manage all your wallet addresses in one place. Whether you hold coins across multiple wallets or exchanges, HODLSync gives you a comprehensive overview of your portfolio's performance.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={pulseAnimation}
            className="bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-xl shadow-lg text-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative ">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Track Multiple Wallets</h3>
              <p className="text-lg text-neutral-100 leading-relaxed">
                With HODLSync, you can easily add and track multiple wallet addresses. All your wallets are synced into a single dashboard, making it easy to monitor your portfolio's value.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={pulseAnimation}
            className="bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-xl shadow-lg text-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Wallet Balance Insights</h3>
              <p className="text-lg text-neutral-100 leading-relaxed">
                Get a detailed summary of all your balances across different wallets. We show you your total crypto holdings, including breakdowns per wallet and asset type, so you can easily see where your value is stored.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={pulseAnimation}
            className="bg-gradient-to-br from-green-600 to-indigo-800 p-8 rounded-xl shadow-lg text-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Portfolio Analytics & Graphs</h3>
              <p className="text-lg text-neutral-100 leading-relaxed mb-6">
                Visualize your crypto portfolio's performance with interactive charts and graphs. HODLSync helps you analyze trends over time, spot potential growth, and track your portfolio's gains or losses.
              </p>
              <motion.button
                className="bg-gradient-to-r from-green-500 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-green-600 hover:to-indigo-700 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started with HODLSync
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            variants={fadeInUp}
          >
            <p className="text-green-400 font-medium mb-2">Join thousands of crypto enthusiasts</p>
            <h4 className="text-2xl font-bold text-white mb-6">Start tracking your portfolio today</h4>
            <div className="flex justify-center space-x-4">
              <motion.div 
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-indigo-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHodlSync;