import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

console.log('db_host', process.env.DB_HOST);
// Setting up the MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // localhost
    user: process.env.DB_USER,  // root
    password: process.env.DB_PASS,  // 465653650szr!!!
    database: process.env.DB_NAME,  // ai_math_solver
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL server.');
    }
});



// Check if the connection is still open
if (db.state !== 'authenticated') {
    console.log('Reconnecting to database...');
    db.connect();
}

// Controller for handling POST requests to add a subject
export const addSubject = (req, res) => {
    console.log('Received POST request for /api/subjects');
    console.log('Body:', req.body);
    res.status(201).send({ message: 'Subject added' });
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
