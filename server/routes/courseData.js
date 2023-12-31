const express = require('express');
const router = express.Router();
const { CourseData } = require('../models/userModel');


router.post('/api/courseadd', async (req, res) => {
  try {
    const { name, description, price, playlistapi } = req.body;

    // Create a new course instance using the CourseData model
    const newCourse = new CourseData({
      name,
      description,
      price,
      playlistapi,
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
});


// Route to get all courses from the database
router.get('/api/courses', async (req, res) => {
  try {
    const courses = await CourseData.find();

    res.status(201).json({ course: courses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await CourseData.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/api/courses/:id", async (req, res) => {
  const { name, description, price, playlistapi } = req.body;

  if (!name || !description || !price || !playlistapi) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide all fields" });
  }

  try {
    const courseId = req.params.id;
    const updatedCourse = await CourseData.findByIdAndUpdate(
      courseId,
      { name, description, price, playlistapi },
      { new: true }
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update course" });
  }
});

module.exports = router;
