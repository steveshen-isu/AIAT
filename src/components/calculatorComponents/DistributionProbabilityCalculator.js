import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as d3 from 'd3';
import { jStat } from 'jstat';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const DistributionProbabilityCalculator = () => {
  const [distribution, setDistribution] = useState('normal');
  const [parameters, setParameters] = useState({});
  const [value, setValue] = useState(0);
  const [probability, setProbability] = useState(null);
  const [chartData, setChartData] = useState(null);

  const gamma = (n) => {
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    return (n - 1) * gamma(n - 1);
  };

  const calculateProbability = () => {
    let probLessThan = 0;
    let probGreaterThan = 0;
    let xValues = [];
    let yValues = [];
    let fillValuesX = [];
    let fillValuesY = [];

    switch (distribution) {
      case 'normal': {
        const { mean = 0, stdDev = 1 } = parameters;
        xValues = d3.range(mean - 4 * stdDev, mean + 4 * stdDev, 0.01);
        yValues = xValues.map((x) => (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)));
        probLessThan = probLessThan = jStat.normal.cdf(value, mean, stdDev);
        probGreaterThan = 1 - probLessThan;
        fillValuesX = xValues.filter((x) => x <= value);
        fillValuesY = fillValuesX.map((x, i) => (i % 2 === 0 ? 0 : (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))));
        break;
      }
      case 'uniform': {
        const { min = 0, max = 1 } = parameters;
        xValues = d3.range(min, max, 0.01);
        yValues = xValues.map(() => 1 / (max - min));
        if (value < min) {
          probLessThan = 0;
          probGreaterThan = 1;
        } else if (value > max) {
          probLessThan = 1;
          probGreaterThan = 0;
        } else {
          probLessThan = (value - min) / (max - min);
          probGreaterThan = 1 - probLessThan;
        }
        fillValuesX = xValues.filter((x) => x <= value);
        fillValuesY = fillValuesX.map((x, i) => (i % 2 === 0 ? 0 : 1 / (max - min)));
        break;
      }
      case 't-distribution': {
        const { df = 1 } = parameters;
        xValues = d3.range(-4, 4, 0.01);
        yValues = xValues.map((x) =>
          (gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2))) *
          Math.pow(1 + (x * x) / df, -(df + 1) / 2)
        );
        function tDistributionCDF(value, df) {
          return jStat.studentt.cdf(value, df);
        }
        
        probLessThan = tDistributionCDF(value, df);
        probGreaterThan = 1 - probLessThan;
        fillValuesX = xValues.filter((x) => x <= value);
        fillValuesY = fillValuesX.map((x, i) =>
          i % 2 === 0
            ? 0
            : (gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2))) *
              Math.pow(1 + (x * x) / df, -(df + 1) / 2)
        );
        break;
      }
      case 'chi-square': {
        const { df = 1 } = parameters;
        xValues = d3.range(0, df * 3, 0.01);
        yValues = xValues.map((x) =>
          (1 / (Math.pow(2, df / 2) * gamma(df / 2))) *
          Math.pow(x, (df / 2) - 1) * Math.exp(-x / 2)
        );
        probLessThan = probLessThan = jStat.chisquare.cdf(value, df);
        probGreaterThan = 1 - probLessThan;
        fillValuesX = xValues.filter((x) => x <= value);
        fillValuesY = fillValuesX.map((x, i) =>
          i % 2 === 0
            ? 0
            : (1 / (Math.pow(2, df / 2) * gamma(df / 2))) *
              Math.pow(x, (df / 2) - 1) * Math.exp(-x / 2)
        );
        break;
      }
      default:
        break;
    }

    setProbability({
      lessThan: probLessThan,
      greaterThan: probGreaterThan,
    });

    setChartData({
      labels: xValues,
      datasets: [
        {
          label: 'Probability Density',
          data: yValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Area Under Curve',
          data: fillValuesY,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderWidth: 1,
          fill: true,
          stepped: true,
          pointRadius: 0, 
          pointHoverRadius: 0, 
        },
      ],
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Distribution Probability Calculator</h2>

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
          <option value="normal">Normal</option>
          <option value="uniform">Uniform</option>
          <option value="t-distribution">T-Distribution</option>
          <option value="chi-square">Chi-Square</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Set Parameters:</label>
        {distribution === 'normal' && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Mean (0 by default)"
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
        {(distribution === 't-distribution' || distribution === 'chi-square') && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Degrees of Freedom"
              className="p-2 border rounded w-full"
              value={parameters.df || ''}
              onChange={(e) => setParameters({ ...parameters, df: parseFloat(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Value to Calculate Probability:</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
        />
      </div>

      <button
        onClick={calculateProbability}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Calculate Probability
      </button>

      {probability && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-xl font-semibold">Probability Results</h3>
          <p><strong>P(X &lt; {value}):</strong> {probability.lessThan.toFixed(4)}</p>
          <p><strong>P(X &gt; {value}):</strong> {probability.greaterThan.toFixed(4)}</p>
        </div>
      )}

      {chartData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Distribution Graph</h3>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionProbabilityCalculator;

