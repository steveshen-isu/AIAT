import React, { useState, useEffect } from 'react';
import './AdvancedCalculator.css'; // Optional for styling
import Textarea from "@/components/ui/textarea"; // Import Textarea from shadcn
import { create, all } from 'mathjs';
import TypewriterResponsePlain from './TypeWriterResponsePlain';
import MatrixOperationComponent from './calculatorComponents/matrixOperation.js';
import SeriesCalculatior from './calculatorComponents/SeriesCalculator.js';
import LinearEquationSolver from './calculatorComponents/LinearEquationSolver.js';
import NumericalIntegration from './calculatorComponents/NumericalIntegration.js';
import ComplexNumberOperations from './calculatorComponents/ComplexNumberOperations.js';
import DataAnalysisComponent from './calculatorComponents/DataAnalysisComponent';
import DistributionProbabilityCalculator from './calculatorComponents/DistributionProbabilityCalculator.js';
import FormulasComponent from './calculatorComponents/FormulasComponent';
import RandomNumberGenerator from './calculatorComponents/RandomNumberGenerator.js';
import MonteCarloSimulator from './calculatorComponents/MonteCarloSimulator.js'
import NumericalODESolver from './calculatorComponents/NumericalODESolver.js';
import ProbExperiments from './calculatorComponents/ProbExperiments.js';

const nerdamer = require("nerdamer/all.min.js")

const math = create(all);

function AdvancedCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState('');
  const [variables, setVariables] = useState([]);
  const [firstVariableInput, setFirstVariableInput] = useState('');
  const [secondVariableInput, setSecondVariableInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isTooManySolutions, setIsTooManySolutions] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);

  const components = [
    { name: 'Matrix Operation', component: <MatrixOperationComponent /> },
    { name: 'Series Calculation', component: <SeriesCalculatior /> },
    { name: 'Solve System of Equations', component: <LinearEquationSolver /> },
    { name: 'Numerical Integration', component: <NumericalIntegration /> },
    { name: 'Complex Numbers', component: <ComplexNumberOperations /> },
    { name: 'Data Analysis', component: <DataAnalysisComponent /> },
    { name: 'Distributions', component: <DistributionProbabilityCalculator /> },
    { name: 'Formulas', component: <FormulasComponent /> },
    { name: 'Random Number Generator', component: <RandomNumberGenerator /> },
    { name: 'Monte Carlo Simulator', component: <MonteCarloSimulator /> },
    { name: 'Numerical ODE Solver', component: <NumericalODESolver /> },
    { name: 'Probability Experiments', component: <ProbExperiments /> }
  ];

  const handleButtonClick = (value) => {
    setInput((prevInput) => {
      const inputField = document.getElementById('textInput');
      const cursorPosition = inputField.selectionStart;

      const newInput =
        prevInput.slice(0, cursorPosition) +
        value +
        prevInput.slice(cursorPosition);

      setTimeout(() => {
        inputField.selectionStart = inputField.selectionEnd = cursorPosition + value.length;
      }, 0);

      return newInput;
    });
  }

  const clearInput = () => {
    setInput('');
    setResult(null);
    setVariables([]);
  };

  const backspace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };


  const handleRemoveRecord = (index) => {
    setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const calculateResult = () => {

    if (input.trim() === '') return;

    const result = input.trim().replace(/√\(/g, 'sqrt(')
      .replace(/π/g, '\(pi\)')


    if (!history.some((entry) => entry === result)) {
      setHistory((prevHistory) => {
        const newHistory = [result, ...prevHistory];
        return newHistory.slice(0, 10);
      });
    }
    if (!input) {
      setResult('Error');
      return;
    } else if (!variables[0]) {
      try {
        const processedInput = input
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/√\(/g, 'Math.sqrt(')
          .replace(/\^/g, '**')
          .replace(/pi/g, 'Math.PI')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/(\d)(?=(Math.sin|Math.cos|Math.tan|Math.log10|Math.sqrt|Math.PI|Math.E)\()/g, '$1*')
          .replace(/(\w)(?=(Math.sin|Math.cos|Math.tan|Math.log10|Math.sqrt|Math.PI|Math.E)\()/g, '$1*');

        console.log(processedInput)
        const calcResult = eval(processedInput);
        setResult(calcResult);
      } catch (error) {
        setResult('Error');
      }
    } else if (/^[+\*/]/.test(input.trim()) || /[+\-*/]$/.test(input.trim())) {
      setResult('Invalid expression: Operators cannot be at the beginning or end.');
      return;
    }
    else if (variables[0]) {
      try {
        if (!firstVariableInput || (variables[1] && !secondVariableInput)) {
          setResult("Set variable value first!")
        } else {
          const regex1 = new RegExp(`${variables[0]}`, 'g');
          const updatedInput = input.replace(regex1, '\(' + firstVariableInput + '\)').replace(/ln\(/g, 'log\(').replace(/√\(/g, 'sqrt(')
            .replace(/π/g, '\(pi\)');
          const regex2 = new RegExp(`${variables[1]}`, 'g');
          const updatedInput2 = updatedInput.replace(regex2, '\(' + secondVariableInput + '\)');
          if (/^[+\*/]/.test(updatedInput2.trim()) || /[+\-*/]$/.test(updatedInput2.trim())) {
            setResult('Invalid expression: Operators cannot be at the beginning or end.');
            return;
          }
          try {
            const calcResult = nerdamer(updatedInput2).evaluate().text('decimal');
            setResult(calcResult.slice(1));
          } catch (nerdamerError) {
            if (nerdamerError.name === 'ParseError') {
              console.error("Nerdamer ParseError:", nerdamerError.message);
              setResult(`Unreadable Expression: ${nerdamerError.message}`);
            } else {
              console.error("Unexpected Nerdamer error:", nerdamerError);
              setResult('Unexpected error during calculation.');
            }
          }

        }
      } catch (error) { setResult('Unreadable Expression') }
    }

  };




  const detectVariables = (expr) => {
    const regex = /(?<=\d|\W|^)[a-dh-zA-Z_](?!\w)/g;
    const matches = expr.match(regex) || [];
    const uniqueVariables = [...new Set(matches)].filter((v) => typeof v === 'string');
    setVariables(uniqueVariables);
  };

  const getPrimaryVariable = (variables) => {
    const preferredVariables = ['x', 'y', 'z', 'u', 'v', 'w'];
    const selectedVariable = variables.find((v) => preferredVariables.includes(v));

    return selectedVariable || variables[0];
  };

  const handleResultRecord = () => {
    try {
      if (input.trim() === '') return;



      const expr = input.replace(/√\(/g, 'sqrt(')
        .replace(/π/g, '\(pi\)')
        .replace(/ln\(/g, 'log\(')
        ;
      console.log('expression', expr)
      switch (operation) {
        case 'differentiate':
          const diffVariable = getPrimaryVariable(variables)
          const diffresultToRecord = nerdamer('diff\(' + expr + '\,' + diffVariable + '\)').toString();
          if (!history.some((entry) => entry === diffresultToRecord)) {
            setHistory((prevHistory) => {
              const newHistory = [diffresultToRecord, ...prevHistory];
              return newHistory.slice(0, 10);
            });
          }
          break;
        case 'integrate':
          const intVariable = getPrimaryVariable(variables)

          const intresultToRecord = nerdamer('integrate\(' + expr + '\,' + intVariable + '\)').toString()

          if (!history.some((entry) => entry === intresultToRecord)) {
            setHistory((prevHistory) => {
              const newHistory = [intresultToRecord, ...prevHistory];
              return newHistory.slice(0, 10);
            });
          }
          break;
      }

      setAnalyzeResult(analyzeResult);
    } catch (error) {
      setAnalyzeResult('Error processing expression');
    }
  };

  const handleSubmit = () => {
    try {
      let analyzeResult;
      if (input.trim() === '') return;

      const result = input.replace(/√\(/g, 'sqrt(')
        .replace(/π/g, '\(pi\)')
        .replace(/ln\(/g, 'log\(');

      if (!history.some((entry) => entry === result)) {
        setHistory((prevHistory) => {
          const newHistory = [result, ...prevHistory];
          return newHistory.slice(0, 10);
        });
      }

      const expr = input.replace(/√\(/g, 'sqrt(')
        .replace(/π/g, '\(pi\)')
        .replace(/ln\(/g, 'log\(');

      ;
      console.log('expression', expr)
      switch (operation) {
        case 'differentiate':
          setIsTooManySolutions(false)
          const diffVariable = getPrimaryVariable(variables)
          const analyzeResultLogD = '\\(' + nerdamer('diff\(' + expr + '\,' + diffVariable + '\)').toTeX() + '\\)';
          analyzeResult = analyzeResultLogD.replace(/log/g, 'ln');

          break;
        case 'integrate':
          setIsTooManySolutions(false)
          const intVariable = getPrimaryVariable(variables)

          const analyzeResultLogI = '\\(' + nerdamer('integrate\(' + expr + '\,' + intVariable + '\)').toTeX() + '\\)'
          analyzeResult = analyzeResultLogI.replace(/log/g, 'ln');
          break;
        case 'solve':
          const SolveVariable = getPrimaryVariable(variables)

          const solutions = nerdamer.solve(expr, [SolveVariable]).text('decimals', 5);
          console.log("solutions:", solutions, analyzeResult)
          const solutionString = solutions.slice(1, -1);
          const solutionArray = solutionString.split('\,');

          let analyzeResultArray;

          if (solutionArray.length > 5 && !isTooManySolutions) {
            setIsTooManySolutions(true);
            const sortedArray = solutionArray.sort((a, b) => Math.abs(a) - Math.abs(b));

            const filteredArray = sortedArray.filter((value, index, array) => {
              return index === 0 || Math.abs(value - array[index - 1]) >= 0.001;
            });

            analyzeResultArray = filteredArray.slice(0, 5).concat('\\text{...and more solutions}');
          } else if (solutionArray.length === 0) {
            analyzeResultArray = 'No solution';
          } else {
            setIsTooManySolutions(false)
            const sortedArray = solutionArray.sort((a, b) => Math.abs(a) - Math.abs(b));

            analyzeResultArray = sortedArray
              .filter((value, index, array) => {
                return index === 0 || Math.abs(nerdamer.imagpart(value) - nerdamer.imagpart(array[index - 1])) >= 0.001 || Math.abs(nerdamer.realpart(value) - nerdamer.realpart(array[index - 1])) >= 0.001;
              })
              .slice(0, 15);
          }
          analyzeResult = analyzeResultArray.map(element => "\\[" + element + "\\]");
          console.log("solutions:", analyzeResult)

          analyzeResult = analyzeResult.toString()
          break;
        case 'localextrema':
          setIsTooManySolutions(false)
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

  const findLocalExtrema = (expr) => {
    if (variables.length === 0) {
      return 'No variables detected';
    }

    const variable = variables[0];

    const firstDerivative = nerdamer(`diff(${expr}, ${variable})`).toString();
    const secondDerivative = nerdamer(`diff(${firstDerivative}, ${variable})`).toString();
    console.log('First derivative:', firstDerivative, 'Second derivative:', secondDerivative);

    const criticalPoints = nerdamer.solve(firstDerivative, variable).text('decimal', 5);
    console.log('Possible critical points:', criticalPoints);

    if (criticalPoints === '[]' || criticalPoints.includes('i')) {
      return 'No extrema found';
    } else {
      const criticalPointString = criticalPoints.slice(1, -1);
      const criticalPointArray = criticalPointString.split(',').map((point) => point.slice(1));

      if (criticalPointArray.length === 0) {
        return 'No critical points detected';
      }
      const sortedExtrema = criticalPointArray.sort((a, b) => Math.abs(a) - Math.abs(b));
      const filteredExtrema = sortedExtrema.filter((value, index, array) => {
        return index === 0 || Math.abs(value - array[index - 1]) >= 0.001;
      });
      const extremaDescriptions = filteredExtrema.map((point) => {
        const secondAtPoint = nerdamer(secondDerivative, { [variable]: point }).evaluate().text('decimals', 5);
        console.log('second at point:', secondAtPoint)
        const extremaType = secondAtPoint > 0 ? 'minimum' : secondAtPoint < 0 ? 'maximum' : 'inconclusive';
        return `\nAt ${variable} = ${point.trim()}, ${extremaType}`;
      });

      return extremaDescriptions.slice(0, 12).join('; ');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-5 gap-x-2 w-full">
      <div className="flex flex-col items-center w-max">
        <div className="flex flex-col w-1/2 space-y-2 w-max">
          {history.map((record, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-lg transition-transform duration-300 hover:scale-105 w-max bg-gray-100 border shadow-md">

              <span className="text-gray-800">
                <pre className="p-4 bg-white border border-gray-300 rounded-lg shadow-md min-w-[10vw] overflow-hidden scrollbar-hide">
                  {(() => {
                    try {
                      const inputToDisplay = record.replace(/ln\(/g, 'log\(')

                      const tex = nerdamer(inputToDisplay).toTeX();
                      const texlog = tex.replace(/log/g, 'ln')
                      return <TypewriterResponsePlain content={`\\(${texlog}\\)`} />;
                    } catch (error) {
                      console.error("Error in nerdamer(record).toTeX():", error);
                      return <span className="text-red-500">Invalid Expression</span>;
                    }
                  })()}
                </pre>
              </span>
              <div className="flex p-2">
                <button
                  className="px-2 py-1 text-sm bg-green-500 text-white rounded shadow hover:bg-green-600 transition duration-300"
                  onClick={() => {
                    setInput(record);
                    detectVariables(record);
                    setFirstVariableInput('');
                    setSecondVariableInput('')
                  }
                  }
                >
                  Use
                </button>
                <button
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-300"
                  onClick={() => handleRemoveRecord(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="advanced-calculator">
        <Textarea
          id='textInput'
          className="p-4 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 shadow-md transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          placeholder="you can type in function or equation"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            detectVariables(e.target.value)
          }}
          rows="2"
        />
        {variables[0] && (<Textarea
          className="p-1 h-12 border-2 border-gray-300 rounded-lg max-w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 shadow-md transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          placeholder={`${variables[0]}` + '='}
          value={firstVariableInput}
          onChange={(e) => {
            setFirstVariableInput(e.target.value);
          }}
          rows="2"
        />)}
        {variables[1] && (

          <Textarea
            className="p-1 h-12 border-2 border-gray-300 rounded-lg max-w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 shadow-md transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            placeholder={`${variables[1]}` + '='}
            value={secondVariableInput}
            onChange={(e) => {
              setSecondVariableInput(e.target.value);
            }}
            rows="2"
          />)}

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
          {['sin(', 'cos(', 'tan(', 'ln('].map((value) => (
            <button
              key={value}
              onClick={() => handleButtonClick(value)}
              title={value === 'ln(' ? 'for any log operation type log(number,base)' : ''}
            >
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
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-stone-600 to-stone-400 drop-shadow-sm mb-8">
          Math Operations
        </h1>

        <div className="flex justify-around w-full max-w-xl mb-6">
          <button
            onClick={() => setOperation('differentiate')}
            className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 focus:outline-none"
          >
            Differentiate
          </button>
          <button
            onClick={() => setOperation('integrate')}
            className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 focus:outline-none"
          >
            Integrate
          </button>
          <button
            onClick={() => setOperation('solve')}
            className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 focus:outline-none"
          >
            Solve
          </button>
          <button
            onClick={() => setOperation('localextrema')}
            className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 focus:outline-none"
          >
            Find Extrema
          </button>
        </div>

        <div className="w-full max-w-xl mb-6">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        </div>

        <div className="w-full max-w-xl mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Result:</h3>
          <pre className="p-4 bg-white border border-gray-300 rounded-lg shadow-md mt-4 mb-4">
            {!isTooManySolutions && (<TypewriterResponsePlain content={analyzeResult} />
            )}
            {isTooManySolutions && (operation === 'solve' || operation === 'findextrema') && (
              <div>
                <TypewriterResponsePlain content={analyzeResult} />

                <div><button
                  onClick={() => {
                    setIsTooManySolutions(false);
                    handleSubmit()
                  }
                  }
                  className="px-6 py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 focus:outline-none"
                >
                  show more solutions
                </button>
                </div>
              </div>
            )}
          </pre>
        </div>
        {analyzeResult && analyzeResult !== 'Error processing expression' && operation === 'differentiate' && (
          <div className="w-full max-w-xl mb-6">
            <button
              onClick={handleResultRecord}
              className="w-full py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              record this result
            </button>
          </div>)}
        {analyzeResult && analyzeResult !== 'Error processing expression' && operation === 'integrate' && (
          <div className="w-full max-w-xl mb-6">
            <button
              onClick={handleResultRecord}
              className="w-full py-3 bg-stone-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              record this result
            </button>
          </div>)}
        <div className="w-full max-w-xl mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Detected Variables:</h3>
          <ul className="list-disc pl-6">
            {variables.map((variable, index) => (
              <li key={index} className="text-gray-600">{variable}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-stone-600 to-stone-400 drop-shadow-sm mb-8">
          Math & Stats Tools
        </h1>
        {activeComponent ? (
          <div className="w-full max-w-3xl">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {activeComponent}
            </div>
            <button
              onClick={() => setActiveComponent(null)}
              className="mt-4 px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-600"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
            {components.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveComponent(item.component)}
                className="px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-600 text-center"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedCalculator;
