import React from "react";
import Footer from "../../footer/Footer";
import HomeNavbar from "../homenavbar/homenavbar";

const HomePrivacy = () => {
  return (
    <>
    <HomeNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white flex items-center justify-center pt-16">
      {/* Added padding-top (pt-16) to avoid overlap with the navbar */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md text-gray-300 border border-white/20">
          <p className="mb-6">
            <strong>Last Updated:</strong> [19-10-2024]
          </p>
          <p className="mb-6">
            Your privacy is critically important to us. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to protect your data.
          </p>

          <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Personal data provided by you, such as email address or wallet address.</li>
            <li>Usage data, including browser type, operating system, and time spent on our platform.</li>
            <li>Any information voluntarily provided through contact forms or other inputs.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>To improve user experience by analyzing user behavior on the platform.</li>
            <li>To maintain security and prevent fraud or abuse of our services.</li>
            <li>To provide support when users reach out via contact forms.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mb-4">Data Sharing</h2>
          <p className="mb-6">
            We do not share, sell, or rent your personal information to third parties. However, we may disclose information if required by law or to protect the rights and safety of our users.
          </p>

          <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Access your data and request its deletion.</li>
            <li>Opt out of certain data collection practices (e.g., analytics).</li>
            <li>Contact us for clarification about this privacy policy.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mb-4">Security Measures</h2>
          <p className="mb-6">
            We take data protection seriously and implement security measures to prevent unauthorized access. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute protection.
          </p>

          <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. Significant changes will be communicated to users through announcements or email notifications.
          </p>

          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your personal data, feel free to contact us at:{" "}
            <a href="mailto:bowlpulp@gmail.com" className="text-blue-500 hover:underline">
              bowlpulp@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HomePrivacy;
