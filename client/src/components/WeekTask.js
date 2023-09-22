import { useEffect, useState } from 'react';
import '../styles/weektask.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { WeekTaskInfo } from './WeekTaskInfo';
import axios from 'axios';
import Circular from '../views/Ciricular.jpg'
import careerleaplogo from '../views/careerleaplogo2.png';


export function WeekTask() {
  const [week, setWeek] = useState(null);
  const [weekNo, setWeekNumber] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const navigate = useNavigate();
  const [weekTasks, setWeekTasks] = useState([]);
  const encodedData = localStorage.getItem("randomsession");
  const [showImage, setShowImage] = useState(false);

  // Step 2: Decode the data using Base64
  const decodedData = atob(encodedData);

  // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
  const jwtemail = decodedData.substring(13); // Extracting data after the timestamp

  const [email, setemail] = useState(null)

  console.log("setdata", weekTasks);

  useEffect(() => {
    const fetchTimerDataFromBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getTimerData");
        setDaysRemaining(response.data.remainingDays);
        console.log("Timer data fetched from the backend!");
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    fetchTimerDataFromBackend();
  }, []);

  useEffect(() => {
    // Check for authentication
    const isAuthenticated = !!localStorage.getItem("jwtLoginToken");
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const userdata = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getuserdata/${jwtemail}`, {
          params: { jwtemail }
        });

        console.log("data gett", response.data);
        setemail(response.data.useremail)
        setWeek(response.data.userweek)
        // Do something with the data here, e.g., set it to a state variable
        // Example: setUserData(data);
      } catch (error) {
        // Handle any errors that occurred during the request
        console.log(error);
      }
    };

    userdata();
  }, []); // Add the dependency here if you need to refetch when the email changes



  useEffect(() => {
    const fetchTaskInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gettaskinfoweek");
        const taskInfoData = response.data.data; // Access the 'data' property here
        console.log("taskInfoData:", taskInfoData);
        console.log("Type of taskInfoData:", typeof taskInfoData);

        // Check if taskInfoData is an array before setting it to weekTasks
        if (Array.isArray(taskInfoData)) {
          setWeekTasks(taskInfoData);
        } else {
          console.error("Task data is not an array:", taskInfoData);
        }
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    fetchTaskInfo();
  }, []);


  const showWeek = (weekNumber) => {
    setWeek(`Week ${weekNumber}`);
    setWeekNumber(`${weekNumber}`);
    navigate('/weektaskinfo', { state: { data: `Week ${weekNumber}`, weeknumber: weekNumber } });
  };

  const handlenavigate = () => {
    navigate('/profile')
  }

  const handlemanifestnavigate = () => {
    navigate("/manifest", { state: { manifestemail: jwtemail } });
  };

  const handlecoursenavigate = () => {
    navigate('/courses')
  }


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
        <p></p>
        <div className="weekbuttons">
          {weekTasks.map((data, index) => {
            const weekNumber = index + 1;
            const isDisabled = weekNumber > parseInt(week.slice(-1));

            return (
              <button
                key={weekNumber}
                onClick={() => showWeek(weekNumber)}
                disabled={isDisabled}
                className={isDisabled ? 'disabled-button' : ''}
              >
                {isDisabled ? <span className="lock-icon">🔒</span> : null}
                Week {weekNumber}
                {/* Debugging information */}
                {/* <span>status: {JSON.parse(data.status) ? 'Locked' : 'Unlocked'}</span> */}
              </button>
            );
          })}
        </div>




      </div>

      <div className="weektaskcontainer">
      <div>
      {/* Step 4: Add the button and the event handler */}
      <button className='circularbutton' onClick={handleToggleImage}>
        {showImage ? 'Hide Note' : 'Show Note'}
      </button>

      {/* Step 5: Conditionally render the image */}
      {showImage && <img className='circularimage' src={Circular} alt="Your Image" />}
    </div>
      </div>

    </div>

  );
}
