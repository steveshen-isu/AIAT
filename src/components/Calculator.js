import React, { useState, useEffect } from 'react';
import './AdvancedCalculator.css'; // Optional for styling
import Textarea from "@/components/ui/textarea"; // Import Textarea from shadcn
import { create, all } from 'mathjs';
import TypewriterResponsePlain from './TypeWriterResponsePlain';


const nerdamer = require("nerdamer/all.min.js")

const math = create(all);

function AdvancedCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [expression, setExpression] = useState('');
  const [operation, setOperation] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState('');
  const [variables, setVariables] = useState([]);


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
        .replace(/\^/g, '**')
        .replace(/pi/g, 'Math.PI')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/(\d)(?=(Math.sin|Math.cos|Math.tan|Math.log10|Math.sqrt|Math.PI|Math.E)\()/g, '$1*')
        // Insert '*' between a variable and the function, like xsin(x) -> x*Math.sin(x)
        .replace(/(\w)(?=(Math.sin|Math.cos|Math.tan|Math.log10|Math.sqrt|Math.PI|Math.E)\()/g, '$1*');

      console.log(processedInput)
      const calcResult = eval(processedInput); // Evaluate the transformed input
      setResult(calcResult);
    } catch (error) {
      setResult('Error'); // Handle invalid expressions
    }
  };

  const handleKeyDown = (event) => {
    const validKeys = '0123456789+-*/.^()';
    const key = event.key;
    const textarea = event.target; // This refers to the textarea element

    if (validKeys.includes(key)) {
      const { selectionStart, selectionEnd, value } = textarea;
      // Insert the key at the current cursor position
      const newInput = value.substring(0, selectionStart) + key + value.substring(selectionEnd);

      setInput(newInput);

      // Move the cursor after the inserted character
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1; // Move the cursor forward by 1
      }, 0);

      event.preventDefault(); // Prevent default behavior
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

  const detectVariables = (expr) => {
    const regex = /\b[a-dh-zA-Z_]\b/g; // Matches single-character variables, excluding 'e', 'f', 'g', and 'i'.
    const matches = expr.match(regex);
    const uniqueVariables = [...new Set(matches)];
    setVariables(uniqueVariables);
  };

  // Handle form submission for different operations
  const handleSubmit = () => {
    try {
      let analyzeResult;
      const expr = input;
      console.log(expr)
      switch (operation) {
        case 'differentiate':
          analyzeResult = '\\(' + nerdamer('diff\(' + expr + '\)').toTeX() + '\\)';
          break;
        case 'integrate':
          analyzeResult = '\\(' + nerdamer('integrate\(' + expr + '\)').toTeX() + '\\)'
          break;
        case 'solve':
          const solutions = nerdamer.solve(expr, variables).toString();
          analyzeResult = solutions.length > 0 ? solutions : 'No solution found';
          break;
        case 'localextrema':
          analyzeResult = findLocalExtrema(expr);
          break;
        default:
          analyzeResult = 'Please select an operation';
      }

      setAnalyzeResult(analyzeResult);
    } catch (error) {
      setAnalyzeResult('Error processing expression');
    }
  };

  // Function to find local maxima and minima using second derivative test
  const findLocalExtrema = (expr) => {
    const firstDerivative = nerdamer('diff\(' + expr + '\)').toString();
    const secondDerivative = nerdamer('diff\(' + firstDerivative + '\)').toString();
    console.log('second derivative:', secondDerivative)
    const criticalPoints = nerdamer.solve(firstDerivative, variables);
    console.log('criticalPoints:', criticalPoints)
    const extrema = criticalPoints.map((point) => {
      const secondAtPoint = nerdamer(secondDerivative, { variables: point }).evaluate();
      
      return {
        point: point,
        type: secondAtPoint > 0 ? 'min' : secondAtPoint < 0 ? 'max' : 'inconclusive',
      };
    });

    return extrema.length ? extrema : 'No local extrema found';
  };

  return (
    <div className="flex flex-col md:flex-row items-start p-6 space-y-6 md:space-y-0 md:space-x-6">

      <div className="advanced-calculator">
        <Textarea
          className="p-4 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 shadow-md transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          placeholder="e.g., sin(x), x^2, or cos(x)*tan(x)"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            detectVariables(e.target.value) // Detect variables as user types
          }}
          rows="2"
/*         disabled={}
 */      />
        <div className="display">

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
          {['0', '.', '', '+'].map((value) => (
            <button
              key={value}
              onClick={() => handleButtonClick(value)}
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
                handleButtonClick(value)
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
          <button className="eval-button" onClick={calculateResult}>
            Calculate
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-semibold text-center text-blue-700 mb-8">Math Operations with Math.js</h1>


        <div className="flex justify-around w-full max-w-xl mb-6">
          <button
            onClick={() => setOperation('differentiate')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Differentiate
          </button>
          <button
            onClick={() => setOperation('integrate')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Integrate
          </button>
          <button
            onClick={() => setOperation('solve')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Solve
          </button>
          <button
            onClick={() => setOperation('localextrema')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Find Extrema
          </button>
        </div>

        <div className="w-full max-w-xl mb-6">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
          >
            Submit
          </button>
        </div>

        <div className="w-full max-w-xl mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Result:</h3>
          <pre className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          <TypewriterResponsePlain content={analyzeResult} />
          </pre>
        </div>

        <div className="w-full max-w-xl mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Detected Variables:</h3>
          <ul className="list-disc pl-6">
            {variables.map((variable, index) => (
              <li key={index} className="text-gray-600">{variable}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdvancedCalculator;
