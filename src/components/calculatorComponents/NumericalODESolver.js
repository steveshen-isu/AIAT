import React, { useState } from 'react';
import nerdamer from 'nerdamer';
import 'nerdamer/all.min.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ODESolver() {

  const [order, setOrder] = useState('1'); 
  const [expr, setExpr] = useState('');    
  const [t0, setT0] = useState(0);         
  const [tFinal, setTFinal] = useState(10);
  const [step, setStep] = useState(0.01);   


  const [y0, setY0] = useState(1);
  const [v0, setV0] = useState(0); 

  const [chartData, setChartData] = useState(null);



  const evaluateExpr = (expression, t, y, v = 0) => {
    try {

      const res = nerdamer(expression, { x: t, y, v }).evaluate();
      return parseFloat(res.text());
    } catch (err) {
      console.error('Expression evaluation error:', err);
      return NaN;
    }
  };


  const solveODE = () => {
    const h = parseFloat(step);
    let t = parseFloat(t0);
    const end = parseFloat(tFinal);

    const tVals = [];
    const yVals = [];

   
    let yCurr = parseFloat(y0);
    let vCurr = parseFloat(v0);

    if (order === '1') {
     
      while (t <= end + 1e-9) {
        // Record
        tVals.push(t);
        yVals.push(yCurr);

      
        const fVal = evaluateExpr(expr, t, yCurr);
        const yNext = yCurr + h * fVal;

     
        t += h;
        yCurr = yNext;
      }
    } else {

      while (t <= end + 1e-9) {
        // Record
        tVals.push(t);
        yVals.push(yCurr);

        const gVal = evaluateExpr(expr, t, yCurr, vCurr);

       
        const yNext = yCurr + h * vCurr;
        const vNext = vCurr + h * gVal;

       
        t += h;
        yCurr = yNext;
        vCurr = vNext;
      }
    }

    setChartData({
      labels: tVals.map((value)=>value.toFixed(1)),
      datasets: [
        {
          label: 'y(t)',
          data: yVals,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        },
      ],
    });
  };


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Numerical ODE Solver
      </h1>

      <div className="mb-4 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order"
            value="1"
            checked={order === '1'}
            onChange={(e) => setOrder(e.target.value)}
          />
          First Order (y' = f(x,y))
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="order"
            value="2"
            checked={order === '2'}
            onChange={(e) => setOrder(e.target.value)}
          />
          Second Order (y'' = g(x,y,v))
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            {order === '1' ? "f(x, y)" : "g(x, y, v)"}
          </label>
          <input
            type="text"
            placeholder={order === '1' ? "e.g. -2*y + x" : "e.g. -2*y - 3*v"}
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <small className="text-gray-500 mt-1">
            Use <strong>x</strong> for variable, <strong>y</strong> for y(x), and <strong>v</strong> for y'(x).
          </small>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">x-range (x0 to xFinal)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t0}
              onChange={(e) => setT0(e.target.value)}
              className="border rounded px-2 py-1 w-1/2"
            />
            <input
              type="number"
              value={tFinal}
              onChange={(e) => setTFinal(e.target.value)}
              className="border rounded px-2 py-1 w-1/2"
            />
          </div>
          <label className="text-sm font-medium mt-2">Step Size (h)</label>
          <input
            type="number"
            step="any"
            value={step}
            onChange={(e) => setStep(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">y(x0)</label>
          <input
            type="number"
            step="any"
            value={y0}
            onChange={(e) => setY0(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        {order === '2' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">v(x0) = y'(x0)</label>
            <input
              type="number"
              step="any"
              value={v0}
              onChange={(e) => setV0(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        )}
      </div>

      <button
        onClick={solveODE}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Solve ODE
      </button>

      {chartData && (
        <div className="w-full h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'x',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'y(x)',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ODESolver;

