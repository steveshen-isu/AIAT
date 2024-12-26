import React, { useState } from 'react';
import nerdamer from 'nerdamer';
import TypewriterResponsePlain from '../TypeWriterResponsePlain';

const ComplexNumberOperations = () => {
  const [expression, setExpression] = useState('');
  const [operation, setOperation] = useState('polar');
  const [result, setResult] = useState(null);

  const calculateResult = () => {
    try {
      let calculation;
      switch (operation) {
        case 'polar':
          calculation = '\\['+ nerdamer(`polarform(${expression})`).toTeX() + '\\]';
          break;
        case 'argument':
          calculation = nerdamer(`arg(${expression})`).text('decimal').slice(1);
          break;
        case 'rectangle':
          calculation = '\\['+ nerdamer(`rectform(${expression})`).toTeX() + '\\]';
          break;
        case 'real':
          calculation = nerdamer(`realpart(${expression})`).text('decimal').slice(1);
          break;
        case 'imaginary':
          calculation = nerdamer(`imagpart(${expression})`).text('decimal').slice(1);
          break;
        default:
          calculation = 'Invalid operation';
      }
      setResult(calculation);
    } catch (e) {
      setResult('Error in calculation. Please check your input.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Complex Number Operations</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Enter Complex Expression:</label>
        <input
          type="text"
          placeholder="e.g., 5 + 3*i"
          className="p-2 border rounded w-full"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Operation:</label>
        <select
          className="p-2 border rounded w-full"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="polar">Polar Form</option>
          <option value="argument">Argument</option>
          <option value="rectangle">Rectangle Form</option>
          <option value="real">Real Part</option>
          <option value="imaginary">Imaginary Part</option>
        </select>
      </div>

      <button
        onClick={calculateResult}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded-lg">
          <h3 className="text-xl font-semibold">Result:</h3>
          <TypewriterResponsePlain content={result}/>
        </div>
      )}
    </div>
  );
};

export default ComplexNumberOperations;
