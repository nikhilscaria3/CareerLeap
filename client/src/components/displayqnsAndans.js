import React, { useEffect, useState } from 'react';
import '../styles/DisplayQuestionAndAnswers.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function DisplayQuestionAndAnswers() {
  const [questions, setQuestions] = useState([]);
  const [realAnswers, setRealAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userScores, setUserScores] = useState([]);
  const [usermail,setusermail] = useState(null);

  const location = useLocation()
  const fumigationuseremail = location?.state.useremail
  const fumigationusername = location?.state.manifestname

  useEffect(() => {
    fetchQuestions();
    fetchUserAnswers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/userquestions');
      const data = response.data;
      console.log(data);
      setQuestions(data);
      setRealAnswers(data.map(question => question.answer));
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const fetchUserAnswers = async () => {
    try {
      const response = await axios.get('/useranswers', {
        params: { useremail: fumigationuseremail } // Use 'params' to send query parameters
      });
      const data = response.data;
      console.log(data)
      setUserAnswers(data[0]?.useranswers); // Extract useranswers array from the response
    } catch (error) {
      console.error('Error fetching user answers', error);
    }
  };


  const handleCorrectAnswer = (index) => {
    const updatedScores = [...userScores];
    updatedScores[index] = 1; // Correct answer
    setUserScores(updatedScores);
  };

  const handleWrongAnswer = (index) => {
    const updatedScores = [...userScores];
    updatedScores[index] = 0; // Wrong answer
    setUserScores(updatedScores);
  };

  const handleUserAnswerChange = (e, index) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[index] = e.target.value;
    setUserAnswers(updatedUserAnswers);
  };


  return (
    <div className="App">
      <h1>Your Answers</h1>
      <div>
        {questions.length > 0 && questions.length === realAnswers.length && userAnswers.length === realAnswers.length ? (
          questions.map((question, index) => (
            <div className='maindiv' key={index}>
              <p>Question {index + 1}:</p>
              <p>{question.question}</p>
              <div className="answer-container">
                <input
                  type="text"
                  className="user-answer-input"
                  value={userAnswers[index]}
                  onChange={(e) => handleUserAnswerChange(e, index)}
                  readOnly={userScores[index] !== undefined} // Make the input readonly if the user has answered or if it's been scored
                />
              </div>
              <p>Answer: <span className='real-answers'>{realAnswers[index]}</span></p>
            </div>
          ))
        ) : (
          <p>Loading questions and answers... OR Not Found</p>
        )}
      </div>
    </div>
  );
}

export default DisplayQuestionAndAnswers;
