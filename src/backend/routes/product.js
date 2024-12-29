import express from 'express';
import {
  getSubjects,
  getChapterSummary,
  getTopics,
  getChapters,
  getTextbooks,
  getTopicSummary,
  getQuestions,
  getQuestion,
  addSubject,
  syncQuestionBank,
  queryQuestionBank,
} from '../controllers/productController.js';

const router = express.Router();

// Route to fetch subjects
router.get('/api/subjects', getSubjects);

// Route to fetch chapter summary by chapterId
router.get('/api/chapter-summary/:chapterId', getChapterSummary);

// Route to fetch topics in a chapter
router.get('/api/topics/:chapterId', getTopics);

// Route to fetch chapters by textbookId
router.get('/api/chapters/:textbookId', getChapters);

// Route to fetch textbooks by subjectId
router.get('/api/textbooks/:subjectId', getTextbooks);

// Route to fetch topic summary by topicId
router.get('/api/topic-summary/:topicId', getTopicSummary);

// Route to fetch questions in a topic
router.get('/api/questions/:topicId', getQuestions);

// Route to fetch a question by questionId
router.get('/api/question/:questionId', getQuestion);

// Route to add a subject
router.post('/api/subjects', addSubject);

// Route to sync question bank
router.post('/api/syncQuestionBank', syncQuestionBank);

// Route to query from question bank
router.post('/api/queryQuestionBank', queryQuestionBank);

export default router;
