import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataAnalysisComponent = () => {
  const [data, setData] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [histogramData, setHistogramData] = useState(null);

  const [binCount,setBinCount] = useState(6)
  const handleAnalyze = () => {
    if (!data.trim()) {
      alert('Please enter some data to analyze.');
      return;
    }

    const numbers = data.split(',').map((num) => parseFloat(num.trim())).filter((num) => !isNaN(num));

    if (numbers.length === 0) {
      alert('Please enter valid numeric data separated by commas.');
      return;
    }

    numbers.sort((a, b) => a - b);

    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / numbers.length;
    const min = numbers[0];
    const max = numbers[numbers.length - 1];
    const median =
      numbers.length % 2 === 0
        ? (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2
        : numbers[Math.floor(numbers.length / 2)];
    const q1 = numbers[Math.floor(numbers.length / 4)];
    const q3 = numbers[Math.floor((3 * numbers.length) / 4)];
    const iqr = q3 - q1;
    const stdDev = Math.sqrt(
      numbers.reduce((acc, curr) => acc + Math.pow(curr - average, 2), 0) / numbers.length
    );
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = numbers.filter((num) => num < lowerBound || num > upperBound);

    setAnalysisResult({
      sum,
      average,
      min,
      max,
      median,
      q1,
      q3,
      iqr,
      stdDev,
      lowerBound,
      upperBound,
      outliers,
    });

    
    const histogramBins = Array.from({ length: binCount }, (_, i) => min + ((max - min) / binCount) * i);
    const histogramCounts = new Array(histogramBins.length).fill(0);
    numbers.forEach((num) => {
      const binIndex = Math.min(
        Math.floor(((num - min) / (max - min)) * histogramBins.length),
        histogramBins.length - 1
      );
      histogramCounts[binIndex]++;
    });
    setHistogramData({
      labels: histogramBins.map((bin, i) => (i === histogramBins.length - 1 ? `${bin.toFixed(1)}+` : `${bin.toFixed(1)}-${(bin + (max - min) / 10).toFixed(1)}`)),
      datasets: [
        {
          label: 'Frequency',
          data: histogramCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const increaseBins = () => {
    setBinCount((prev) => {
      const newBinCount = prev + 1;
      handleAnalyze();
      return newBinCount;
    });
  };

  const decreaseBins = () => {
    setBinCount((prev) => {
      const newBinCount = Math.max(1, prev - 1);
      handleAnalyze();
      return newBinCount;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Analysis</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        rows="4"
        placeholder="Enter numbers separated by commas (e.g., 1, 2, 3)"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Analyze Data
      </button>

      {analysisResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-xl font-semibold">Analysis Result</h3>
          <p><strong>Sum:</strong> {analysisResult.sum}</p>
          <p><strong>Average:</strong> {analysisResult.average}</p>
          <p><strong>Standard Deviation:</strong> {analysisResult.stdDev.toFixed(2)}</p>
          <p><strong>Minimum Value:</strong> {analysisResult.min}</p>
          <p><strong>25th Percentile (Q1):</strong> {analysisResult.q1}</p>
          <p><strong>Median (50th Percentile):</strong> {analysisResult.median}</p>
          <p><strong>75th Percentile (Q3):</strong> {analysisResult.q3}</p>
          <p><strong>Maximum Value:</strong> {analysisResult.max}</p>
          <p><strong>Interquartile Range (IQR):</strong> {analysisResult.iqr}</p>
          <p><strong>Outlier Boundaries:</strong> [{analysisResult.lowerBound.toFixed(2)}, {analysisResult.upperBound.toFixed(2)}]</p>
          <p><strong>Outliers:</strong> {analysisResult.outliers.join(', ') || 'None'}</p>
        </div>
      )}

      {histogramData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Histogram</h3>
          <div style={{ height: '300px' }}>
            <Bar data={histogramData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={increaseBins}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Increase Bins
            </button>
            <button
              onClick={decreaseBins}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Decrease Bins
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisComponent;
