import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function ProbExperiments() {

    const [experiment, setExperiment] = useState('balls');


    const [colors, setColors] = useState([
        { name: 'Red', count: 5 },
        { name: 'Blue', count: 3 },
    ]);

    const [drawCount, setDrawCount] = useState(3);
    const [numExperiments, setNumExperiments] = useState(10);

    const [biasHeads, setBiasHeads] = useState(0.5);
    const [coinMode, setCoinMode] = useState('single');
    const [numCoinTrials, setNumCoinTrials] = useState(50);


    const [numDice, setNumDice] = useState(2);
    const [numDiceRolls, setNumDiceRolls] = useState(50);
    const [sequenceString, setSequenceString] = useState('');

    const [chartData, setChartData] = useState(null);
    const [chartTitle, setChartTitle] = useState('');


    const handleExperimentChange = (e) => {
        setExperiment(e.target.value);
        setChartData(null);
    };

    const runBallExperiments = () => {
        let box = [];
        colors.forEach((c) => {
            for (let i = 0; i < c.count; i++) {
                box.push(c.name);
            }
        });
        const totalBalls = box.length;
        if (totalBalls < drawCount) {
            alert('Not enough balls in the box to draw that many!');
            return;
        }
        if (drawCount <= 0) {
            alert('Draw count must be at least 1.');
            return;
        }


        let freq = {};
        colors.forEach((c) => {
            let maxForThisColor = Math.min(drawCount, c.count);
            freq[c.name] = new Array(maxForThisColor + 1).fill(0);
        });

        for (let experimentIndex = 0; experimentIndex < numExperiments; experimentIndex++) {
            let boxCopy = [...box];
            for (let i = boxCopy.length - 1; i > 0; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                [boxCopy[i], boxCopy[rand]] = [boxCopy[rand], boxCopy[i]];
            }
            const drawnBalls = boxCopy.slice(0, drawCount);

            let colorTally = {};
            colors.forEach((c) => {
                colorTally[c.name] = 0;
            });
            drawnBalls.forEach((ballColor) => {
                colorTally[ballColor] += 1;
            });

            colors.forEach((c) => {
                let countOfThisColor = colorTally[c.name];
                if (countOfThisColor > freq[c.name].length - 1) {
                    countOfThisColor = freq[c.name].length - 1;
                }
                freq[c.name][countOfThisColor] += 1;
            });
        }


        let maxX = 0;
        colors.forEach((c) => {
            let len = freq[c.name].length - 1;
            if (len > maxX) {
                maxX = len;
            }
        });

        const labels = [];
        for (let i = 0; i <= maxX; i++) {
            labels.push(i.toString());
        }

        const datasets = colors.map((c) => {
            const arr = freq[c.name];

            const padded = [...arr];
            while (padded.length < maxX + 1) {
                padded.push(0);
            }

            return {
                label: c.name,
                data: padded,
                backgroundColor: c.name.toLowerCase(),
            };
        });

        setChartData({
            labels,
            datasets,
        });

        setChartTitle(
            `Distribution of Counts (Draw ${drawCount} without replacement, ${numExperiments} trials)`
        );
    };


    const runCoinExperiment = () => {
        if (coinMode === 'single') {

            let flips = [];
            let flipCount = 0;
            while (true) {
                flipCount++;
                const rand = Math.random();
                if (rand < biasHeads) {
                    flips.push(1);
                } else {
                    flips.push(0);
                    break;
                }
            }
            const labels = flips.map((_, i) => `Flip ${i + 1}`);
            const flipNames = flips.map((val) => (val === 1 ? 'Head' : 'Tail'));
            const outcomeString = flipNames.join(', ');
            setSequenceString(outcomeString);
            const data = {
                labels,
                datasets: [
                    {
                        label: 'Heads(1) / Tails(0)',
                        data: flips,
                        backgroundColor: flips.map((val) =>
                            val === 1 ? 'rgb(75,192,192)' : 'rgb(192,75,75)'
                        ),
                    },
                ],
            };
            setChartData(data);
            setChartTitle(`Flips until First Tail (Total flips: ${flipCount})`);
        } else {

            const freq = {};
            for (let i = 0; i < numCoinTrials; i++) {
                let count = 0;
                while (true) {
                    count++;
                    if (Math.random() >= biasHeads) {
                        // Tail
                        break;
                    }
                }
                freq[count] = (freq[count] || 0) + 1;
            }

            const labels = Object.keys(freq)
                .map((k) => parseInt(k))
                .sort((a, b) => a - b);
            const dataValues = labels.map((k) => freq[k]);

            const data = {
                labels: labels.map((k) => `#Flips = ${k}`),
                datasets: [
                    {
                        label: 'Count',
                        data: dataValues,
                        backgroundColor: 'rgba(75,192,192,0.8)',
                    },
                ],
            };
            setChartData(data);
            setChartTitle('Distribution of #Flips Until First Tail');
        }
    };

    const runDiceExperiment = () => {

        const freq = {};
        for (let i = 0; i < numDiceRolls; i++) {
            let sum = 0;
            for (let d = 0; d < numDice; d++) {
                sum += Math.floor(Math.random() * 6) + 1;
            }
            freq[sum] = (freq[sum] || 0) + 1;
        }


        const allSums = Object.keys(freq)
            .map((k) => parseInt(k))
            .sort((a, b) => a - b);

        const dataValues = allSums.map((sum) => freq[sum]);

        const data = {
            labels: allSums.map((s) => `Sum ${s}`),
            datasets: [
                {
                    label: 'Frequency',
                    data: dataValues,
                    backgroundColor: 'rgba(153,102,255,0.6)',
                },
            ],
        };
        setChartData(data);
        setChartTitle(`Dice Sum Distribution (${numDice} dice)`);
    };


    const renderBallsExperiment = () => {
        return (
            <div className="max-w-3xl mx-auto flex flex-col justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">
                    Drawing Balls (Without Replacement)
                </h1>

                <div className="mb-4 flex flex-col justify-center" >
                    <p className="font-medium">Colors & Number of Balls</p>
                    {colors.map((c, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 mt-2">
                            <input
                                type="text"
                                value={c.name}
                                onChange={(e) => {
                                    const newColors = [...colors];
                                    newColors[idx].name = e.target.value;
                                    setColors(newColors);
                                }}
                                className="border rounded px-2 py-1 w-20"
                            />
                            <input
                                type="number"
                                min="0"
                                value={c.count}
                                onChange={(e) => {
                                    const newColors = [...colors];
                                    newColors[idx].count = parseInt(e.target.value) || 0;
                                    setColors(newColors);
                                }}
                                className="border rounded px-2 py-1 w-16"
                            />
                            <button
                                onClick={() => {
                                    setColors(colors.filter((_, i) => i !== idx));
                                }}
                                className="px-2 py-1 text-white bg-red-500 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {colors.length < 4 && (
                        <button
                            onClick={() => {
                                if (colors.some((c) => c.name === 'Green')) {
                                    setColors([...colors, { name: 'Yellow', count: 1 }]);
                                } else {
                                    setColors([...colors, { name: 'Green', count: 1 }]);
                                }
                            }}
                            className="mt-2 px-3 py-1 bg-gray-200 rounded"
                        >
                            + Add Color
                        </button>
                    )}
                </div>

                <div className="mb-4 flex flex-row gap-6">
                    <div className="flex item-center">
                        <label className="font-medium">Number of Balls Drawn Each Trial</label>
                        <input
                            type="number"
                            min="1"
                            value={drawCount}
                            onChange={(e) => setDrawCount(parseInt(e.target.value) || 1)}
                            className="border rounded px-2 py-1 mt-1 w-24"
                        />
                    </div>
                    <div className="flex justify-center">
                        <label className="font-medium">Number of Experiments (Trials)</label>
                        <input
                            type="number"
                            min="1"
                            value={numExperiments}
                            onChange={(e) =>
                                setNumExperiments(parseInt(e.target.value) || 1)
                            }
                            className="border rounded px-2 py-1 mt-1 w-24"
                        />
                    </div>
                </div>

                <button
                    onClick={runBallExperiments}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Run Experiments
                </button>
            </div>
        );
    };

    const renderCoinExperiment = () => {
        return (
            <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-xl font-semibold">Flip Coins</h2>

                <label className="mt-2 font-medium">Bias (prob of heads)</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={biasHeads}
                    onChange={(e) => setBiasHeads(parseFloat(e.target.value) || 0.5)}
                    className="border rounded px-2 py-1 w-24 mt-1"
                />

                <label className="mt-4 font-medium">Mode</label>
                <select
                    value={coinMode}
                    onChange={(e) => setCoinMode(e.target.value)}
                    className="border rounded px-2 py-1 w-60 mt-1"
                >
                    <option value="single">Single Sequence Until Tail</option>
                    <option value="multiple">Multiple Trials (Distribution)</option>
                </select>

                {coinMode === 'single' && sequenceString && (
                    <div className="mt-4">
                        <p className="font-semibold">Sequence of Outcomes:</p>
                        <p>{sequenceString}</p>
                    </div>
                )}
                
                {coinMode === 'multiple' && (
                    <>
                        <label className="mt-2 font-medium">Number of Trials</label>
                        <input
                            type="number"
                            min="1"
                            value={numCoinTrials}
                            onChange={(e) =>
                                setNumCoinTrials(parseInt(e.target.value) || 50)
                            }
                            className="border rounded px-2 py-1 w-44 mt-1"
                        />
                    </>
                )}

                <button
                    onClick={runCoinExperiment}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Run Experiment
                </button>
            </div>
        );
    };

    const renderDiceExperiment = () => {
        return (
            <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-xl font-semibold">Roll Dice</h2>

                <label className="mt-2 font-medium">Number of Dice</label>
                <input
                    type="number"
                    min="1"
                    max="6"
                    value={numDice}
                    onChange={(e) => setNumDice(parseInt(e.target.value) || 1)}
                    className="border rounded px-2 py-1 w-24 mt-1"
                />

                <label className="mt-4 font-medium">Number of Rolls</label>
                <input
                    type="number"
                    min="1"
                    value={numDiceRolls}
                    onChange={(e) =>
                        setNumDiceRolls(parseInt(e.target.value) || 50)
                    }
                    className="border rounded px-2 py-1 w-24 mt-1"
                />

                <button
                    onClick={runDiceExperiment}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Run Experiment
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Probability Experiments
            </h1>

            <div className="mb-6">
                <label className="mr-4 font-medium">Choose Experiment:</label>
                <select
                    value={experiment}
                    onChange={handleExperimentChange}
                    className="border rounded px-2 py-1 w-48"
                >
                    <option value="balls">Draw Balls from Box</option>
                    <option value="coins">Flip Coins</option>
                    <option value="dice">Roll Dice</option>
                </select>
            </div>

            {experiment === 'balls' && renderBallsExperiment()}
            {experiment === 'coins' && renderCoinExperiment()}
            {experiment === 'dice' && renderDiceExperiment()}

            {chartData && (
                <div className="w-full h-96 mt-8">
                    <h3 className="text-lg font-bold mb-2">{chartTitle}</h3>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Frequency',
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

export default ProbExperiments;
