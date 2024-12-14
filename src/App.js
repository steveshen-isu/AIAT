import logo from './logo11.png';
import { useState } from 'react';
import './App.css';
import TopicSelector from './components/TopicSelector';
import PlotGenerator from './components/PlotGenerator';
import Chatbox from './components/chatbox';
import Calculator from './components/Calculator';
import ExamGrader from './components/ExamGrader';

import Button from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { FaBook, FaChartLine, FaComments, FaCalculator, FaGraduationCap } from 'react-icons/fa'; // Import icons

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'TopicSelector':
        return <TopicSelector />;
      case 'PlotGenerator':
        return <PlotGenerator />;
      case 'Chatbox':
        return <Chatbox />;
      case 'Calculator':
        return <Calculator />;
      case 'ExamGrader':
        return <ExamGrader />;
      default:
        return (
          <Card className="text-center p-6 mx-auto border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-600 text-lg font-light">
                Click on a button to load a component
              </CardTitle>
            </CardHeader>
          </Card>
        );
    }
  };

  const handleNavigation = (component) => {
    setSelectedComponent(component);
  };


  return (
    <div className="App bg-gray-50 min-h-screen flex flex-col">
      {selectedComponent && (<nav className="bg-red-900 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">AIAT</div>
          <div className="flex space-x-4">
            <button onClick={() => handleNavigation('TopicSelector')} className="bg-red-900 hover:bg-red-800 p-2 rounded">Topic Selector</button>
            <button onClick={() => handleNavigation('PlotGenerator')} className="bg-red-900 hover:bg-red-800 p-2 rounded">Plot Generator</button>
            <button onClick={() => handleNavigation('Chatbox')} className="bg-red-900 hover:bg-red-800 p-2 rounded">Chatbox</button>
            <button onClick={() => handleNavigation('Calculator')} className="bg-red-900 hover:bg-red-800 p-2 rounded">Calculator</button>
            <button onClick={() => handleNavigation('ExamGrader')} className="bg-red-900 hover:bg-red-800 p-2 rounded">Exam Grader</button>
            <button onClick={() => setSelectedComponent(null)} className="bg-red-800 hover:bg-gray-200 p-2 rounded">Home Page</button>

          </div>
        </div>
      </nav>)}
      {selectedComponent === null && (
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

        </header>)}
      <div className="flex  justify-center">
        {selectedComponent === null && (

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

          </div>)}
      </div>
      {/* Button Section */}
      {!selectedComponent && (<div className="flex flex-wrap justify-center gap-4 w-full text-center h-64">


        <Button
          variant="default"
          className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
          onClick={() => setSelectedComponent('TopicSelector')}
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
            <span className="text-lg font-bold text-center text-white">
              Explore resources and assistance for your courses, including guides, notes, and more.
            </span>

          </div>
        </Button>

        <Button
          variant="default"
          className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
          onClick={() => setSelectedComponent('PlotGenerator')}
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
            <span className="text-lg font-bold text-center text-white">
              Generate and visualize mathematical plots and graphs interactively.
            </span>

          </div>
        </Button>

        <Button
          variant="default"
          className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
          onClick={() => setSelectedComponent('Chatbox')}
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
            <span className="text-lg font-bold text-center text-white">
              Interact with an intelligent chat assistant for help with your queries.
            </span>

          </div>
        </Button>

        <Button
          variant="default"
          className="relative flex flex-col items-center justify-center bg-white p-4 shadow-md rounded-lg w-64 transition-transform duration-300 group hover:scale-105"
          onClick={() => setSelectedComponent('Calculator')}
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
            <span className="text-lg font-bold text-center text-white">
              Perform complex calculations with an advanced scientific calculator.
            </span>

          </div>
        </Button>
        <Button
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
        </Button>

      </div>)}
      <div className="mt-[10vh] w-full">{renderComponent()}</div>
    </div>

  );
}

export default App;
