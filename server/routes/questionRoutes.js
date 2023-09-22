const express = require('express');
const userQuestionsController = require('../controllers/questionController');
const router = express.Router();

// User questions and answers routes
router.get('/userquestions', userQuestionsController.getUserQuestions);
router.get('/useranswers', userQuestionsController.getUserAnswers);
router.post('/api/send-email',userQuestionsController.sendmail)


module.exports = router;
