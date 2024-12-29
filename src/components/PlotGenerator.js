import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Typewriter from './Typewriter';
import Button from "@/components/ui/button"; // Import Button from shadcn
import Input from "@/components/ui/input"; // Import Input from shadcn
import Textarea from "@/components/ui/textarea"; // Import Textarea from shadcn
import Loader from "@/components/ui/loader"; // Loader for animations
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Cards for layout
const currentUrl = window.location.href;

const ipAddress = currentUrl.split(':')[1].split('/')[2];



function PlotGenerator() {
    const [mathFunction, setMathFunction] = useState('');
    const [plotCode, setPlotCode] = useState('1'); // Store code from the backend
    const [plotUrl, setPlotUrl] = useState('');   // URL of the generated plot image
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [d3ButtonDisabled, setD3ButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null)
        setButtonDisabled(true)
        // Send the user's math function request to the backend
        try {
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
            if (!res.ok) {
                // If the response status is not OK (e.g., 500), throw an error
                const errorData = await res.json(); // Parse the error message from the response
                throw new Error(errorData.message || 'An error occurred while generating the plot.');
            }
            const data = await res.json();
            setPlotCode(data.plotCode);  // Generated code from OpenAI
            setPlotUrl(data.plotUrl);
        } catch (error) {
            console.error('API Error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');

            // Check if the error has a response (from the backend)
            if (error.response) {
                console.error('Error Response:', error.response.data);

                // Handle server errors (e.g., 500)
                if (error.response.status === 500) {
                    setErrorMessage(
                        error.response.data.message || 'An unexpected error occurred on the server.'
                    );
                } else {
                    setErrorMessage(error.response.data.message || 'An error occurred.');
                }
            }
            // Handle network or other client-side errors (e.g., timeout, connection issues)
            else if (error.message) {
                if (error.message === 'Network Error') {
                    setErrorMessage('Network error: Unable to reach the server. Please try again later.');
                } else if (error.code === 'ECONNABORTED') {
                    setErrorMessage('Request Timeout: The request took too long to complete. Please try again later.');
                } else {
                    setErrorMessage(`Unexpected error: I'm not smart enough for this task. Try something easier`);
                }
            }
            // Handle cases where error object is not properly structured (fallback)
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }

        setButtonDisabled(false)
    };
    console.log(plotCode);
    console.log(plotUrl);
    console.log('error message:' + errorMessage);
    const [dataD3Plot, setDataD3plot] = useState('');

    const handleD3Submit = async (e) => {
        e.preventDefault();
        setErrorMessage(null)
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
            if (!res.ok) {
                // If the response status is not OK (e.g., 500), throw an error
                const errorData = await res.json(); // Parse the error message from the response
                throw new Error(errorData.message || 'An error occurred while generating the plot.');
            }
            const result = await res.json();
            setDataD3plot(result.plotdata);  // Receive dataset and store it in state
        } catch (error) {
            console.error('API Error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');

            // Check if the error has a response (from the backend)
            if (error.response) {
                console.error('Error Response:', error.response.data);

                // Handle server errors (e.g., 500)
                if (error.response.status === 500) {
                    setErrorMessage(
                        error.response.data.message || 'An unexpected error occurred on the server.'
                    );
                } else {
                    setErrorMessage(error.response.data.message || 'An error occurred.');
                }
            }
            // Handle network or other client-side errors (e.g., timeout, connection issues)
            else if (error.message) {
                if (error.message === 'Network Error') {
                    setErrorMessage('Network error: Unable to reach the server. Please try again later.');
                } else if (error.code === 'ECONNABORTED') {
                    setErrorMessage('Request Timeout: The request took too long to complete. Please try again later.');
                } else {
                    setErrorMessage(`Unexpected error: ${error.message}`);
                }
            }
            // Handle cases where error object is not properly structured (fallback)
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
        setD3ButtonDisabled(false)
    };

    console.log('interactive plot data:', dataD3Plot)


    return (
        <div className="flex flex-col md:flex-row items-start p-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex flex-col w-full max-w-2xl space-y-4">
                <h1 className="text-center text-3xl font-semibold">
                    <Typewriter
                        text="Type in the function you are interested in to plot it"
                        speed={20}
                    />
                </h1>

                {/* Input Card */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg text-gray-700">
                            Enter a mathematical function
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                className="p-4 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 shadow-md transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                placeholder="e.g., sin(x), x^2, or cos(x)*tan(x)"
                                value={mathFunction}
                                onChange={(e) => setMathFunction(e.target.value)}
                                rows="4"
                                disabled={ButtonDisabled || d3ButtonDisabled}
                            />
                            <Button
                                type="submit"
                                className={`w-full transition-all duration-300 ${ButtonDisabled || d3ButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                onClick={() => {
                                    setPlotCode(null);
                                    setPlotUrl(null);
                                    setDataD3plot(null);
                                }}
                                disabled={ButtonDisabled || d3ButtonDisabled}
                            >
                                Generate Plot
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* D3 Plot Button */}
                <Card className="shadow-md">
                    <CardContent>
                        <form onSubmit={handleD3Submit} className="space-y-4">
                            <Button
                                type="submit"
                                className={`w-full transition-all duration-300 ${ButtonDisabled || d3ButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                onClick={() => {
                                    setPlotCode(null);
                                    setPlotUrl(null);
                                    setDataD3plot(null);
                                }}
                                disabled={ButtonDisabled || d3ButtonDisabled}
                            >
                                Not Just a Graph!
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Right side (Plot Image) */}
            <div className="flex justify-center items-center h-[80vh] w-full mt-6 md:mt-0">
                <div className="w-full max-w-10xl h-[80vh] bg-gray-100 rounded-lg shadow-md flex justify-center items-center">
                    {/* Show Loading or Placeholder Text */}
                    {!plotUrl && !dataD3Plot && !errorMessage && !ButtonDisabled && !d3ButtonDisabled && (
                        <span className="text-gray-600 text-xl">Waiting for your request...</span>
                    )}

                    {/* Show Plot Image */}
                    {plotUrl && (
                        <img
                            src={`${plotUrl}?rand=${Math.random()}`}
                            alt="Generated plot"
                            className="object-contain w-full h-full rounded-lg"
                        />
                    )}

                    {dataD3Plot && (
                        <div className="plot-container rounded-lg p-4" style={{ width: '100%', maxWidth: '1200px', height: '900px', overflow: 'hidden' }}>
                            <Plot
                                data={dataD3Plot.data}
                                layout={{
                                    ...dataD3Plot.layout,
                                    width: 1000,  // Set fixed width for the plot
                                    height: 800, // Set fixed height for the plot
                                }}
                                config={{
                                    responsive: true,
                                    displayModeBar: true,
                                    scrollZoom: true,
                                    staticPlot: false,
                                }}
                            />
                        </div>
                    )}

                    {/* Loading Animation */}
                    {!plotCode && !dataD3Plot && !errorMessage && (
                        <div id="loading-animation" className="absolute flex items-center justify-center space-x-2">
                            <Loader className="text-blue-500" /> {/* Shadcn loader */}
                            <span>Generating Plot...</span>
                        </div>
                    )}
                </div>
            </div>

            {errorMessage && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            {/* Footer */}

        </div>

    );




}

export default PlotGenerator;