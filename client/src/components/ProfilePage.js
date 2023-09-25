import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/profilePage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { isVisible } from '@testing-library/user-event/dist/utils';
import { setAuthToken } from '../utils/api';


const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const userData = location.state?.data;
  const fileInputRef = useRef(null);

  const encodedData = localStorage.getItem("randomsession");

  // Step 2: Decode the data using Base64
  const decodedData = atob(encodedData);

  // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
  const jwtemail = decodedData.substring(13); // Extracting data after the timestamp

console.log("jwt",jwtemail);

  const [profileData, setProfileData] = useState({
    email: userData?.data || "",
    image: null,
    imagename: null,
  });




  const [selectedPlaylistApi, setSelectedPlaylistApi] = useState("null");

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null)
  const [images, setFile] = useState(null);
  const [name, setName] = useState(null);
  const [id, setuserId] = useState(null)
  const [fetchid, setuserresponseid] = useState(null)
  const [score, setScore] = useState(null)
  const [email, setemail] = useState(profileData.email)
  const [isVisible, setVisible] = useState(false)
  console.log("email", email);

  const handleFileChange = (event) => {
    // Get the selected file from the input field
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    if (message) {
      // Only set a timeout if the message is not empty
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      // Cleanup function to clear the timeout if the component unmounts or the message changes before 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);


  useEffect(() => {
    const userdata = async () => {
      const token = localStorage.getItem('jwtLoginToken');
      try {
        setAuthToken(token);
        const response = await axios.get(`/getuserdata/${jwtemail}`, {
          params: { jwtemail }
          
        });
        const data = response.data;
        console.log("data gett", response.data);
        setFile(response.data.profileimages)
        setemail(response.data.useremail)
        setuserresponseid(response.data.userid)
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
    const userscore = async () => {
      const token = localStorage.getItem('jwtLoginToken');
      try {
        setAuthToken(token);
        const response = await axios.get(`http://localhost:5000/getuserscore/${jwtemail}`, {
          params: { jwtemail }
        });

        console.log("data gett", response.data);
        setScore(response.data.score)
        // Do something with the data here, e.g., set it to a state variable
        // Example: setUserData(data);
      } catch (error) {
        // Handle any errors that occurred during the request
        console.log(error);
      }
    };

    userscore();
  }, []); // Add the dependency here if you need to refetch when the email changes


  const handleFileUpload = async () => {
    // Create a FormData object to send the file to the server
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('email', jwtemail)

    // Make an API call to upload the file to the server
    const token = localStorage.getItem('jwtLoginToken');
    try {
      setAuthToken(token);
      // Make an API call to upload the file to the server
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);
      setMessage(response.data.message)
      setFile(response.data.file)

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Add your logic here to handle the response from the server after successful upload

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Function to check if the token is expired
  const isTokenExpired = () => {
    const tokenData = JSON.parse(localStorage.getItem('jwtLoginToken'));
    const expiration = tokenData?.expiration || 0;
    return new Date().getTime() > expiration;
  };

  
  const removeTokenFromLocalStorage = () => {
    localStorage.removeItem('jwtLoginToken');
  };

  // Call this function when the application loads to handle expired tokens
  useEffect(() => {
    if (isTokenExpired()) {
      removeTokenFromLocalStorage();
      // Additional logic to handle token expiration, such as redirecting to the login page or showing an error message.
    }
  }, []);

  const handleLogout = () => {
    // Implement the logout functionality here
    localStorage.removeItem('jwtLoginToken');
    localStorage.removeItem('randomsession');

    // Use setTimeout to navigate after removing items from localStorage
    setTimeout(() => {
      navigate('/login');
    }, 10); // A very short delay, you can adjust the delay as needed
  };


  const fumigationanswersnavigate = (email) => {
    navigate('/questionandanswers', { state: { useremail: jwtemail } })
  }

  const handlenavigatefumigation = () => {
    setTimeout(() => {
      navigate('/fumigationquestion')
    }, 2000);

  }


  const handletoggle = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const handlenavigatecourse = () => {
    navigate('/courses')
  }

  
  return (
    <div className="profile-container">
      <h1 className="navbrand text-center text-primary mt-4">Welcome to your profile</h1>
      <div className="user-profile d-flex justify-content-center align-items-start">
        {/* Profile Image */}
        <div className="profile-image text-center">
          <div className="uploadedimage">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Profile Pic" className="img-fluid rounded-circle" />
            ) : (
              <img src={images} alt="No Profile" className="img-fluid rounded-circle" />
            )}
          </div>

          {/* File Upload */}
          <div className="file-upload-container mt-2">
            <label htmlFor="fileInput" className="file-input-label">
              <FontAwesomeIcon icon={faCamera} />
            </label>
            <input
              type="file"
              id="fileInput"
              className="file-input"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              className="upload-button btn btn-primary mt-2"
              onClick={handleFileUpload}
              disabled={!fileInputRef.current || !fileInputRef.current.value}
            >
              <FontAwesomeIcon icon={faUpload} /> Upload
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="message mt-2">
              <p>{message}</p>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="user-info ml-4">
          <div className="user-card">
            <h2 className='nametagheading'>User Information</h2>
            {userData && userData.error && <p>{userData.error}</p>}
            {userData && userData.data ? (
              <p>Email: {userData.data}</p>
            ) : (
              <p>Email: {email}</p>
            )}
            <br/>
            {fetchid ? <p>ID: {fetchid}</p> : "Id: Not Available"}
          </div>
        </div>
      </div>

      {/* Score Container */}
      {score && (
        <div className={`score-container mt-4 ${score >= 5 ? 'text-success' : 'text-danger'}`}>
          {score >= 5 ? (
            <p>Congratulations! You have passed the OOPS Section with a score of {score}/10 </p>
          ) : (
            <p>Unfortunately, you did not pass the OOPS Section. Your score is {score}/10.</p>
          )}
        </div>
      )}

      {/* Administrator Message Container */}
      {score && score < 5 && (
        <div className="administratormessaage-container mt-2">
          <h5 className="administrator-message">Please contact your administrator for further information.</h5>
        </div>
      )}

      {/* User Button Container */}
      <div className="user-button mt-4">
        {fetchid && <button onClick={handlenavigatecourse} className="btn btn-primary mr-2">Courses</button>}
        {!score && <button onClick={handletoggle} className="btn btn-primary mr-2">Fumigation</button>}
        {score && <button onClick={fumigationanswersnavigate} className="btn btn-primary mr-2">Answers</button>}
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      {/* Overlay */}
      <div className={`dull-overlay ${isVisible ? 'show' : ''}`} />

      {/* Profile Center Button Container */}
      {isVisible && (
        <div className="profilecenter-button-container mt-4">
          <p>Your attendance is required for the upcoming fumigation session.</p>
          <p>By attending, you acknowledge that the AI-controlled camera will be activated to monitor the session.</p>
          <p>Any attempt to manipulate or disrupt the session will result in immediate termination.</p>
          <button onClick={handlenavigatefumigation} className="btn btn-success mr-2">Ready To Attend</button>
          <button onClick={handleClose} className="btn btn-secondary">Close</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
