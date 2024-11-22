import React, { useState, useEffect } from 'react';
import './AdvancedCalculator.css'; // Optional for styling

function AdvancedCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const clearInput = () => {
    setInput('');
    setResult(null);
  };

  const backspace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const calculateResult = () => {
    if (!input) {
      setResult('Error');
      return;
    }

    try {
      const processedInput = input
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      const calcResult = eval(processedInput); // Evaluate the transformed input
      setResult(calcResult);
    } catch (error) {
      setResult('Error'); // Handle invalid expressions
    }
  };

  const handleKeyDown = (event) => {
    const validKeys = '0123456789+-*/.^()';
    const key = event.key;

    if (validKeys.includes(key)) {
      setInput((prevInput) => prevInput + key);
      event.preventDefault();
    } else if (key === 'Enter') {
      event.preventDefault();
      calculateResult();
    } else if (key === 'Backspace') {
      event.preventDefault();
      backspace();
    } else if (key === 'Escape') {
      clearInput();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="advanced-calculator">
      <div className="display">
        <div className="input">{input || '0'}</div>
        <div className="result">{result !== null ? `= ${result}` : ''}</div>
      </div>
      <div className="buttons">
        {['7', '8', '9', '/'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['4', '5', '6', '*'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['1', '2', '3', '-'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['0', '.', '=', '+'].map((value) => (
          <button
            key={value}
            onClick={() => (value === '=' ? calculateResult() : handleButtonClick(value))}
          >
            {value}
          </button>
        ))}
        {['(', ')', '^', '√('].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['sin(', 'cos(', 'tan(', 'log('].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['π', 'e'].map((value) => (
          <button
            key={value}
            onClick={() =>
              handleButtonClick(value === 'π' ? Math.PI.toString() : value === 'e' ? Math.E.toString() : value)
            }
          >
            {value}
          </button>
        ))}
        <button className="clear-button" onClick={clearInput}>
          Clear
        </button>
        <button className="backspace-button" onClick={backspace}>
          Backspace
        </button>
      </div>
    </div>
  );
}

export default AdvancedCalculator;
