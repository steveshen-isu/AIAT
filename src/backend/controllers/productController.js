import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log('db_host', process.env.DB_HOST);
// Setting up the MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,  // localhost
    user: process.env.DB_USER,  // root
    password: process.env.DB_PASS,  // 465653650szr!!!
    database: process.env.DB_NAME,  // ai_math_solver
    waitForConnections: true,
    connectionLimit: 10,  // Limit the number of simultaneous connections
    queueLimit: 0
});

function readJsonFiles(jDir) {
    const jFiles = fs.readdirSync(jDir);
    const jObjects = [];
    jFiles.forEach(jFile => {
        const jFilePath = path.join(jDir, jFile);
        const stat = fs.statSync(jFilePath);
        if (stat.isDirectory()) {
            jObjects.push(...readJsonFiles(jFilePath))
        } else if (path.extname(jFile) === '.json') {
            try {
                const oContents = fs.readFileSync(jFilePath, 'utf8');
                let nContents = oContents;
                nContents = jsonminify(nContents);
                if (oContents.charAt(0) !== '[') {
                    nContents = '[' + nContents;
                }
                if (oContents.charAt(oContents.length-1) !== ']') {
                    nContents = nContents + ']';
                }
                jObjects.push(JSON.parse(nContents));
            } catch (error) {
                console.log(`Parse file: ${jFilePath} failed, error: `, error.message);
            }
        } else {
            return;
        }
    });
    return jObjects;
}

// Controller for handling POST requests to add a subject
export const addSubject = (req, res) => {
    console.log('Received POST request for /api/subjects');
    console.log('Body:', req.body);
    res.status(201).send({ message: 'Subject added' });
};


// Controller for syncing question bank from json files to db
export const syncQuestionBank = (req, res) => {
    
    const currentPath = path.dirname(fileURLToPath(import.meta.url));
    const parentPath = path.dirname(currentPath);
    const questionBankPath = path.join(parentPath, 'question_bank');
    
    try {
        const jsonObjects = readJsonFiles(questionBankPath);
        //TODO: sync json data to db
    } catch (error) {
        console.error('Json parse failed: ', error);
        res.status(500).send('Json parse failed.');
    }
    res.status(200).send('JSON data sync to db successfully.');
};

// Controller for fetching subjects
export const getSubjects = (req, res) => {
    db.query('SELECT * FROM subjects', (error, results) => {
        if (error) {
            console.error('Error fetching subjects:', error);
            return res.status(500).json({ error: 'Database query failed', details: error.message });
        }
        res.json(results);
    });
};

// Controller for fetching chapter summary by chapterId
export const getChapterSummary = (req, res) => {
    const chapterId = req.params.chapterId;
    db.query('SELECT summary FROM Chapters WHERE id = ?', [chapterId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
};

// Controller for fetching topics in a chapter
export const getTopics = (req, res) => {
    const chapterId = req.params.chapterId;
    db.query('SELECT * FROM Topics WHERE chapter_id = ?', [chapterId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Controller for fetching chapters by textbookId
export const getChapters = (req, res) => {
    const textbookId = req.params.textbookId;
    db.query('SELECT * FROM chapters WHERE textbook_Id = ?', [textbookId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Controller for fetching textbooks by subjectId
export const getTextbooks = (req, res) => {
    const subjectId = req.params.subjectId;
    db.query('SELECT * FROM textbooks WHERE subject_Id = ?', [subjectId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Controller for fetching topic summary by topicId
export const getTopicSummary = (req, res) => {
    const topicId = req.params.topicId;
    db.query('SELECT summary FROM Topics WHERE id = ?', [topicId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
};

// Controller for fetching questions in a topic
export const getQuestions = (req, res) => {
    const topicId = req.params.topicId;
    db.query('SELECT * FROM Questions WHERE topic_id = ?', [topicId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Controller for fetching a question by questionId
export const getQuestion = (req, res) => {
    const questionId = req.params.questionId;
    db.query('SELECT * FROM Questions WHERE id = ?', [questionId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
};
