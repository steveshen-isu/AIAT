import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Home from "./Home"; 
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route with shared layout */}
        <Route path="/" element={<Home />} />

        {/* Other routes with shared layout */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Privacy Policy as a standalone route */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
