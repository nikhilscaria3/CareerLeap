import React, { useEffect, useState } from 'react';
import '../styles/weektask.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Circular from '../views/Ciricular.jpg';
import careerleaplogo from '../views/careerleaplogo2.png';
import axios from 'axios';
import { setAuthToken } from '../utils/api';


export function WeekTask() {
  const [week, setWeek] = useState('');
  const [weekTasks, setWeekTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();
  const encodedData = localStorage.getItem("randomsession");
  const decodedData = atob(encodedData);
  const jwtemail = decodedData.substring(13);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtLoginToken');
            try {
                setAuthToken(token);
        // Fetch task data
        const taskResponse = await axios.get("/gettaskinfoweek");
        const taskInfoData = taskResponse.data.data;

        if (Array.isArray(taskInfoData)) {
          setWeekTasks(taskInfoData);
        } else {
          console.error("Task data is not an array:", taskInfoData);
        }

        // Fetch user data
        const userResponse = await axios.get(`/getuserdata/${jwtemail}`, {
          params: { jwtemail }
        });
        const userData = userResponse.data;
        setWeek(userData.userweek || ""); // Set default value as an empty string if userweek is null or undefined
      } catch (error) {
        console.error("API Call Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwtemail]);

  const showWeek = (weekNumber) => {
    navigate('/weektaskinfo', { state: { data: `Week ${weekNumber}`, weeknumber: weekNumber } });
  };

  const handlenavigate = () => {
    navigate('/profile');
  };

  const handlemanifestnavigate = () => {
    navigate("/manifest", { state: { manifestemail: jwtemail } });
  };

  const handlecoursenavigate = () => {
    navigate('/courses');
  };

  const handleToggleImage = () => {
    // Toggle the state of showImage between true and false
    setShowImage(!showImage);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbrand">
          <img className="navlogo" src={careerleaplogo} alt="Form Logo" />
        </div>
        <div className='coursecategory'>
          <ul>
            <button onClick={handlemanifestnavigate}>Manifest</button>
            <button onClick={handlecoursenavigate}>Courses</button>
          </ul>
        </div>
        <div className="adminloginbutton">
          <button onClick={handlenavigate}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </nav>
      <div className="weektaskcontainer">
        <h1>28 Week Journey</h1>
       
        <div className="weekbuttons">
          {loading ? (
            <div>Loading...</div>
          ) : (
            weekTasks.map((data, index) => {
              const weekNumber = index + 1;
              const isDisabled = weekNumber > parseInt(week.slice(-1), 10);
              return (
                <button
                  key={weekNumber}
                  onClick={() => showWeek(weekNumber)}
                  disabled={isDisabled}
                  className={isDisabled ? 'disabled-button' : ''}
                >
                  {isDisabled ? <span className="lock-icon">🔒</span> : null}
                  Week {weekNumber}
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className="weektaskcontainer">
        <div>
          <button className='circularbutton' onClick={handleToggleImage}>
            {showImage ? 'Hide Note' : 'Show Note'}
          </button>
          {showImage && <img className='circularimage' src={Circular} alt="Your Image" />}
        </div>
      </div>
    </div>
  );
}
