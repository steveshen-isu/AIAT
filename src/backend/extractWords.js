import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample JSON structure to work with
const jsonFiles = ['/question_bank/CAMBRIDGE AS-A LEVEL MATHEMATICS 9709 DATABASE/PURE MATHEMATICS 2/9709_w17_qp_21 Same as 23/QuestionBank.json',
'/question_bank/CAMBRIDGE AS-A LEVEL MATHEMATICS 9709 DATABASE/PURE MATHEMATICS 2/9709_w22_qp_21 Same as 23/QuestionBank.json',
'/question_bank/CAMBRIDGE AS-A LEVEL MATHEMATICS 9709 DATABASE/PURE MATHEMATICS 1/9709_P1_2023_Nov_12/QuestionBank.json',
    '/question_bank/CAMBRIDGE AS-A LEVEL MATHEMATICS 9709 DATABASE/PURE MATHEMATICS 3/9709_P3_2005_June/QuestionBank.json'
]; // Add paths to your JSON files
let allWords = new Set();

// Function to extract words from a string
const extractWords = (str) => {
    // Match words with only alphabet characters (including apostrophes in contractions, e.g., "don't")
    const words = str.match(/\b[a-zA-Z']+\b/g);
    if (!words) return []; // Return empty array if no match
    return words.map(word => word.toLowerCase()); // Convert all words to lowercase for uniqueness
};
// Function to process JSON files and collect words
const processJSONFiles = () => {
    jsonFiles.forEach((file) => {
        const filePath = path.join(__dirname, file);

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Recursively extract words from the JSON content
            const recursiveExtract = (obj) => {
                if (typeof obj === 'string') {
                    const words = extractWords(obj); // Extract words from strings
                    words.forEach(word => {
                        // Only add words with length of 4 or more characters
                        if (word.length >= 4) {
                            allWords.add(word); // Add word to Set to ensure uniqueness
                        }
                    });
                } else if (Array.isArray(obj)) {
                    obj.forEach(item => recursiveExtract(item)); // Recurse if item is an array
                } else if (typeof obj === 'object' && obj !== null) {
                    Object.values(obj).forEach(value => recursiveExtract(value)); // Recurse if item is an object
                }
            };

            // Start recursive extraction
            recursiveExtract(data);
        } catch (err) {
            console.error(`Error processing file ${file}:`, err);
        }
    });
};

// Function to write the output JSON file
const writeSummaryToFile = () => {
    const wordsArray = Array.from(allWords); // Convert Set to Array
    const outputFile = path.join(__dirname, 'summaryWords.json');

    // Write the array of unique words to a new JSON file
    fs.writeFileSync(outputFile, JSON.stringify(wordsArray, null, 2), 'utf8');
    console.log('Summary of words has been written to summaryWords.json');
};

// Run the process
processJSONFiles();
writeSummaryToFile();
