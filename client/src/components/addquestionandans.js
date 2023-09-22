import React, { useEffect, useState } from 'react';
import '../styles/all.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGlobe, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import {removeLoggedInEmailFromCookie} from '../cookieUtils';

function AddQ2AndA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate()

  const userEmailid = getLoggedInEmailFromCookie();
  console.log("adminemailuser", userEmailid);

  useEffect(() => {
      // Check for authentication
      const isAuthenticated = !!localStorage.getItem("jwtAdminToken");
      if (!isAuthenticated) {
          // If not authenticated, redirect to the login page
          navigate("/adminlogin");
      }
  }, [navigate]);

  const isTokenExpired = () => {
      const tokenData = JSON.parse(localStorage.getItem('jwtAdminToken'));
      const expiration = tokenData?.expiration || 0;
      return new Date().getTime() > expiration;
  };

  const removeTokenFromLocalStorage = () => {
      localStorage.removeItem('jwtAdminToken');
  };

  // Call this function when the application loads to handle expired tokens
  useEffect(() => {
      if (isTokenExpired()) {
          removeTokenFromLocalStorage();
          // Additional logic to handle token expiration, such as redirecting to the login page or showing an error message.
      }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });

      if (response.ok) {
        console.log('Question and answer saved successfully');
        setQuestion('');
        setAnswer('');
      } else {
        console.error('Error saving question and answer');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("jwtAdminToken");
    removeLoggedInEmailFromCookie();
    navigate('/adminlogin')
}

  const navigateUser = () => {
    navigate("/admin/user", { state: { adminemail: userEmailid } })
}

const navigatecreateplaylist = () => {
    navigate("/createplaylist")
}

const navigatecreatepdf = () => {
    navigate("/createpdf")
}


  return (
    <div>
      <nav className="navbar">
                <div className="navbrand">
                    <h1>Admin</h1>
                </div>
                <div className="adminloginbutton">
                    <button onClick={navigateUser}>User</button>
                    <button onClick={navigatecreatepdf}>PDF</button>
                    <button onClick={navigatecreateplaylist}>Playlist</button>
                </div>
                <div className="adminloginbutton">
            
                    <button className="adminlogout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

      <div className="App">
        <h1>Add Questions</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Question:
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <br />
          <label>
            Answer:
            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </label>
          <br />
          <button type="submit">Add Question</button>
        </form>
      </div>
    </div>
  );
}

export default AddQ2AndA;
