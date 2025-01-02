import React from "react";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Home from "./Home";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import TopicSelector from './components/TopicSelector';
import PlotGenerator from './components/PlotGenerator';
import Chatbox from './components/chatbox';
import Calculator from './components/Calculator';
import QuestionSearch from './components/QuestionSearch';

function App() {
  return (
    <BrowserRouter>
              <div className="App bg-gray-50 max-h-screen w-full flex flex-col">
                <nav className="bg-red-900 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-md w-full">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="text-xl font-bold">AIAT</div>
                        <div className="flex flex-wrap space-x-4">
                            <Link to="/topic-selector" className="bg-red-900 hover:bg-red-800 p-2 rounded">Topic Selector</Link>
                            <Link to="/plot-generator" className="bg-red-900 hover:bg-red-800 p-2 rounded">Plot Generator</Link>
                            <Link to="/chatbox" className="bg-red-900 hover:bg-red-800 p-2 rounded">Chatbox</Link>
                            <Link to="/calculator" className="bg-red-900 hover:bg-red-800 p-2 rounded">Calculator</Link>
                            <Link to="/exam-grader" className="bg-red-900 hover:bg-red-800 p-2 rounded">Exam Grader</Link>
                            <Link to="/question-search" className="bg-red-900 hover:bg-red-800 p-2 rounded">Question Search</Link>
                            <Link to="/" className="bg-red-800 hover:bg-gray-200 p-2 rounded">Home Page</Link>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="h-20">
    </div>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/topic-selector" element={<TopicSelector />} />
        <Route path="/plot-generator" element={<PlotGenerator />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/question-search" element={<QuestionSearch />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
