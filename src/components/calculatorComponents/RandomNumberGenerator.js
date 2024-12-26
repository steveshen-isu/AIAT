import React, { useState } from 'react';
import * as d3 from 'd3';

const RandomNumberGenerator = () => {
  const [distribution, setDistribution] = useState('uniform');
  const [parameters, setParameters] = useState({});
  const [count, setCount] = useState(10);
  const [asInteger, setAsInteger] = useState(false);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = () => {
    let numbers = [];
    switch (distribution) {
      case 'uniform': {
        const { min = 0, max = 1 } = parameters;
        numbers = d3.range(count).map(() => d3.randomUniform(min, max)());
        break;
      }
      case 'normal': {
        const { mean = 0, stdDev = 1 } = parameters;
        numbers = d3.range(count).map(() => d3.randomNormal(mean, stdDev)());
        break;
      }
      case 'binomial': {
        const { trials = 10, probability = 0.5 } = parameters;
        numbers = d3.range(count).map(() => {
          let successes = 0;
          for (let i = 0; i < trials; i++) {
            if (Math.random() < probability) successes++;
          }
          return successes;
        });
        break;
      }
      case 'poisson': {
        const { lambda = 1 } = parameters;
        numbers = d3.range(count).map(() => d3.randomPoisson(lambda)());
        break;
      }
      case 't-distribution': {
        const { df = 1 } = parameters;
        numbers = d3.range(count).map(() => d3.randomNormal(0, 1 / Math.sqrt(df))());
        break;
      }
      case 'chi-square': {
        const { df = 1 } = parameters;
        numbers = d3.range(count).map(() => d3.randomGamma(df / 2, 2)());
        break;
      }
      default:
        break;
    }
    if (asInteger) {
      numbers = numbers.map((num) => Math.round(num));
    }
    setRandomNumbers(numbers);
    setCopySuccess(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(randomNumbers.join(', ')).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Random Number Generator</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Distribution:</label>
        <select
          className="p-2 border rounded w-full"
          value={distribution}
          onChange={(e) => {
            setDistribution(e.target.value);
            setParameters({});
          }}
        >
          <option value="uniform">Uniform</option>
          <option value="normal">Normal</option>
          <option value="binomial">Binomial</option>
          <option value="poisson">Poisson</option>
          <option value="t-distribution">T-Distribution</option>
          <option value="chi-square">Chi-Square</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Set Parameters:</label>
        {distribution === 'uniform' && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min"
              className="p-2 border rounded w-full"
              value={parameters.min || ''}
              onChange={(e) => setParameters({ ...parameters, min: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Max"
              className="p-2 border rounded w-full"
              value={parameters.max || ''}
              onChange={(e) => setParameters({ ...parameters, max: parseFloat(e.target.value) })}
            />
          </div>
        )}
        {distribution === 'normal' && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Mean (default 0)"
              className="p-2 border rounded w-full"
              value={parameters.mean || ''}
              onChange={(e) => setParameters({ ...parameters, mean: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Standard Deviation"
              className="p-2 border rounded w-full"
              value={parameters.stdDev || ''}
              onChange={(e) => setParameters({ ...parameters, stdDev: parseFloat(e.target.value) })}
            />
          </div>
        )}
        {distribution === 'binomial' && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Number of Trials"
              className="p-2 border rounded w-full"
              value={parameters.trials || ''}
              onChange={(e) => setParameters({ ...parameters, trials: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Probability"
              className="p-2 border rounded w-full"
              step="0.01"
              value={parameters.probability || ''}
              onChange={(e) => setParameters({ ...parameters, probability: parseFloat(e.target.value) })}
            />
          </div>
        )}
        {distribution === 'poisson' && (
          <input
            type="number"
            placeholder="Lambda"
            className="p-2 border rounded w-full"
            value={parameters.lambda || ''}
            onChange={(e) => setParameters({ ...parameters, lambda: parseFloat(e.target.value) })}
          />
        )}
        {distribution === 't-distribution' && (
          <input
            type="number"
            placeholder="Degrees of Freedom"
            className="p-2 border rounded w-full"
            value={parameters.df || ''}
            onChange={(e) => setParameters({ ...parameters, df: parseFloat(e.target.value) })}
          />
        )}
        {distribution === 'chi-square' && (
          <input
            type="number"
            placeholder="Degrees of Freedom"
            className="p-2 border rounded w-full"
            value={parameters.df || ''}
            onChange={(e) => setParameters({ ...parameters, df: parseFloat(e.target.value) })}
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Number of Random Numbers:</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={asInteger}
            onChange={(e) => setAsInteger(e.target.checked)}
          />
          Output as Integers
        </label>
      </div>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Generate Random Numbers
      </button>

      {randomNumbers.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-xl font-semibold">Generated Numbers</h3>
          <p>{randomNumbers.join(', ')}</p>
          <button
            onClick={handleCopy}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Copy to Clipboard
          </button>
          {copySuccess && <p className="text-green-600 mt-2">Copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
