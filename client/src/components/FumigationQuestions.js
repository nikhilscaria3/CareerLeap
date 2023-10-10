import React, { useEffect, useRef, useState } from 'react';
import '../styles/DisplayQuestions.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from 'react-router-dom';

function DisplayQuestions() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0); // Initialize with 0
  const [message, setMessage] = useState(null)
  const navigate = useNavigate();
  const encodedData = localStorage.getItem("randomsession");

  // Step 2: Decode the data using Base64
  const decodedData = atob(encodedData);

  // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
  const jwtemail = decodedData.substring(13); // Extracting data after the timestamp

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [timer, setTimer] = useState(15); // Set an initial timer value in seconds
  const [timerActive, setTimerActive] = useState(false); // Track if the timer is active
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)
  const [isCameraCountdownActive, setIsCameraCountdownActive] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState(5);
  const [timerStopped, setTimerStopped] = useState(false);


  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the video element is available in the DOM
    if (videoRef.current && stream) {
      // Set the srcObject property when the video element is available
      videoRef.current.srcObject = stream;
    }
  }, [stream]);


  const handleToggleCamera = async () => {
    try {
      if (isCameraActive) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCameraCountdownActive(false); // Stop the countdown when deactivating the camera
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
        setIsCameraCountdownActive(true); // Start the countdown when activating the camera
      }
      setIsCameraActive(!isCameraActive);
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Add logic here to inform the user of the error, e.g., show an error message on the screen.
    }
  };




  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have unfinished answers. Are you sure you want to leave?';
    };

    const handleUnload = () => {
      // Clear the beforeunload event listener when leaving the page
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

    // Add the beforeunload and unload event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    fetchQuestions();

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);


  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/questions');
      const data = response.data;
      console.log(data);
      setQuestions(data);
      setUserAnswers(new Array(data.length).fill(''));
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };


  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    console.log(totalMarks);
    try {
      // Calculate the total marks
      let totalMarks = 0;
      for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i].toLowerCase() === questions[i].answer.toLowerCase()) {
          totalMarks = totalMarks + 1; // Correct answer (case-insensitive comparison)
        }
      }

      console.log('Total Marks:', totalMarks);

      // Submit user answers
      const answersResponse = await axios.post('/addAnswers', {
        questions: questions.map(question => question.question),
        userAnswers,
        useremail: jwtemail,
        realAnswers: questions.map(question => question.answer),
        userScore: totalMarks
      });

      if (answersResponse.status === 200) {
        console.log('Answers saved successfully');
        setMessage("Response Submitted Successfully")
        // Update the totalMarks state
        setTotalMarks(totalMarks);

        // Clear user answers and refresh questions after successful submission
        setUserAnswers(new Array(questions.length).fill(''));
        fetchQuestions();

        // Now, submit user score
        const scoreResponse = await axios.post('/submitscore', {
          useremail: jwtemail,
          userScore: totalMarks
        });

        if (scoreResponse.status === 200) {
          console.log('Score saved successfully');
        } else {
          console.error('Error saving score');
        }
      } else {
        console.error('Error saving answers');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  useEffect(() => {
    let countdownInterval;

    if (isCameraCountdownActive) {
      countdownInterval = setInterval(() => {
        setCameraCountdown(prevCountdown => prevCountdown - 1);

        if (cameraCountdown === 0) {
          clearInterval(countdownInterval);
          setIsCameraCountdownActive(false);

          // Immediately start the question timer

          setTimerActive(true);
        }
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isCameraCountdownActive, cameraCountdown]);


  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(timerInterval); // Clear the timer interval
          moveToNextQuestion(); // Move to the next question when the timer reaches 0
          return 15; // Reset the timer for the next question
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Clear the timer interval when the component unmounts or when transitioning to the next question
    };
  }, [currentQuestionIndex]);



  const moveToNextQuestion = () => {
    // Check if it's the last question
    if (currentQuestionIndex === null) {
      setCurrentQuestionIndex(0); // Start from the first question
    } else if (currentQuestionIndex === questions.length - 1) {
      setTimerStopped(true);   // If it's the last question, do nothing when the timer ends
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(15); // Reset the timer for the next question
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleToggleButton = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handlenavigate = () => {
    navigate("/profile");
  };

  const profilenavigate = () => {
    setIsCameraActive(true)
    navigate("/profile");
  }

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }


  return (
    <div>
      {!isContentVisible && <div class="center-button-container" onClick={handleToggleButton}>
        <button onClick={handleToggleCamera}>
          {isCameraActive ? '' : 'Activate MCQ  '}
        </button>
      </div>}

      {isCameraCountdownActive && (
        <div className="center-button-container">
          <h1>MCQ Start In {cameraCountdown} Seconds</h1>
        </div>
      )}

      <nav className="navbar">
        <div className="navbrand">
          <h1 className="navbrand">Welcome to your Journey</h1>

        </div>
        <div className='coursecategory'>


        </div>

        <div className="adminloginbutton">
          <button onClick={handlenavigate}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </nav>

      {isContentVisible && currentQuestionIndex !== null && questions[currentQuestionIndex] && (
        // Render the current question here
        // Render questions here
        <>
          <div className="camera-access-container">
           
          </div>

          <div className="fake-security-container">
            <div className="notification">
              <div className="blinking-dot"></div>
              <p>You are under surveillance with AI. Manipulation detected. You will be terminated.</p>
            </div>
          </div>
          <div className="questioncontainer">
            <div>
              <p className='warningscore'>Each accurate response is worth 1 point.</p>
            </div>
            <h1>One Word Answers</h1>

            <div className='displayquestion'>
              <p>Question {currentQuestionIndex + 1}:</p>
              <p>{questions[currentQuestionIndex].question}</p>

              {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <div className='option-container' key={optionIndex}>
                  <input
                    type="radio"
                    id={option}
                    name={`question_${currentQuestionIndex}`} // Use a unique name for each question
                    value={option} // Set the value to the option
                    onChange={(e) => handleAnswerChange(e, currentQuestionIndex)}
                    onPaste={handlePaste}
                    checked={userAnswers[currentQuestionIndex] === option} // Check the radio if the user has selected this option
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>



            <div>
              {timerStopped ? (
                <div className="timer-stopped-message">
                  <p>Your time has run out! </p>
                </div>
              ) : (
                <div className='timer-container'>
                  <h4>Time Remaining: {timer} seconds</h4>
                </div>
              )}
            </div>


            <div className="message-container">
              <p>{message}</p>
              {currentQuestionIndex === questions.length - 1 ? (
                // Render the submit button when on the last question
                <>
                  <button type="submit" onClick={handleSubmitAnswers}>Submit Answers</button>
                  {message && (
                    <button onClick={profilenavigate}>Back To Profile</button>
                  )}
                </>
              ) : (
                // Render the "Next Question" button for questions that are not the last one
                <button onClick={moveToNextQuestion}>Next Question</button>
              )}
            </div>


          </div>
        </>
      )
      }
    </div >



  );
}

export default DisplayQuestions;
