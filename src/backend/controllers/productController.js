import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log('db_host', process.env.DB_HOST);
// Setting up the MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST, // localhost
  user: process.env.DB_USER, // root
  password: process.env.DB_PASS, // 465653650szr!!!
  database: process.env.DB_NAME, // ai_math_solver
  waitForConnections: true,
  connectionLimit: 10, // Limit the number of simultaneous connections
  queueLimit: 0,
});

function readJsonFiles(jDir) {
  const jFiles = fs.readdirSync(jDir);
  const jObjects = [];
  jFiles.forEach((jFile) => {
    const jFilePath = path.join(jDir, jFile);
    const stat = fs.statSync(jFilePath);
    if (stat.isDirectory()) {
      jObjects.push(...readJsonFiles(jFilePath));
    } else if (path.extname(jFile) === '.json') {
      try {
        const sourceName = path.basename(path.dirname(jFilePath));
        const oContents = fs.readFileSync(jFilePath, 'utf8');
        let nContents = oContents;
        if (oContents.charAt(0) !== '[') {
          nContents = '[' + nContents;
        }
        if (oContents.charAt(oContents.length - 1) !== ']') {
          nContents = nContents + ']';
        }
        const parsedObject = JSON.parse(nContents);
        parsedObject['source_name'] = sourceName;
        jObjects.push(parsedObject);
      } catch (error) {
        console.log(`Parse file: ${jFilePath} failed, error: `, error.message);
      }
    } else {
      return;
    }
  });
  return jObjects;
}

function handleJsonObjects(jsonObjects) {
  jsonObjects.forEach((jsonObject) => {
    const sourceName = jsonObject['source_name'];
    const query = 'SELECT * FROM question_bank WHERE source_name = ?';
    db.query(query, [sourceName], (error, results) => {
      if (error) {
        console.error('Query failed: ', error);
        return;
      }
      if (results.length > 0) {
        const updateQuery =
          'UPDATE question_bank SET qa_json = ?, update_time = CURRENT_TIMESTAMP WHERE source_name = ?';
        db.query(
          updateQuery,
          [JSON.stringify(jsonObject), sourceName],
          (uError, uResults) => {
            if (uError) {
              console.error('Update failed', uError);
            } else {
              console.log(`Update '${sourceName}' successfully.`);
            }
          },
        );
      } else {
        const insertQuery =
          'INSERT INTO question_bank (qa_json, source_name) VALUES (?,?)';
        db.query(
          insertQuery,
          [JSON.stringify(jsonObject), sourceName],
          (iError, iResults) => {
            if (iError) {
              console.error('Insert failed: ', iError);
            } else {
              console.log(`Insert into '${sourceName}' successfully.`);
            }
          },
        );
      }
    });
  });
}

const queryQuestions = (question, callback) => {
  const sql = `SELECT * FROM question_bank WHERE JSON_SEARCH(qa_json, 'one', '%${question}%', NULL, '$[*].QuestionContent') IS NOT NULL;`;
  db.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

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
    handleJsonObjects(jsonObjects);
    res.status(200).send('JSON data sync to db successfully.');
  } catch (error) {
    console.error('Json parse failed: ', error);
    res.status(500).send('Json parse failed.');
  }
};

// Controller for query from question bank
export const queryQuestionBank = (req, res) => {
  const { question } = req.body;
  queryQuestions(question, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Query failed.' });
    } else {
      res.json(results);
    }
  });
};

// Controller for fetching subjects
export const getSubjects = (req, res) => {
  db.query('SELECT * FROM subjects', (error, results) => {
    if (error) {
      console.error('Error fetching subjects:', error);
      return res
        .status(500)
        .json({ error: 'Database query failed', details: error.message });
    }
    res.json(results);
  });
};

// Controller for fetching chapter summary by chapterId
export const getChapterSummary = (req, res) => {
  const chapterId = req.params.chapterId;
  db.query(
    'SELECT summary FROM Chapters WHERE id = ?',
    [chapterId],
    (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    },
  );
};

// Controller for fetching topics in a chapter
export const getTopics = (req, res) => {
  const chapterId = req.params.chapterId;
  db.query(
    'SELECT * FROM Topics WHERE chapter_id = ?',
    [chapterId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    },
  );
};

// Controller for fetching chapters by textbookId
export const getChapters = (req, res) => {
  const textbookId = req.params.textbookId;
  db.query(
    'SELECT * FROM chapters WHERE textbook_Id = ?',
    [textbookId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    },
  );
};

// Controller for fetching textbooks by subjectId
export const getTextbooks = (req, res) => {
  const subjectId = req.params.subjectId;
  db.query(
    'SELECT * FROM textbooks WHERE subject_Id = ?',
    [subjectId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    },
  );
};

// Controller for fetching topic summary by topicId
export const getTopicSummary = (req, res) => {
  const topicId = req.params.topicId;
  db.query(
    'SELECT summary FROM Topics WHERE id = ?',
    [topicId],
    (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    },
  );
};

// Controller for fetching questions in a topic
export const getQuestions = (req, res) => {
  const topicId = req.params.topicId;
  db.query(
    'SELECT * FROM Questions WHERE topic_id = ?',
    [topicId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    },
  );
};

// Controller for fetching a question by questionId
export const getQuestion = (req, res) => {
  const questionId = req.params.questionId;
  db.query(
    'SELECT * FROM Questions WHERE id = ?',
    [questionId],
    (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    },
  );
};
