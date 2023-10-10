const { TaskInfo } = require('../models/userModel');

// Create Task Info Controller
exports.createTaskInfo = async (req, res) => {
  const { taskinfo, name } = req.body;

  if (!taskinfo) {
  
    return res.status(400).json({ error: "No data received" });
  }

  try {
    const newTask = new TaskInfo({
      description: taskinfo,
      week: name
    });

    await newTask.save();

    res.status(201).json({ message: 'Task Uploaded successfully', data: newTask });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Task Info by ID Controller
exports.getTaskInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const taskInfo = await TaskInfo.findOne({ week: id });

    if (taskInfo) {
      res.status(200).json({ message: 'Task sent successfully', data: taskInfo.description });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Task retrieval error' });
  }
};

// Get All Task Info Controller
exports.getAllTaskInfo = async (req, res) => {
  try {
    const taskInfoList = await TaskInfo.find();

    if (taskInfoList) {
      res.status(200).json({ message: 'Task sent successfully', data: taskInfoList });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Task retrieval error' });
  }
};
