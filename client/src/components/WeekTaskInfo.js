import { useEffect, useState } from 'react';
import '../styles/weektask.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation } from 'react-router-dom';

export function WeekTaskInfo() {
  const location = useLocation();
  const taskweek = location?.state?.data;
  const [taskInfoData, setTaskInfoData] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [lastDay, setLastDay] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
const navigate = useNavigate();

  const setTimer = () => {
    // Set the start time when the button is clicked
    setStartTimestamp(Date.now()); // Store the current timestamp when the timer is started

    // Calculate the end date of the week (7 days from now) and set remainingDays
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    setLastDay(endDate.getTime());

    // Reset daysRemaining state to 7 when starting the timer
    setDaysRemaining(7);
  };

  const fetchTimerDataFromBackend = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getTimerData");
      setStartTimestamp(response.startTimestamp);
      setDaysRemaining(response.remainingDays);
      console.log("Timer data fetched from the backend!");
    } catch (error) {
      console.error("API Call Error:", error);
    }
  };

  useEffect(() => {
    // Check for authentication
    const isAuthenticated = !!localStorage.getItem("jwtLoginToken");
    if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        navigate("/login");
    }
}, [navigate]);

  useEffect(() => {
    fetchTimerDataFromBackend();
  }, []);

  useEffect(() => {
    if (lastDay) {
      const currentDate = new Date();
      const remainingTime = lastDay - currentDate.getTime();
      const daysDiff = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(daysDiff, 0);
      setDaysRemaining(daysRemaining);
    }
  }, [lastDay]);

  const saveToBackend = async () => {
    try {
      await axios.post("http://localhost:5000/api/startTimer", {
        startTimestamp,
        daysRemaining,
      });
      console.log("Timer data saved to the backend!");
    } catch (error) {
      console.error("API Call Error:", error);
    }
  };

  useEffect(() => {
    const fetchTaskInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/gettaskinfo/${taskweek}`);
        const taskInfoData = response.data;
        console.log("taskInfoData", taskInfoData);
        setTaskInfoData(taskInfoData);
      } catch (error) {
        console.error('API Call Error:', error);
      }
    };

    fetchTaskInfo();
  }, [taskweek]);

  let renderedDescription = null;
  if (taskInfoData) {
    const taskInfoDataArray = Object.entries(taskInfoData);
    const description = taskInfoDataArray[1][1];
    renderedDescription = description.split("\n").map((line, index) => (
      <p key={index}>{line}</p>
    ));
  }

  const handlenavigate = () => {
    navigate('/profile')
  }


  return (
    <div>
      <nav className="navbar">
        <div className="navbrand">
          <h1 className="navbrand">Welcome to your Journey</h1>

        </div>
        <div className="adminloginbutton">
          <button onClick={handlenavigate}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </nav>
      <div className="weektaskinfo">
        <h1 id="title">Weekly Task Information</h1>
        <br />

        <div className='weektaskcontainer'>
          <p>{taskweek}</p>
          <div className='renderedDescription'
          >{renderedDescription}</div>
        </div>
      </div>
    </div>
  );
}
