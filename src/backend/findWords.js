import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readSummarizedWords = () => {
  const filePath = path.join(__dirname, 'summaryWords.json');
  try {
   
    const rawData = fs.readFileSync(filePath, 'utf8');
    const words = JSON.parse(rawData); 
    return new Set(words); 
  } catch (err) {
    console.error('Error reading or parsing summaryWords.json:', err.message);
    return new Set(); 
  }
};

const recognizeWordsInString = (inputString) => {
  const summarizedWords = readSummarizedWords(); 
  const wordsInString = inputString.match(/\b[a-zA-Z']+\b/g); 

  if (!wordsInString) return []; 

  const recognizedWords = wordsInString
    .map(word => word.toLowerCase()) 
    .filter(word => summarizedWords.has(word)); 

  return recognizedWords;
};

export default recognizeWordsInString;

//example
const inputString = "Extracted text from the image:\\n(a) Find the first three terms in the expansion, in ascending powers of x, of (1 + x)°. [1\\n(b) Find the first three terms in the expansion, in ascending powers of x, of (1 — 2x)\\. 2]\\n(¢) Hence find the coefficient of x? in the expansion of (1 +x)°(1 -2x)°. [2]\\n";
const recognizedWords = recognizeWordsInString(inputString);

console.log('Recognized Words:', recognizedWords);
