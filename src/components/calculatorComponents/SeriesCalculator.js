import React, { useState } from 'react';
import TypewriterResponsePlain from '../TypeWriterResponsePlain';

const nerdamer = require("nerdamer/all.min.js")

const SeriesCalculator = () => {
  const [sequenceType, setSequenceType] = useState('arithmetic');
  const [nthTerm, setNthTerm] = useState(null);
  const [mthTerm, setMthTerm] = useState(null);
  const [nValue, setNValue] = useState(null);
  const [mValue, setMValue] = useState(null);
  const [termToCalculate, setTermToCalculate] = useState(null);
  const [summationExpr, setSummationExpr] = useState('');
  const [summationFrom, setSummationFrom] = useState(null);
  const [summationTo, setSummationTo] = useState(null);
  const [result, setResult] = useState(null);
  const [recurrenceCoefficients, setRecurrenceCoefficients] = useState({ t_n: 1, t_n1: 0, t_n2: 0 });
  const [initialConditions, setInitialConditions] = useState({ t0: 0, t1: 0 });

  const calculateArithmetic = () => {
    const d = (mthTerm - nthTerm) / (mValue - nValue);
    const a = nthTerm - d * (nValue - 1);
    const expression = `\\[${a} + (${d}) \\times (n - 1)\\]`;
    const calculatedTerm = a + d * (termToCalculate - 1);
    setResult({ expression, calculatedTerm });
  };

  const calculateGeometric = () => {
    const r = Math.pow(mthTerm / nthTerm, 1 / (mValue - nValue));
    const a = nthTerm / Math.pow(r, nValue - 1);
    const expression = `\\[${a} \\times (${r})^{(n - 1)}\\]`;
    const calculatedTerm = a * Math.pow(r, termToCalculate - 1);
    setResult({ expression, calculatedTerm });
  };

  const calculateRecurrence = () => {
    try {
      const { t_n, t_n1, t_n2 } = recurrenceCoefficients;
      const { t0, t1 } = initialConditions;
  
      const characteristicEquation = `${t_n}*r^2 - ${t_n1}*r - ${t_n2}`;
  
      const roots = nerdamer.solve(characteristicEquation, 'r').text('decimal', 6);
      let expression;
      let nthTermValue = 0;
  
      if (roots.includes(',')) {
        const [r1, r2] = roots.slice(1, -1).split(',');
  console.log(r1,r2)

          const r1Parsed = parseFloat(r1.slice(1));
          const r2Parsed = parseFloat(r2.slice(1));
  
          const determinant = r1Parsed - r2Parsed;
          const C1 = (t0 * r2Parsed - t1) / determinant;
          const C2 = (t1 - t0 * r1Parsed) / determinant;
  
          expression = `\\[T_n = (${C1}) * (${r1Parsed})^n + (${C2}) * (${r2Parsed})^n\\]`;
        
      } else {
        const repeatedRoot = parseFloat(roots.slice(2.-1));
  


        const a = t0; 
        const b = (t1 - a * repeatedRoot) / (repeatedRoot); 

        expression = `\\[T_n = (${a}) * (${repeatedRoot})^n + (${b}) * n * (${repeatedRoot})^n\\]`;
      }
  
      let tPrev2 = t0;
      let tPrev1 = t1;
  
      for (let i = 2; i <= termToCalculate-1; i++) {
        nthTermValue = t_n1 * tPrev1 + t_n2 * tPrev2;
        tPrev2 = tPrev1;
        tPrev1 = nthTermValue;
      }
  
      setResult({ expression, calculatedTerm: nthTermValue });
    } catch (e) {
      setResult({ error: 'Error solving recurrence relation.' });
    }
  };
  
  

  const calculateSummation = () => {
    try {
      if (!summationExpr || !summationFrom || !summationTo) {
        setResult({ error: 'Please provide all summation inputs.' });
        return;
      }

      const to = summationTo === 'infinity' ? 10000 : summationTo;
      const summation = nerdamer.sum(summationExpr, 'n', summationFrom, to);
      const calculatedSum = summation.text('decimal',5).slice(1);

      const summationExprToDis = '\\[' +summationExpr + '\\]'
      setResult({ expression: summationExprToDis, calculatedSum });
    } catch (e) {
      setResult({ error: 'Error evaluating the summation.' });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Series Calculator</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Sequence Type:</label>
        <select
          className="p-2 border rounded w-full"
          value={sequenceType}
          onChange={(e) => setSequenceType(e.target.value)}
        >
          <option value="arithmetic">Arithmetic Sequence</option>
          <option value="geometric">Geometric Sequence</option>
          <option value="recurrence">Recurrence Relation</option>
          <option value="summation">Summation</option>
        </select>
      </div>

      {sequenceType === 'arithmetic' && (
        <div className="space-y-4">
          <input
            type="number"
            placeholder="n value"
            className="p-2 border rounded w-full"
            onChange={(e) => setNValue(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="n-th term"
            className="p-2 border rounded w-full"
            onChange={(e) => setNthTerm(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="m value"
            className="p-2 border rounded w-full"
            onChange={(e) => setMValue(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="m-th term"
            className="p-2 border rounded w-full"
            onChange={(e) => setMthTerm(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Term to calculate"
            className="p-2 border rounded w-full"
            onChange={(e) => setTermToCalculate(Number(e.target.value))}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={calculateArithmetic}
          >
            Calculate Arithmetic Sequence
          </button>
        </div>
      )}

      {sequenceType === 'geometric' && (
        <div className="space-y-4">
          <input
            type="number"
            placeholder="n value"
            className="p-2 border rounded w-full"
            onChange={(e) => setNValue(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="n-th term"
            className="p-2 border rounded w-full"
            onChange={(e) => setNthTerm(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="m value"
            className="p-2 border rounded w-full"
            onChange={(e) => setMValue(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="m-th term"
            className="p-2 border rounded w-full"
            onChange={(e) => setMthTerm(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Term to calculate"
            className="p-2 border rounded w-full"
            onChange={(e) => setTermToCalculate(Number(e.target.value))}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={calculateGeometric}
          >
            Calculate Geometric Sequence
          </button>
        </div>
      )}

{sequenceType === 'recurrence' && (
        <div className="space-y-4">
          <TypewriterResponsePlain content={'for the recurrence relation \\[aT_n=bT_{n-1}+cT_{n-2}\\]'}/>
          <input
            type="number"
            placeholder="Coefficient a of T(n)"
            className="p-2 border rounded w-full"
            onChange={(e) => setRecurrenceCoefficients((prev) => ({ ...prev, t_n: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Coefficient b of T(n-1)"
            className="p-2 border rounded w-full"
            onChange={(e) => setRecurrenceCoefficients((prev) => ({ ...prev, t_n1: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Coefficient c of T(n-2)"
            className="p-2 border rounded w-full"
            onChange={(e) => setRecurrenceCoefficients((prev) => ({ ...prev, t_n2: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Initial Condition T(0)"
            className="p-2 border rounded w-full"
            onChange={(e) => setInitialConditions((prev) => ({ ...prev, t0: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Initial Condition T(1)"
            className="p-2 border rounded w-full"
            onChange={(e) => setInitialConditions((prev) => ({ ...prev, t1: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Term to calculate"
            className="p-2 border rounded w-full"
            onChange={(e) => setTermToCalculate(Number(e.target.value))}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={calculateRecurrence}
          >
            Calculate Recurrence Relation
          </button>
        </div>
      )}

      {sequenceType === 'summation' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Expression for n-th term (e.g., n^2)"
            className="p-2 border rounded w-full"
            onChange={(e) => setSummationExpr(e.target.value)}
          />
          <input
            type="number"
            placeholder="Summation from"
            className="p-2 border rounded w-full"
            onChange={(e) => setSummationFrom(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="Summation to (or 'infinity')"
            className="p-2 border rounded w-full"
            onChange={(e) => setSummationTo(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={calculateSummation}
          >
            Calculate Summation
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p><strong>Expression:</strong> </p>
              <TypewriterResponsePlain content={result.expression}/>

              {result.calculatedTerm && <p><strong>Calculated Term:</strong> {result.calculatedTerm}</p>}
              {result.calculatedSum && <p><strong>Summation Result:</strong> {result.calculatedSum}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SeriesCalculator;
