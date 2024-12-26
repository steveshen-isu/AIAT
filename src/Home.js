import logo from './logo11.png';
import { useState } from 'react';
import './App.css';
import TopicSelector from './components/TopicSelector';
import PlotGenerator from './components/PlotGenerator';
import Chatbox from './components/chatbox';
import Calculator from './components/Calculator';
import ExamGrader from './components/ExamGrader';
import QuestionSearch from './components/QuestionSearch';

import Button from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

import { FaBook, FaChartLine, FaComments, FaCalculator, FaGraduationCap, FaSearch } from 'react-icons/fa'; // Import icons
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';


function Home() {


    return (
        <div className="App bg-gray-50 min-h-screen flex flex-col">


            <header className="bg-red-900 py-12 shadow-md w-full">
                <div className="bg-red-900 w-full text-center p-8 flex flex-col items-center lg:flex-row lg:justify-center lg:text-left">
                    <div className="lg:w-1/2">
                        <h1 className="text-6xl font-bold text-white">AI Math Solve: Your Ultimate Math Companion</h1>
                        <p className="text-white text-6xl mt-2" style={{ fontSize: '1.5rem' }}>
                            Explore, Visualize, and Master Mathematics with Advanced AI Tools. Dive into step-by-step solutions, explore course materials, chat with an intelligent assistant, and even grade your exams—all in one intuitive platform.
                        </p>
                    </div>
                    <div className="lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
                        <img
                            src={logo}
                            className="rounded-3xl"
                            alt="logo"
                            style={{ width: '450px', height: '440px' }}
                        />
                    </div>
                </div>

            </header>
            <div className="flex  justify-center">


                <div className="lg:w-4/5 text-center my-8" >
                    <h1 className="font-mono text-4xl font-bold text-gray">Overview</h1>
                    <p className="font-mono text-gray text-lg mt-2">
                        What You Can Do with AI Math Solve:

                        Course Helper: Access organized course materials, guides, and notes to support your studies.
                        Plot Generator: Create interactive mathematical plots and visualizations in real time.
                        Chatbox: Engage with an intelligent assistant to clarify concepts and answer queries instantly.
                        Calculator: Perform advanced calculations with ease using a scientific calculator.
                        Exam Grader: Automatically grade exams and receive detailed insights into your performance.
                    </p>

                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full text-center h-64">


                <Link
                    to="/topic-selector"
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                >
                    <FaBook
                        className="absolute text-red-500 text-[6rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Course Helper
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-black">
                            Explore resources and assistance for your courses, including guides, notes, and more.
                        </span>

                    </div>
                </Link>

                <Link
                    to="plot-generator"
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                >
                    <FaChartLine
                        className="absolute text-red-500 text-[6rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Plot Generator
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-black">
                            Generate and visualize mathematical plots and graphs interactively.
                        </span>

                    </div>
                </Link>

                <Link
                    to="chatbox"
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                >
                    <FaComments
                        className="absolute text-red-500 text-[6rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Chatbox
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-black">
                            Interact with an intelligent chat assistant for help with your queries.
                        </span>

                    </div>
                </Link>

                <Link
                    to="calculator"
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                >
                    <FaCalculator
                        className="text-red-500 text-[4rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Calculator
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-black">
                            Perform complex calculations with an advanced scientific calculator.
                        </span>

                    </div>
                </Link>
{/*                 <Button
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                    onClick={() => setSelectedComponent('ExamGrader')}
                >
                    <FaGraduationCap
                        className="absolute text-red-500 text-[6rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Exam Grader
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-white">
                            Automatically grade exams and receive detailed feedback.
                        </span>

                    </div>
                </Button> */}
                <Link
                    to="question-search"
                    variant="default"
                    className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
                >
                    <FaSearch
                        className="absolute text-red-500 text-[6rem] transition-transform duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-30"
                        style={{ top: '35%', transform: 'translateY(-50%)' }}
                    />
                    <p
                        className="absolute text-gray-900 text-center font-bold text-2xl opacity-100 group-hover:opacity-50"
                        style={{ top: '75%' }}
                    >
                        Question Search
                    </p>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <span className="text-lg font-bold text-center text-white">
                            Quick retrieval of classic questions.
                        </span>

                    </div>
                </Link>

            </div>
            
                <footer class="bg-gray-800 text-white py-8">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                            <div>
                                <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
                                <ul>
                                    <li><a href="/" class="text-gray-400 hover:text-white">Home</a></li>
                                    <li>
                                        <a href="https://tutorial.math.lamar.edu/" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>Explore Calculus</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.aiteinstitute.com/ch/index.html" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>AITE Home</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://pastpapers.co/" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>Past Papers</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://artofproblemsolving.com/" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>MATH Competition</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.wolframalpha.com/" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>MATH tools</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.libgen.is/" target="_blank" class="text-gray-400 hover:text-white items-center space-x-2">
                                            <span>Textbook Finder</span>
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="text-xl font-semibold mb-4">Legal & Privacy</h3>

                                <ul>
                                    <li><a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
                                    <li><a href="/terms" class="text-gray-400 hover:text-white">Terms of Service</a></li>
                                    <li><a href="/cookie-policy" class="text-gray-400 hover:text-white">Cookie Policy</a></li>
                                </ul>




                            </div>

                            <div>
                                <h3 class="text-xl font-semibold mb-4">Contact Us</h3>
                                <ul>
                                    <li><a href="mailto:info@aiteinstitute.com" class="text-gray-400 hover:text-white">Email: info@aiteinstitute.com</a></li>
                                    <li><a href="https://www.aiteinstitute.com/en/about/" class="text-gray-400 hover:text-white">Help Center</a></li>
                                    <li><a href="https://www.aiteinstitute.com/ch/lxwm/" class="text-gray-400 hover:text-white">Leave Message</a></li>
                                </ul>
                                <div class="mt-6">
                                    <h4 class="text-xl font-semibold mb-2">Follow Us</h4>
                                    <div class="space-x-4">
                                        <a href="https://facebook.com" target="_blank" class="text-gray-400 hover:text-white">
                                            <i class="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="https://twitter.com" target="_blank" class="text-gray-400 hover:text-white">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a href="https://linkedin.com" target="_blank" class="text-gray-400 hover:text-white">
                                            <i class="fab fa-linkedin-in"></i>
                                        </a>
                                        <a href="https://instagram.com" target="_blank" class="text-gray-400 hover:text-white">
                                            <i class="fab fa-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 text-center text-gray-400 text-sm">
                            <p>&copy; 2024 Aite Institute. All Rights Reserved.</p>
                            <p>Built with &hearts; | Powered by OPENAI, React, Node.js</p>
                        </div>
                    </div>
                </footer>
           
        </div>


    );
}

export default Home;
