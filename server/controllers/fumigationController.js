const { Question, User, fumigationanswers } = require('../models/userModel');

// Get Questions Controller
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

// Add Answers Controller
exports.addAnswers = async (req, res) => {
  const { userAnswers, useremail } = req.body;

  try {
    const existingUserAnswer = await fumigationanswers.findOne({ useremail });

    if (existingUserAnswer) {
      return res.status(400).json({ error: 'User email already exists' });
    }

    const newUserAnswer = new fumigationanswers({
      useremail: useremail,
      useranswers: userAnswers,
    });

    await newUserAnswer.save();
    res.status(200).json({ message: 'User answers saved successfully' });
  } catch (error) {
    console.error('Error saving user answers', error);
    res.status(500).json({ error: 'Error saving user answers' });
  }
};

// Submit Score Controller
exports.submitScore = async (req, res) => {
  const { useremail, userScore } = req.body;

  try {
    const useranswers = await User.findOne({ email: useremail });

    if (useranswers) {
      useranswers.score = userScore;
      await useranswers.save();
      res.status(200).json({ message: 'Score Submitted Successfully' });
    } else {
      res.status(404).json({ message: 'User answers not found' });
    }
  } catch (error) {
    console.error('Error submitting user score', error);
    res.status(500).json({ error: 'Error submitting user score' });
  }
};
