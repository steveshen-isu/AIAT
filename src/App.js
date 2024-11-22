import logo from './logo7.png';



import { useState } from 'react';
import './App.css';
import TopicSelector from './components/TopicSelector';
import PlotGenerator from './components/PlotGenerator';
import Chatbox from './components/chatbox'; // Assuming this is another component
import Calculator from './components/Calculator';
import ExamGrader from './components/ExamGrader';
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
        return <h1 style={{
          color: 'gray',            // Use camelCase for CSS properties
          fontSize: '32px',         // font-size becomes fontSize
          textAlign: 'center',      // text-align becomes textAlign
          fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
          fontWeight: 'lighter',        // Bold text
          fontStyle: 'normal',       // Italic text
        }}>
          Click on the button to load component
        </h1>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {selectedComponent === null && (<h1 style={{
          color: 'gray',            // Use camelCase for CSS properties
          fontSize: '42px',         // font-size becomes fontSize
          textAlign: 'center',      // text-align becomes textAlign
          fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
          fontWeight: 'normal',        // Bold text
          fontStyle: 'normal',       // Italic text
        }}>
          Welcome. Make a choice from these functions
        </h1>)}
        {selectedComponent === null && (
          <img src={logo} className="App-logo" alt="logo" />
        )}
        <div>
          <button className="custom-button-modern" onClick={() => setSelectedComponent('TopicSelector')}>Course Helper</button>
          <button className="custom-button-modern" onClick={() => setSelectedComponent('PlotGenerator')}>Plot Generator</button>
          <button className="custom-button-modern" onClick={() => setSelectedComponent('Chatbox')}>Chatbox</button>
          <button className="custom-button-modern" onClick={() => setSelectedComponent('Calculator')}>Calculator</button>
          <button className="custom-button-modern" onClick={() => setSelectedComponent('ExamGrader')}>Exam Grader</button>
        </div>
        <div className="component-container">
          {renderComponent()}
        </div>
      </header>
    </div>
  );
}

export default App;

