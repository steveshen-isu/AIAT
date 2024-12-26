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
import nerdamer from 'nerdamer';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const NumericalIntegration = () => {
  const [method, setMethod] = useState('left');
  const [expression, setExpression] = useState('');
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(1);
  const [intervals, setIntervals] = useState(10);
  const [result, setResult] = useState(null);
  const [functionChartData, setFunctionChartData] = useState(null);
  const [areaChartData, setAreaChartData] = useState(null);

  const evaluateFunction = (x) => {
    try {
      const value = nerdamer(expression, { x }).evaluate().text();
      return parseFloat(value);
    } catch {
      return NaN;
    }
  };

  const calculateArea = () => {
    const step = (upperLimit - lowerLimit) / intervals;
    let area = 0;
    let xValues = [];
    let yValues = [];
    let filledX = [];
    let filledY = [];

    for (let i = 0; i <= intervals; i++) {
      const x = lowerLimit + i * step;
      const y = evaluateFunction(x);
      xValues.push(x);
      yValues.push(y);

      if (method === 'left' && i < intervals) {
        area += y * step;
        filledX.push(x, x + step);
        filledY.push(y, y);
      } else if (method === 'right' && i > 0) {
        area += y * step;
        filledX.push(x - step, x);
        filledY.push(y, y);
      } else if (method === 'trapezoid' && i > 0) {
        const prevY = evaluateFunction(x - step);
        area += ((prevY + y) / 2) * step;
        filledX.push(x - step, x);
        filledY.push(prevY, y);
      } else if (method === 'simpson' && i > 0 && i % 2 === 0) {
        const prevX = x - 2 * step;
        const midX = x - step;
        const prevY = evaluateFunction(prevX);
        const midY = evaluateFunction(midX);
        area += (step / 3) * (prevY + 4 * midY + y);
        filledX.push(prevX, midX, x);
        filledY.push(prevY, midY, y);
      }
    }

    const denseXValues = [];
    const denseYValues = [];
    const denseStep = step / 10;

    for (let x = lowerLimit; x <= upperLimit; x += denseStep) {
      denseXValues.push(x);
      denseYValues.push(evaluateFunction(x));
    }

    setResult(area);

    setFunctionChartData({
      labels: denseXValues,
      datasets: [
        {
          label: 'Function',
          data: denseYValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    });

    setAreaChartData({
      labels: filledX,
      datasets: [
        {
          label: 'Approximated Area',
          data: filledY,
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 3,
          fill: true,
          pointRadius: 0, 
          pointHoverRadius: 0, 
          stepped: method === 'left' || method === 'right',
          cubicInterpolationMode: method === 'simpson' ? 'monotone' : undefined,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        min: lowerLimit,
        max: upperLimit,
        title: {
          display: true,
          text: 'x',
        },
      },
      y: {
        title: {
          display: true,
          text: 'y',
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Numerical Integration</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Enter Function:</label>
        <input
          type="text"
          placeholder="e.g., x^2 + 2*(cos(x) + x*x)"
          className="p-2 border rounded w-full"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">Lower Limit:</label>
          <input
            type="number"
            className="p-2 border rounded w-full"
            value={lowerLimit}
            onChange={(e) => setLowerLimit(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Upper Limit:</label>
          <input
            type="number"
            className="p-2 border rounded w-full"
            value={upperLimit}
            onChange={(e) => setUpperLimit(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Number of Intervals:</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={intervals}
          onChange={(e) => setIntervals(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Method:</label>
        <select
          className="p-2 border rounded w-full"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="left">Left Endpoint</option>
          <option value="right">Right Endpoint</option>
          <option value="trapezoid">Trapezoid</option>
          <option value="simpson">Simpson</option>
        </select>
      </div>

      <button
        onClick={calculateArea}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Calculate Area
      </button>

      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 border rounded-lg">
          <h3 className="text-xl font-semibold">Result:</h3>
          <p>Approximated Area: {result.toFixed(4)}</p>
        </div>
      )}

      {functionChartData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Function Visualization</h3>
          <div style={{ height: '300px' }}>
            <Line data={functionChartData} options={options} />
          </div>
        </div>
      )}

      {areaChartData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Approximated Area</h3>
          <div style={{ height: '300px' }}>
            <Line data={areaChartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NumericalIntegration;
