import React, { useState, useEffect } from "react";
import Footer from "../../footer/Footer";
import HomeNavbar from "../HomeNavbar/HomeNavbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";

const HomeLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Particle animation setup
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create particles for background effect
    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }).map(() => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }));
    
    setParticles(newParticles);
    
    // Clean up animations on unmount
    return () => {
      setParticles([]);
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_PORT}api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Login successful!");
        
        // Show success animation before redirect
        setTimeout(() => {
          window.location.href = "/user/home";
        }, 1500);
      } else {
        toast.error(data.error || "Invalid credentials.");
        setMessage(data.error || "Invalid credentials.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <HomeNavbar />
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-gray-800 to-black overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 10 / particle.speed,
                repeat: Infinity,
                ease: "linear",
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row relative z-0 min-h-screen">
          {/* Form section */}
          <motion.div 
            className="w-full md:w-1/2 px-6 md:px-12 lg:px-16"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-screen flex items-center justify-center">
              <motion.div 
                className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/10 shadow-2xl border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-4xl font-bold text-white mb-1">Welcome Back</h2>
                  <p className="text-lg text-gray-300 mb-6">Enter your credentials to access your account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-lg font-medium text-white">Email Address</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg px-4 py-3 bg-black/30 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all duration-300"
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        onChange={handleChange}
                        required
                      />
                      <motion.div 
                        className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-b-lg"
                        initial={{ width: 0 }}
                        animate={{ width: formData.email ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-lg font-medium text-white">Password</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg px-4 py-3 bg-black/30 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all duration-300"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        required
                      />
                      <motion.div 
                        className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-b-lg"
                        initial={{ width: 0 }}
                        animate={{ width: formData.password ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-green-400 hover:text-green-300 transition-all"
                    >
                      Forgot password?
                    </a>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    className="relative w-full rounded-lg py-3 font-semibold text-white overflow-hidden group"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-gradient-to-r from-green-500 to-green-700 group-hover:bg-gradient-to-l"></span>
                    <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-200 ease-out transform translate-x-0 bg-green-600 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-full h-1 transition-all duration-200 ease-out transform -translate-x-0 bg-green-600 group-hover:translate-x-0"></span>
                    <span className="relative">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                          Logging in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </span>
                  </motion.button>
                </form>

                {message && (
                  <motion.p 
                    className="mt-4 text-red-400 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message}
                  </motion.p>
                )}

                <motion.div 
                  variants={itemVariants} 
                  className="mt-6 text-center"
                >
                  <p className="text-gray-300">
                    Don't have an account?{' '}
                    <motion.a 
                      href="/signup"
                      className="font-semibold text-green-400 hover:text-green-300 transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      Register here
                    </motion.a>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Image section */}
          <motion.div 
            className="w-full md:w-1/2 hidden md:flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 opacity-75 blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <motion.img 
                src="/login.gif" 
                alt="Login illustration" 
                className="relative z-10 rounded-lg shadow-2xl max-w-md w-full"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HomeLogin;