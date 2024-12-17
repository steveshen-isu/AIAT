import React from "react";
import { useNavigate } from "react-router-dom";

function CookiePolicy() {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-6">
      {/* Main container */}
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Cookie Policy
        </h1>

        {/* Effective Date */}
        <p className="text-gray-500 text-sm mb-6 text-center">
          Effective Date: <span className="text-gray-800 font-semibold">12/15/2024</span>
        </p>

        {/* Content */}
        <div className="text-gray-700 text-lg space-y-6">
          <p>
            At <span className="font-semibold">Aite Institute</span>, we use cookies to enhance your browsing experience, analyze site traffic, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can manage them.
          </p>
          <h2 className="text-2xl font-semibold mt-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your browser when you visit a website. They help us remember your preferences, improve functionality, and understand how our website is used.
          </p>
          <h2 className="text-2xl font-semibold mt-4">2. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">Essential Cookies:</span> These are necessary for the basic functioning of the website.
            </li>
            <li>
              <span className="font-semibold">Analytics Cookies:</span> These help us understand how visitors interact with our site by collecting anonymous data.
            </li>
            <li>
              <span className="font-semibold">Advertising Cookies:</span> These are used to deliver personalized ads and measure their performance.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-4">3. Managing Cookies</h2>
          <p>
            You can manage or disable cookies through your browser settings. However, disabling cookies may affect the functionality of certain parts of our website.
          </p>
          <h2 className="text-2xl font-semibold mt-4">4. Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy, please contact us at <span className="text-blue-600 underline">info@aiteinstitute.com</span>.
          </p>
        </div>

        {/* Return Home Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleReturnHome}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
