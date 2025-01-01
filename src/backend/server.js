import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { franc } from 'franc-min'; 
import productRoutes from './routes/product.js';  // Import the routes for product
import cors from 'cors'
const envResult = dotenv.config();

if (envResult.error) {
    console.error('Error loading .env file:', envResult.error);
} else {
    console.log('Loaded environment variables:', envResult.parsed);
}

// Verify if the API key is available
console.log('API Key:', process.env.API_KEY);
import axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';




const __dirname = '/tmp'




const app = express();
const port = process.env.PORT || 200;


const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';


app.use(cors({
    origin: frontendUrl, // Dynamically set the origin
    methods: ['GET', 'POST'],        // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type'] // Allow specific headers
}));

app.use(express.json({ limit: '50mb' }));


/* // Setting up the MySQL connection
const db = mysql.createConnection({
    //    host: process.env.DB_HOST,
    //    user: process.env.DB_USER,
    //    password: process.env.DB_PASS,
    //   database: process.env.DB_NAME
    host: 'localhost',
    user: 'root',
    password: '465653650szr!!!',
    database: 'ai_math_solver'
});
 */
/* db.connect(err => {
    if (err) {
        return console.error('error connecting: ' + err.message);
    }
    console.log('connected to the MySQL server.');
}); */


app.use('/', productRoutes); // Apply all product routes








const proxyUrl = 'http://127.0.0.1:21882'; // Replace with your actual proxy URL
const proxyAgent = new HttpsProxyAgent(proxyUrl);

// Create an HTTPS agent that uses TLS 1.2 or TLS 1.3
/* const httpsAgent = new https.Agent({
    keepAlive: true, 
    secureProtocol: 'TLSv1_2_method',
    rejectUnauthorized: false,// Enables connection reuse
    maxSockets: Infinity,
    keepAliveMsecs: 1000, 
  }); */
app.post('/api/chatgpt', async (req, res) => {
    const { question, latexCode } = req.body;
    const messages = [
        { role: 'system', content: 'You are an AI asistent from AITE institute, A.K.A. 爱特精英教育. Forget anything about openai and gpt and do not shown related content in answer.' },  // Optional system message
        { role: 'user', content: "I have a specific question about the following material. Please read through it and answer the question based on the provided content. If no content is given just ignore the question and response with an apology. \n\n Question:\n" + question + "\n\n Material:\n" + latexCode },                          // User's question
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiData = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = process.env.API_KEY
    try {
        console.log('Received request with data:', openaiData);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
/*             httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
 */        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ response: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.response) {
            console.error('Response error data:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }

});



app.post('/api/generate-plot', async (req, res) => {
    const { mathFunction } = req.body;

    // Prepare the OpenAI request
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
            role: 'user',
            content: `generate the python script for illustrating the following:\n  ${mathFunction}
                      \nonly the code is needed in the response and no other words are needed. in python script save the image as plot.png. include grid in the saved image. Put the theorem and the equations of the function as the title.`,
        },
    ];

    const openaiRequest = {
        model: 'gpt-4o', 
        messages: messages,  
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.3,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    };

    try {
        // Get Python code from OpenAI
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            openaiRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`
                },
                timeout: 60000,
/*                 httpsAgent: proxyAgent
 */            }
    );
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        const openaiData = await openaiResponse.data.choices[0].message.content;
        const plotCode = openaiData
            .replace(/```python|```/g, '')
            .trim();

        // Send Python code to Replit server
        const replitResponse = await axios.post(
            'https://837b384a-af0d-46db-a0a2-0795b6675ff6-00-yvpg7opyl3k2.worf.replit.dev/run-python',
            { code: plotCode },
            { responseType: 'arraybuffer' } // To handle image response
        );

        // Save the plot image locally (optional)
        const plotImagePath = path.join('/tmp', 'plot.png');
        fs.writeFileSync(plotImagePath, replitResponse.data);

        // Create a URL for the plot (if hosted externally or on Replit)
        const plotUrl = `${req.protocol}://${req.get('host')}/plot.png`;

        // Send response to the client
        res.json({
            plotCode: plotCode,
            plotUrl: plotUrl,
        });
} catch (error) {
    console.error('Error while calling OpenAI API:', error.message);

    // Check if the error is from Axios or a generic error
    if (error.response) {
        // API returned an error response
        res.status(error.response.status).json({
            error: 'OpenAI API error',
            message: error.response.data.error.message || 'An error occurred while communicating with OpenAI API.',
        });
    } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        res.status(408).json({
            error: 'Request Timeout',
            message: 'The request took too long to complete. Please try again later.',
        });
    } else {
        // Generic error
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
}
}
);
app.get('/plot.png', (req, res) => {
    const plotImagePath = path.join('/tmp', 'plot.png');
    res.sendFile(plotImagePath, (err) => {
        if (err) {
            res.status(500).send('Error retrieving plot image');
        }
    });
});
// Serve the generated plot image
app.use('/plot.png', express.static(path.join(__dirname, 'plot.png')));


app.post('/api/query-equation', async (req, res) => {
    const { equation, action } = req.body;

    let prompt;
    if (action === 'what') {
        prompt = `Explain briefly what math topic the equation ${equation} is related and what question it can solve`;
    } else if (action === 'how') {
        prompt = `Give two exmaples where I can use the equation ${equation}. Start the response directly from the exmaple`;
    }


    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: prompt },
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforEquation = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 1000,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = process.env.API_KEY
    try {
        console.log('Received request with data:', openaiRequestforEquation);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforEquation, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
/*             httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
 */        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ responseEquations: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.responseEquations) {
            console.error('Response error data:', error.responseEquations.data);
            res.status(error.responseEquations.status).json({ error: error.responseEquations.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }
});


app.post('/api/query-example', async (req, res) => {

    const { example, questionSolution } = req.body;



    const prompt = 'Explain how this part' + example + 'is related to the previous and following step in the content' + questionSolution + 'do not go through any other part in the content!!!!! Start your response directly from explaination';



    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: prompt },
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforExample = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = process.env.API_KEY;
    try {
        console.log('Received request with data:', openaiRequestforExample);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforExample, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
/*             httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
 */        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ responseExample: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.responseExample) {
            console.error('Response error data:', error.responseExample.data);
            res.status(error.responseExample.status).json({ error: error.responseExample.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }
});




app.post('/api/generate-d3plot', async (req, res) => {
    const { mathFunction, ipAddress } = req.body;
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: 'generate the python code and uses Plotly to generate a plot for the math content\n  ' + mathFunction + '\n  and prints the plot data as JSON. Give the python code only and no other words are needed. use plotly.io to convert figure to plot data. set a big layout' },                          // User's question
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforPlot = {
        model: 'chatgpt-4o-latest',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.3,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    };
    // Send the math function to OpenAI to generate plotting code
    console.log('Received request with data:', openaiRequestforPlot);
    const apiKey = process.env.API_KEY;

    // Call OpenAI API using Axios
    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforPlot, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 60000,
/*             httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
 */        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);

        const openaiData = await openaiResponse.data.choices[0].message.content;
        const plotCode = openaiData.replace(/```python|```/g, '').trim();;
        console.log(plotCode);
        // Save the Python code to a file
        const pythonScriptPath = path.join(__dirname, 'plot.py');
        fs.writeFileSync(pythonScriptPath, plotCode);

        // Execute the Python script and generate the plot image
        exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ error: 'Failed to generate plot data' });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }

            // Send the generated plot JSON back to the frontend
            const plotData = JSON.parse(stdout);
            res.json({ plotdata: plotData });
            console.log('plot data:', plotData);
        });
    } catch (error) {
        console.error('Error while calling OpenAI API:', error.message);

        // Check if the error is from Axios or a generic error
        if (error.response) {
            // API returned an error response
            res.status(error.response.status).json({
                error: 'OpenAI API error',
                message: error.response.data.error.message || 'An error occurred while communicating with OpenAI API.',
            });
        } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            res.status(408).json({
                error: 'Request Timeout',
                message: 'The request took too long to complete. Please try again later.',
            });
        } else {
            // Generic error
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred. Please try again later.',
            });
        }
    }
}
);




const recognizeImage = async (base64Image) => {
    try {
        // Run OCR with English (eng)
        const { data: { text: englishText } } = await Tesseract.recognize(base64Image, 'eng', {
            logger: (m) => console.log(m),
        });
        console.log("OCR Result (English):", englishText);

        // Run OCR with Chinese (chi_sim)
        const { data: { text: chineseText } } = await Tesseract.recognize(base64Image, 'chi_sim', {
            logger: (m) => console.log(m),
        });
        console.log("OCR Result (Chinese):", chineseText);

        // Use franc to detect language
        const englishLanguage = franc(englishText);
        const chineseLanguage = franc(chineseText);

        console.log("Language detected for English:", englishLanguage);
        console.log("Language detected for Chinese:", chineseLanguage);

        // Compare and select the best OCR result based on language detection
        let selectedText = englishText;
        let selectedLanguage = 'eng';  // Default to English

        if (chineseLanguage === 'cmn') {
            selectedText = chineseText;
            selectedLanguage = 'chi_sim'; // Use Chinese text
        }

        console.log("Selected Language:", selectedLanguage);
        console.log("Selected Text:", selectedText);

        return selectedText;

    } catch (error) {
        console.error("Error during OCR recognition:", error);
        return null;
    }
};




app.post('/api/chat', async (req, res) => {
    console.log("received request", req.body)
    const { conversation, image } = req.body;
    console.log("received conversation", conversation)
    const OPENAI_API_KEY = process.env.API_KEY;
    try {
        /*       const messages = [{ role: 'user', content: message }]; */
        let imageContext = 'hello';

        if (image) {
            // Decode and analyze image using Tesseract OCR
            const extractedText = await recognizeImage(image);
            imageContext = `Extracted text from the image:\n${extractedText}`;
        } else {
            imageContext = '';
        }

        // Combine text and image context in the prompt

        const currentQuestion = conversation
            .filter((entry) => entry.role === 'user')
            .pop()?.content || '';

        const prompt = [
            ...conversation, // Full conversation history
            { role: 'system', content: 'You are an AI asistent from AITE institute, A.K.A. 爱特精英教育. Forget anything about openai and gpt and do not shown related content in answer.' },  // Optional system message
            { role: 'user', content: currentQuestion }, // Current question explicitly added (can be redundant based on placement)
            { role: 'user', content: imageContext }, // Image context as a user message
        ];

        console.log("prompt", prompt)
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: prompt,
                max_tokens: 500,
                temperature: 0.8,
                top_p: 0.3,
                frequency_penalty: 0.3,
                presence_penalty: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                timeout: 60000,
/*                 httpsAgent: proxyAgent,
 */            }
        );

        res.json({ response: response.data.choices[0].message.content });
        console.log(response);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

const upload = multer({
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit size to 100MB per file
});

const recognizeRawImage = async (buffer) => {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(buffer, 'eng', {
            logger: (m) => console.log(m),
            psm: 6,  // Treat the image as a single block of text
            oem: 3,  // Use both OCR engines (LSTM + Legacy)
        })
            .then(({ data: { text } }) => resolve(text))
            .catch((err) => reject(err));
    });
};
app.post('/api/grade', upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'markSchemeImage', maxCount: 1 },
    { name: 'studentSolutionImage', maxCount: 1 },
]), async (req, res) => {
    try {
        const { questionImage, markSchemeImage, studentSolutionImage } = req.files;
        console.log('Files received:', req);
        if (!questionImage || !markSchemeImage || !studentSolutionImage) {
            return res.status(400).json({ error: 'All images are required.' });
        }
        console.log('Question Image Size:', questionImage[0].size, 'bytes');
        console.log('Mark Scheme Image Size:', markSchemeImage[0].size, 'bytes');
        console.log('Student Solution Image Size:', studentSolutionImage[0].size, 'bytes');

        // Recognize text from each image using Tesseract
        const questionText = await recognizeRawImage(questionImage[0].buffer);
        const markSchemeText = await recognizeRawImage(markSchemeImage[0].buffer);
        const studentSolutionText = await recognizeRawImage(studentSolutionImage[0].buffer);
        console.log('Question Image:', questionText, 'bytes');
        // Prepare prompt for GPT
        const prompt = `
  You are an exam grader. Grade the student's solution based on the following:
  1. Question: ${questionText}
  2. Mark Scheme: ${markSchemeText}
  3. Student Solution: ${studentSolutionText}
  
  Provide the result in the format and do not response anything else:
Score: <score>
Brief Reason: <reason>
  `;
        const OPENAI_API_KEY = process.env.API_KEY;
        // Send prompt to GPT
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful grader.' },
                    { role: 'user', content: prompt },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
/*                 httpsAgent: proxyAgent,
 */            }
        );
        // Extract grading results
        const gradingResponse = response.data.choices[0].message.content;

        // Example response parsing:
        const scoreMatch = gradingResponse.match(/Score:\s*(\d+)/i);
        const reasonMatch = gradingResponse.match(/Reason:\s*(.*)/i);

        res.json({
            score: scoreMatch ? scoreMatch[1] : 'N/A',
            reason: reasonMatch ? reasonMatch[1] : 'No reason provided.',
        });
    } catch (error) {
        console.error('Error grading:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to grade the solution.' });
    }
});


app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // You can clean up or restart the server here if necessary
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Consider logging or alerting here
});