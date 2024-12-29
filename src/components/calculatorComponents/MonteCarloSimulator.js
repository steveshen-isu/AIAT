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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const MonteCarloSimulator = () => {
    const [experimentType, setExperimentType] = useState('stock');
    const [iterations, setIterations] = useState(1);
    const [timeSteps, setTimeSteps] = useState(100);
    const [parameters, setParameters] = useState({
        mean: 0,
        stddev: 10,
        initialValue: 0,
        stockInitialValue: 20,
        diceCount: 1,
        initialTemperature: 15,
        greenhouseEffect: 0.02,
        solarVariation: 0.01,
        oceanAbsorptionRate: 0.01,
        stochasticFactor: 0.005,
        aiLearningRate: 0.01,
        initialInfected: 10,
        population: 1000,
        spreadRate: 0.05,
        recoveryRate: 0.01,
        mobilityRate: 0.05,
        reinfectionRate: 0.01,
        stochasticFactor: 0.01,
        initialLearningRate: 0.01,
        dataQuality: 0.2,
        computationalPower: 0.2,
        randomness: 0.01,
        decayRate: 0.005,
        modelComplexity: 1.0,
        optimizationAlgorithmEfficiency: 0.9,
        batchSizeImpact: 0.05,
    });
    const [resultData, setResultData] = useState(null);
    const [quarantineOn, setQuarantineOn] = useState(false);
    const generateRandomNormal = (mean, stddev) => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const simulate = () => {
        let dataSets = [];

        for (let i = 0; i < iterations; i++) {
            let values = [parameters.initialValue];
            let infected = parameters.initialInfected;
            let susceptible = parameters.population - infected;
            let recovered = 0;
            let stockValues = [parameters.stockInitialValue]
            let infectedValues = [infected];
            let susceptibleValues = [susceptible];
            let recoveredValues = [recovered];
            let temperature = parameters.initialTemperature;
            let temperatureValues = [temperature];
            let learningRate = parameters.initialLearningRate;
            let learningRateValues = [learningRate];
            const IMMUNITY_DURATION = 200;
            const INFECTIOUS_DURATION = 7;
            let infectionQueue = new Array(INFECTIOUS_DURATION).fill(0);
            let recoveryQueue = new Array(IMMUNITY_DURATION).fill(0);

            for (let t = 1; t <= timeSteps; t++) {
                let previousValue = values[values.length - 1];
                const randomFactor = () => Math.random() * parameters.stochasticFactor * (Math.random() > 0.5 ? 1 : -1);

                if (experimentType === 'stock') {
                    let randomChange = generateRandomNormal(parameters.mean, parameters.stddev);
                    let previousStockValue = stockValues[stockValues.length - 1]
                    let newValue = previousStockValue * Math.exp(randomChange / 100);

                    if (newValue <= 0) {
                        newValue = 0;
                        break;
                    }

                    stockValues.push(newValue);
                } else if (experimentType === 'dice') {
                    let diceSum = 0;
                    for (let j = 0; j < parameters.diceCount; j++) {
                        diceSum += Math.floor(Math.random() * 6 + 1);
                    }
                    values.push(previousValue + diceSum);
                } else if (experimentType === 'custom') {
                    let randomChange = generateRandomNormal(parameters.mean, parameters.stddev);
                    values.push(previousValue + randomChange);
                } else if (experimentType === 'climate') {
                    const greenhouseEffectImpact = temperature * parameters.greenhouseEffect / parameters.oceanAbsorptionRate / 100;
                    const solarVariationImpact = parameters.solarVariation + randomFactor() / parameters.oceanAbsorptionRate * 2;
                    const oceanAbsorptionImpact = -temperature * parameters.oceanAbsorptionRate;

                    temperature += greenhouseEffectImpact + solarVariationImpact + oceanAbsorptionImpact;
                    temperatureValues.push(temperature);

                } else if (experimentType === 'ai') {
                    const baselineLearningRate = 0.01;
                    const decayImpact = -baselineLearningRate * (parameters.decayRate / (1 + 1));
                    const dataQualityImpact = 0.1 * baselineLearningRate * parameters.dataQuality;
                    const computationalPowerImpact = 0.05 * baselineLearningRate * parameters.computationalPower;
                    const modelComplexityImpact = -0.05 * baselineLearningRate * parameters.modelComplexity;
                    const optimizationEfficiencyImpact = 0.05 * baselineLearningRate * Math.log(parameters.optimizationAlgorithmEfficiency + 1);
                    const batchSizeImpact = -0.1 * baselineLearningRate * Math.log(parameters.batchSizeImpact + 1);
                    const stochasticImpact = randomFactor() * 0.01;

                    learningRate +=
                        dataQualityImpact +
                        computationalPowerImpact +
                        decayImpact +
                        modelComplexityImpact +
                        optimizationEfficiencyImpact +
                        batchSizeImpact +
                        stochasticImpact;

                    learningRate = Math.min(Math.max(0.0001, learningRate), 0.1);

                    learningRateValues.push(learningRate);
                } else if (experimentType === 'disease') {

                    const forcedToRecover = infectionQueue.shift();
                    infected -= forcedToRecover;
                    recovered += forcedToRecover;


                    const forcedToSusceptible = recoveryQueue.shift();
                    recovered -= forcedToSusceptible;
                    susceptible += forcedToSusceptible;


                    let mobilityEffect = susceptible * parameters.mobilityRate;

                    if (quarantineOn) { 
                        mobilityEffect = susceptible * parameters.mobilityRate * recovered / parameters.population 
                    }
                    const adjustedSpreadRate = parameters.spreadRate + 5 * randomFactor();
                    const adjustedRecoveryRate = parameters.recoveryRate + 5 * randomFactor();

                    let newInfections = (susceptible * infected * adjustedSpreadRate) / parameters.population
                        + mobilityEffect;
                    let newRecoveries = infected * adjustedRecoveryRate;

                    newInfections = Math.min(newInfections, susceptible);
                    newRecoveries = Math.min(newRecoveries, infected);

                    susceptible = Math.max(susceptible - newInfections, 0);
                    if (infected === 0) {
                        newInfections = 0;
                        newRecoveries = 0;
                    }

                    infected += (newInfections - newRecoveries);
                    infected = Math.max(
                        Math.min(infected, parameters.population - recovered),
                        0
                    );

                    recovered = parameters.population - susceptible - infected;

                    infectionQueue.push(newInfections);


                    const totalNewRecoveries = forcedToRecover + newRecoveries;
                    recoveryQueue.push(totalNewRecoveries);


                    infectedValues.push(infected);
                    susceptibleValues.push(susceptible);
                    recoveredValues.push(recovered);


                }
            }

            if (experimentType === 'disease') {
                dataSets.push(
                    {
                        label: `Infected Simulation ${i + 1}`,
                        data: infectedValues,
                        borderColor: `rgba(255, 99, 132, 0.5)`,
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: `Susceptible Simulation ${i + 1}`,
                        data: susceptibleValues,
                        borderColor: `rgba(54, 162, 235, 0.5)`,
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: `Recovered Simulation ${i + 1}`,
                        data: recoveredValues,
                        borderColor: `rgba(75, 192, 192, 0.5)`,
                        borderWidth: 1,
                        fill: false,
                    }
                );
            } else if (experimentType === 'climate') {
                dataSets.push({
                    label: `Simulation ${i + 1}`,
                    data: temperatureValues,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                    borderWidth: 1,
                    fill: false,
                });
            } else if (experimentType === 'stock') {
                dataSets.push({
                    label: `Simulation ${i + 1}`,
                    data: stockValues,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                    borderWidth: 1,
                    fill: false,
                })
            } else if (experimentType === 'ai') {
                dataSets.push({
                    label: `Simulation ${i + 1}`,
                    data: learningRateValues,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                    borderWidth: 1,
                    fill: false,
                });
            } else {
                dataSets.push({
                    label: `Simulation ${i + 1}`,
                    data: values,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                    borderWidth: 1,
                    fill: false,
                })
            };
        }

        setResultData({
            labels: Array.from({ length: timeSteps + 1 }, (_, i) => i),
            datasets: dataSets,
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Monte Carlo Simulator</h2>

            <div className="mb-4">
                <label className="block font-medium mb-2">Select Experiment Type:</label>
                <select
                    className="p-2 border rounded w-full"
                    value={experimentType}
                    onChange={(e) => setExperimentType(e.target.value)}
                >
                    <option value="stock">Stock Price Simulation</option>
                    <option value="dice">Dice Roll Simulation</option>
                    <option value="custom">Custom Experiment</option>
                    <option value="climate">Climate Change Modeling</option>
                    <option value="ai">AI Machine Learning Modeling</option>
                    <option value="disease">Disease Spreading Modeling</option>
                </select>
            </div>

            {experimentType === 'stock' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Overall Market Performance:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.mean}
                            onChange={(e) => setParameters((prev) => ({ ...prev, mean: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Price Band Percentage :</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.stddev}
                            onChange={(e) => setParameters((prev) => ({ ...prev, stddev: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Initial Stock Price:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.stockInitialValue}
                            onChange={(e) => setParameters((prev) => ({ ...prev, stockInitialValue: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Days:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {experimentType === 'dice' && (


                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Number of Dice:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.diceCount}
                            onChange={(e) => setParameters((prev) => ({ ...prev, diceCount: parseInt(e.target.value) }))}
                        /></div>
                    <div>
                        <label className="block font-medium mb-2">Initial Value:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.initialValue}
                            onChange={(e) => setParameters((prev) => ({ ...prev, initialValue: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Number of Rolls:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )}
            {experimentType === 'custom' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Mean:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.mean}
                            onChange={(e) => setParameters((prev) => ({ ...prev, mean: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Standard Deviation:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.stddev}
                            onChange={(e) => setParameters((prev) => ({ ...prev, stddev: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Initial Value:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.initialValue}
                            onChange={(e) => setParameters((prev) => ({ ...prev, initialValue: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Time Steps:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {experimentType === 'climate' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Initial Temperature (°C):</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.initialTemperature}
                            onChange={(e) => setParameters((prev) => ({ ...prev, initialTemperature: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Greenhouse Effect Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.greenhouseEffect}
                            onChange={(e) => setParameters((prev) => ({ ...prev, greenhouseEffect: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Solar Power Impact:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.solarVariation}
                            onChange={(e) => setParameters((prev) => ({ ...prev, solarVariation: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Ocean Absorption Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.oceanAbsorptionRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, oceanAbsorptionRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Stochastic Factor:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.stochasticFactor}
                            onChange={(e) => setParameters((prev) => ({ ...prev, stochasticFactor: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Years:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {experimentType === 'ai' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Initial Learning Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.initialLearningRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, initialLearningRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Data Quality (0-1):</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.dataQuality}
                            onChange={(e) => setParameters((prev) => ({ ...prev, dataQuality: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Computational Power:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.computationalPower}
                            onChange={(e) => setParameters((prev) => ({ ...prev, computationalPower: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Randomness Factor:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.randomness}
                            onChange={(e) => setParameters((prev) => ({ ...prev, randomness: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Decay Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.decayRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, decayRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Model Complexity:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.modelComplexity}
                            onChange={(e) => setParameters((prev) => ({ ...prev, modelComplexity: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Optimization Algorithm Efficiency (0-1):</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.optimizationAlgorithmEfficiency}
                            onChange={(e) => setParameters((prev) => ({ ...prev, optimizationAlgorithmEfficiency: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Batch Size Impact:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.batchSizeImpact}
                            onChange={(e) => setParameters((prev) => ({ ...prev, batchSizeImpact: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Time Steps:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {experimentType === 'disease' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Initial Infected:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.initialInfected}
                            onChange={(e) => setParameters((prev) => ({ ...prev, initialInfected: parseInt(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Population:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.population}
                            onChange={(e) => setParameters((prev) => ({ ...prev, population: parseInt(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Spread Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.spreadRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, spreadRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Recovery Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.recoveryRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, recoveryRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Mobility Rate:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.mobilityRate}
                            onChange={(e) => setParameters((prev) => ({ ...prev, mobilityRate: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Stochastic Factor:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={parameters.stochasticFactor}
                            onChange={(e) => setParameters((prev) => ({ ...prev, stochasticFactor: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Iterations:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={iterations}
                            onChange={(e) => setIterations(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Days:</label>
                        <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={timeSteps}
                            onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={quarantineOn}
                                onChange={(e) => setQuarantineOn(e.target.checked)}
                            />
                            Set up Quarantine
                        </label>
                    </div>
                </div>


            )}



            <button
                onClick
                ={simulate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Simulate
            </button>

            {resultData && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Simulation Results</h3>
                    <div style={{ height: '400px' }}>
                        <Line data={resultData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonteCarloSimulator;

