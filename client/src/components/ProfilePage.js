import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/profilePage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';


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



  const [profileData, setProfileData] = useState({
    email: userData?.data || "",
    image: null,
    imagename: null,
  });



  const [selectedPlaylistApi, setSelectedPlaylistApi] = useState("null");

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null)
  const [images, setFile] = useState(null);
  const [name, setName] = useState(null)

  const [email, setemail] = useState(profileData.email)

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
      try {
        const response = await axios.get(`http://localhost:5000/getuserdata/${jwtemail}`, {
          params: { jwtemail }
        });
        const data = response.data;
        console.log("data gett", response.data);
        setFile(response.data.profileimages)
        setemail(response.data.useremail)
        // Do something with the data here, e.g., set it to a state variable
        // Example: setUserData(data);
      } catch (error) {
        // Handle any errors that occurred during the request
        console.log(error);
      }
    };

    userdata();
  }, []); // Add the dependency here if you need to refetch when the email changes


  const handleFileUpload = async () => {
    // Create a FormData object to send the file to the server
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('email', jwtemail)

    // Make an API call to upload the file to the server
    try {
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

  const handlenavigatecourse = () => {
    navigate('/courses')
  }

  return (
    <div class="profile-container">
      <h1 class="navbrand">Welcome to your profile</h1>
      <div class="user-profile">
        <div class="profile-image">



          <div class="uploadedimage">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Profile Pic" />
            ) : (
              <img src={images} alt="Default Profile Pic" />
            )}

          </div>
          <label htmlFor="fileInput" className="file-input-label">
           Choose File
          </label>
          <input type="file" id="fileInput" className='file-input' ref={fileInputRef} onChange={handleFileChange} />

          <button className="uploadbutton" onClick={handleFileUpload}><FontAwesomeIcon icon={faUpload} /> </button>
          {message && (
            <div class="message">
              <p>{message}</p>
            </div>
          )}
        </div>

        <div class="user-info">
          <div class="user-card">


            <h2>User Information</h2>
            {userData && userData.error && <p>{userData.error}</p>}
            {userData && userData.data ? (
              <p>{userData.data}</p>
            ) : (
              <p>{email}</p>
            )}
          </div>
        </div>
      </div>
      <div class="user-button">
        <button onClick={handlenavigatecourse}>Courses</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>

  );
};

export default ProfilePage;
