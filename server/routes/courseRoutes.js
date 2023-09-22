const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../auth.js');

// Route to add a new course
router.post('/api/courseadd', courseController.addCourse);

// Route to get all courses
router.get('/api/courses',verifyToken, courseController.getAllCourses);

router.get('/api/admin/courses', courseController.getAllCourses);

// Route to delete a course by ID
router.delete('/api/courses/:id', courseController.deleteCourse);

// Route to update a course by ID
router.put('/api/courses/:id', courseController.updateCourse);

module.exports = router;
