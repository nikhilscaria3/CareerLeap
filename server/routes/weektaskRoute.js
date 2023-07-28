const express = require('express');
const router = express.Router();
const { TaskInfo } = require('../models/userModel');
const { route } = require('./userRoutes');

router.post('/createtaskinfo', async (req, res) => {
    const { taskinfo, name } = req.body;

    if (!taskinfo) {
        console.log("Error: No data received");
        return res.status(400).json({ error: "No data received" });
    }

    try {
        const newTask = new TaskInfo({
            description: taskinfo,
            week: name
        });

        await newTask.save(); // Corrected line - save() method should have parentheses

        res.status(201).json({ message: 'Task Uploaded successfully', data: newTask });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Server Error" });
    }
});


router.get('/gettaskinfo/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const gettaskinfodata = await TaskInfo.findOne({ week: id });
      
      console.log(gettaskinfodata);
      if (gettaskinfodata) {
        res.status(200).json({ message: 'Task sent successfully', data: gettaskinfodata.description });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Task retrieval error' });
    }
  });
  

  router.get('/gettaskinfoweek', async (req, res) => {
    try {
      const gettaskinfodata = await TaskInfo.find();
      
      console.log(gettaskinfodata);
      if (gettaskinfodata) {
        res.status(200).json({ message: 'Task sent successfully', data: gettaskinfodata });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Task retrieval error' });
    }
  });
  

module.exports = router;