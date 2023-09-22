const express = require('express');
const taskController = require('../controllers/weektaskController');
const router = express.Router();

// Task routes
router.post('/createtaskinfo', taskController.createTaskInfo);
router.get('/gettaskinfo/:id', taskController.getTaskInfoById);
router.get('/gettaskinfoweek', taskController.getAllTaskInfo);

module.exports = router;
