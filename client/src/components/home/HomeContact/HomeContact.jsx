import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Footer from "../../footer/Footer";
import HomeNavbar from "../HomeNavbar/HomeNavbar";

const HomeContact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
    <HomeNavbar/>
    <div className="bg-gradient-to-br from-black via-gray-800 to-black text-white py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        {/* <header className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you have a question, need help, or just want to give feedback, we’re here for you! Use the form below or reach us via email, phone, or social media.
          </p>
        </header> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows="5"
                  placeholder="Write your message here"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-medium transition duration-300"
              >
                Submit
              </button>
            </form>
            {formStatus && <p className="mt-4 text-green-500">{formStatus}</p>}
          </motion.div>

          {/* Contact Info & FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Contact Information */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaEnvelope className="text-blue-600 mr-3" />
                  <span>bowlpulp@gmail.com</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-blue-600 mr-3" />
                  <span>Nope - nice try!</span>
                </li>
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Quick FAQ</h2>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <strong>Can I use this platform for free?</strong>
                  <p>Yes! It’s absolutely free to use.</p>
                </li>
                <li>
                  <strong>How can I suggest a feature?</strong>
                  <p>You can use the contact form or reach out to us directly via email or social media.</p>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
              <div className="flex space-x-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-600"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HomeContact;
