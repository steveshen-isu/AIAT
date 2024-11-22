import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Plot from 'react-plotly.js';
import Typewriter from './Typewriter';
const currentUrl = window.location.href;

const ipAddress = currentUrl.split(':')[1].split('/')[2];



function PlotGenerator() {
    const [mathFunction, setMathFunction] = useState('');
    const [plotCode, setPlotCode] = useState('1'); // Store code from the backend
    const [plotUrl, setPlotUrl] = useState('');   // URL of the generated plot image
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [d3ButtonDisabled, setD3ButtonDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        // Send the user's math function request to the backend
        const res = await fetch('http://' + ipAddress + ':200/api/generate-plot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mathFunction: mathFunction,
                ipAddress: ipAddress,
            }),
        });

        const data = await res.json();
        setPlotCode(data.plotCode);  // Generated code from OpenAI
        setPlotUrl(data.plotUrl);    // Plot URL from the backend (if plot is returned as an image)
        setButtonDisabled(false)
    };
    console.log(plotCode);
    console.log(plotUrl);

    const [dataD3Plot, setDataD3plot] = useState('');

    const handleD3Submit = async (e) => {
        e.preventDefault();
        setD3ButtonDisabled(true)
        try {
            // Send request to backend with function name
            const res = await fetch('http://' + ipAddress + ':200/api/generate-d3plot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mathFunction: mathFunction,
                    ipAddress: ipAddress,
                }),
            });
            const result = await res.json();
            setDataD3plot(result.plotdata);  // Receive dataset and store it in state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setD3ButtonDisabled(false)
    };

    console.log('interactive plot data:', dataD3Plot)
    /*     useEffect(() => {
            if (dataD3Plot) {
                const svg = d3.select('#d3-plot')
                    .attr('width', 500)
                    .attr('height', 500);
    
                // Clear previous plots
                svg.selectAll('*').remove();
    
                // Set up scales
                const xScale = d3.scaleLinear()
                    .domain([d3.min(dataD3Plot.x), d3.max(dataD3Plot.x)])
                    .range([50, 450]);
    
                const yScale = d3.scaleLinear()
                    .domain([d3.min(dataD3Plot.y), d3.max(dataD3Plot.y)])
                    .range([450, 50]);
    
                // Create the line function
                const line = d3.line()
                    .x(d => xScale(d[0]))
                    .y(d => yScale(d[1]));
    
                // Bind data and create the line
                svg.append('path')
                    .datum(dataD3Plot.x.map((x, i) => [x, dataD3Plot.y[i]]))
                    .attr('fill', 'none')
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }
        }, [dataD3Plot]);
     */
    return (
        <div>
            <h1>
                <Typewriter text="Type in the function your are interested in to plot it" speed={20} />
            </h1>
            <div className="input-wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        {/*                         <label htmlFor="question">Your Question:</label>
 */}                        <textarea className="custom-textarea"
                            id="question"
                            value={mathFunction}
                            onChange={(e) => setMathFunction(e.target.value)}
                            rows="4"
                            cols="50"
                        />

                        <button className="submit-button" type="submit" onClick={() => {
                            setPlotCode(null);
                            setPlotUrl(null);
                            setDataD3plot(null);
                        }} disabled={ButtonDisabled || d3ButtonDisabled}>&#9658;

                        </button>
                    </div>
                </form>

            </div>
            <div>
                <form onSubmit={handleD3Submit}>
                    <button className="submit-button" type="submit" onClick={() => {
                        setPlotCode(null);
                        setPlotUrl(null);
                        setDataD3plot(null);
                    }} disabled={ButtonDisabled || d3ButtonDisabled}>NOT JUST A GRAPH!

                    </button>                </form>
                {/*                 <svg id="chart" width="600" height="400"></svg>
 */}            </div>
            {!plotCode && !dataD3Plot && (
                <div
                    id="loading-animation"
                    className="loading-animation"
                    style={{ display: plotCode ? 'none' : 'inline-block' }} // Dynamically control visibility
                >
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                </div>
            )}

            {dataD3Plot && (
                <div className="plot-container">
                    <Plot
                        data={dataD3Plot.data}
                        layout={dataD3Plot.layout}
                        config={{
                            responsive: true,
                            displayModeBar: true,
                            scrollZoom: true,
                            staticPlot: false
                        }}
                    />
                </div>
            )}

            {plotCode && plotUrl && (
                <div>
            <h1>
                <Typewriter text="Generated Plot" speed={40} />
            </h1>
                    <img src={`${plotUrl}?rand=${Math.random()}`} alt="Generated plot" />
                </div>
            )}
            <div>
                <p style={{
                    color: 'gray',            // Use camelCase for CSS properties
                    fontSize: '15px',         // font-size becomes fontSize
                    textAlign: 'center',      // text-align becomes textAlign
                    fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                    fontWeight: 'lighter',        // Bold text
                    fontStyle: 'normal',       // Italic text
                    margin: '20px'
                }}>
                    Test version 1.0.0.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Powered by @openai
                </p>
            </div>
        </div>

    );

}

export default PlotGenerator;