const express = require('express');
const router = express.Router();
const { Manifest } = require('../models/userModel');


router.post('/api/manifestadd', async (req, res) => {
  try {
    const {
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory, } = req.body;

    // Create a new course instance using the CourseData model
    const newCourse = new Manifest({
      week,
      email,
      developername,
      advisorname,
      reviewername,
      color,
      nextweektask,
      improvementupdate,
      code,
      theory,
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ message: 'Manifest added successfully', course: newCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
});


// Route to get all courses from the database
router.get('/api/manifest', async (req, res) => {
  try {
    const manifest = await Manifest.find();

    res.status(201).json({ manifest: manifest });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/manifest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedmanifest = await Manifest.findByIdAndDelete(id);

    if (!deletedmanifest) {
      return res.status(404).json({ error: 'Manifest not found' });
    }

    res.json({ message: 'Manifest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/api/manifest/:id", async (req, res) => {
  const {
    week,
    email,
    developername,
    advisorname,
    reviewername,
    color,
    nextweektask,
    improvementupdate,
    code,
    theory, } = req.body;

  if (!week || !email || !developername || !advisorname || !reviewername || !color || !nextweektask || !improvementupdate || !code || !theory) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide all fields" });
  }

  try {
    const manifestId = req.params.id;
    const updatedmanifest = await Manifest.findByIdAndUpdate(
      manifestId,
      {
        week,
        email,
        developername,
        advisorname,
        reviewername,
        color,
        nextweektask,
        improvementupdate,
        code,
        theory,
      },
      { new: true }
    );

    if (!updatedmanifest) {
      return res
        .status(404)
        .json({ success: false, error: "Manifest not found" });
    }

    res.json({ success: true, manifest: updatedmanifest });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update manifest" });
  }
});

module.exports = router;
