import React, { useState } from 'react';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';

const LinearEquationSolver = () => {
  const [variables, setVariables] = useState(2);
  const [coefficients, setCoefficients] = useState({});
  const [result, setResult] = useState(null);

  const handleCoefficientChange = (row, col, value) => {
    setCoefficients((prev) => ({
      ...prev,
      [`${row}-${col}`]: Number(value),
    }));
  };

  const solveEquations = () => {
    try {
      const matrix = [];
      const constants = [];

      if (variables === 2) {
        for (let i = 1; i <= 2; i++) {
          matrix.push([coefficients[`${i}-1`] || 0, coefficients[`${i}-2`] || 0]);
          constants.push(coefficients[`${i}-3`] || 0);
        }
      } else if (variables === 3) {
        for (let i = 1; i <= 3; i++) {
          matrix.push([
            coefficients[`${i}-1`] || 0,
            coefficients[`${i}-2`] || 0,
            coefficients[`${i}-3`] || 0,
          ]);
          constants.push(coefficients[`${i}-4`] || 0);
        }
      }

      const matrixString = `matrix(${matrix.map((row) => `[${row.join(",")}]`).join(",")})`;
      const constantsString = `matrix([${constants.join(",")}])`;

      nerdamer.setVar('M', matrixString);
      const inverse = nerdamer('invert(M)').toString();
      const solutionMatrix = nerdamer(`${inverse}*${nerdamer.transpose(constantsString)}`).toString();
      const solutionArray = solutionMatrix.replace(/matrix|\[|\]|\(|\)/g, '').split('\,');

      const solution = solutionArray
        .map((value, index) => `${String.fromCharCode(120 + index)} = ${value}`) // x, y, z
        .join(', ');
      setResult(solution);
    } catch (e) {
      setResult('Error solving equations. Please check the coefficients.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Linear Equation Solver</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Number of Variables:</label>
        <select
          className="p-2 border rounded w-full"
          value={variables}
          onChange={(e) => {
            setVariables(Number(e.target.value));
            setCoefficients({});
            setResult(null);
          }}
        >
          <option value={2}>2 Variables</option>
          <option value={3}>3 Variables</option>
        </select>
      </div>

      {variables === 2 && (
        <div className="space-y-4">
          {[1, 2].map((row) => (
            <div key={row} className="flex space-x-2 items-center">
              <input
                type="number"
                placeholder={`a${row}1`}
                className="p-2 border rounded w-1/4"
                onChange={(e) => handleCoefficientChange(row, 1, e.target.value)}
              />
              <span>x{row} +</span>
              <input
                type="number"
                placeholder={`a${row}2`}
                className="p-2 border rounded w-1/4"
                onChange={(e) => handleCoefficientChange(row, 2, e.target.value)}
              />
              <span>y =</span>
              <input
                type="number"
                placeholder={`b${row}`}
                className="p-2 border rounded w-1/4"
                onChange={(e) => handleCoefficientChange(row, 3, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {variables === 3 && (
        <div className="space-y-4">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex space-x-2 items-center">
              <input
                type="number"
                placeholder={`a${row}1`}
                className="p-2 border rounded w-1/6"
                onChange={(e) => handleCoefficientChange(row, 1, e.target.value)}
              />
              <span>x +</span>
              <input
                type="number"
                placeholder={`a${row}2`}
                className="p-2 border rounded w-1/6"
                onChange={(e) => handleCoefficientChange(row, 2, e.target.value)}
              />
              <span>y +</span>
              <input
                type="number"
                placeholder={`a${row}3`}
                className="p-2 border rounded w-1/6"
                onChange={(e) => handleCoefficientChange(row, 3, e.target.value)}
              />
              <span>z =</span>
              <input
                type="number"
                placeholder={`b${row}`}
                className="p-2 border rounded w-1/6"
                onChange={(e) => handleCoefficientChange(row, 4, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={solveEquations}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
      >
        Solve Equations
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-xl font-semibold">Solution:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default LinearEquationSolver;
