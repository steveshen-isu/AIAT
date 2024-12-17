import React from 'react';
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-lg mb-4">Effective Date: [12/15/2024]</p>
      <p className="mb-4">
        At Aite Institute (“we,” “us,” or “our”), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services. By accessing or using our website or app, you agree to the terms outlined in this Privacy Policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
      <p className="mb-4">We collect both personal and non-personal information to provide and improve our services. The types of information we collect include:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Personal Information:</strong> Name, email address, phone number, payment information, and more.</li>
        <li><strong>Non-Personal Information:</strong> Device information, usage data, location data, and cookies.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use the information we collect for various purposes, including:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and personalize our services</li>
        <li>To communicate with you</li>
        <li>To process transactions</li>
        <li>To improve our services</li>
        <li>To protect our rights and enforce our policies</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">3. How We Share Your Information</h2>
      <p className="mb-4">We may share your information with third parties in the following situations:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service providers who assist with business operations</li>
        <li>Legal compliance and protection of our rights</li>
        <li>Business transfers in case of mergers or acquisitions</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">4. Data Security</h2>
      <p className="mb-4">
        We take data security seriously and implement appropriate measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Your Rights and Choices</h2>
      <p className="mb-4">You have certain rights regarding your personal information, including:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access and correction</li>
        <li>Deletion of your information</li>
        <li>Opt-out of marketing communications</li>
        <li>Data portability</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">6. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to third-party websites. We are not responsible for their privacy practices.
      </p>

      <h2 className="text-2xl font-semibold mt-6">7. Children’s Privacy</h2>
      <p className="mb-4">
        Our services are not intended for children under 13, and we do not knowingly collect personal information from children.
      </p>

      <h2 className="text-2xl font-semibold mt-6">8. Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Please review it periodically for updates.
      </p>

      <h2 className="text-2xl font-semibold mt-6">9. Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about this Privacy Policy, please contact us at: <br />
        Email: info@aiteinstitute.com <br />
        Phone: (+1) 949-932-0727 <br />
        Address: 16 Truman St, Irvine, CA 92620
      </p>
      <div className="mt-8 flex justify-center">
          <button
            onClick={handleReturnHome}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Return Home
          </button>
        </div>
    </div>
  );
};

export default PrivacyPolicy;

