const express = require('express');
const userController = require('../controllers/fumigationController');
const router = express.Router();

// User routes
router.get('/questions', userController.getQuestions);
router.post('/addAnswers', userController.addAnswers);
router.post('/submitscore', userController.submitScore);

module.exports = router;
