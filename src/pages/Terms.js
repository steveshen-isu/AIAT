import React from "react";
import { useNavigate } from "react-router-dom";

function Terms() {
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
          Terms of Service
        </h1>

        {/* Effective Date */}
        <p className="text-gray-500 text-sm mb-6 text-center">
          Effective Date: <span className="text-gray-800 font-semibold">12/15/2024</span>
        </p>

        {/* Content */}
        <div className="text-gray-700 text-lg space-y-6">
          <p>
            Welcome to <span className="font-semibold">Aite Institute</span>. By using our website or services, you agree to these Terms of Service. Please read them carefully before using our services.
          </p>
          <h2 className="text-2xl font-semibold mt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>
          <h2 className="text-2xl font-semibold mt-4">2. Use of Our Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">Eligibility:</span> You must be at least 18 years old or have parental consent to use our services.
            </li>
            <li>
              <span className="font-semibold">Prohibited Activities:</span> You agree not to engage in illegal or unauthorized activities while using our services.
            </li>
            <li>
              <span className="font-semibold">Account Responsibility:</span> You are responsible for maintaining the security of your account credentials.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-4">3. Intellectual Property</h2>
          <p>
            All content, trademarks, and logos on our website are owned by <span className="font-semibold">@Aite Institute</span>. You may not copy, reproduce, or distribute our content without prior written consent.
          </p>
          <h2 className="text-2xl font-semibold mt-4">4. Limitation of Liability</h2>
          <p>
            We are not liable for any damages resulting from the use or inability to use our services. Use our services at your own risk.
          </p>
          <h2 className="text-2xl font-semibold mt-4">5. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting on our website.
          </p>
          <h2 className="text-2xl font-semibold mt-4">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at <span className="text-blue-600 underline">info@aiteinstitute.com</span>.
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

export default Terms;
