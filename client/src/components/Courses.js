
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/coursePage.css";
import careerleap from '../views/careerleap.png';

const CoursePage = () => {

    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setfilteredcourses] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlaylistApi, setSelectedPlaylistApi] = useState("null");

    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp



    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        // Filter the courses based on the search query
        const filteredCourses = courses.filter((course) => {
            return course.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Set the state with the filtered courses
        setfilteredcourses(filteredCourses);

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
        // Fetch data from the backend API
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses', {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }

                const data = await response.json();
                setCourses(data.course); // Update the state with the fetched courses
                console.log("data", data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        fetchCourses(); // Call the fetchCourses function to initiate the API request
    }, []);

    const [message, setMessage] = useState(null)


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

    const handleEnroll = (playlistApi, category) => {
        console.log(playlistApi);
        setSelectedPlaylistApi(playlistApi);
        console.log(category);
        navigate('/playlist', { state: { apidata: playlistApi, category: category } }); // Navigate to the PlaylistPage
    };

    const handleEnrollBroto = (category) => {
        console.log(category);
        navigate('/BrotoPlaylist', { state: { category: category } }); // Navigate to the PlaylistPage
    };

    const handleManifest = () => {
        navigate('/manifest', { state: { manifestemail: jwtemail } })
    }
    const handlenavigate = () => {
        navigate('/profile')
    }

    const handleweektask = () => {
        navigate('/weektask')
    }
    return (
        <div className="course-container">
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

            <div className="course-container">
                <div className='searchnav'>
                    <div>
                        <h1 className="courselist">Course List</h1>
                    </div>
                    <div className='searchbar'>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleChange}
                        />
                        <button className="searchbutton" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                </div>
                <div className="coursecategory" >
                    <ul>
                        <button className="merncourse" onClick={() => handleManifest()}>
                            MANIFEST
                        </button>
                        <button onClick={handleweektask} className="weektask">WEEK TASK</button>
                        <button className="merncourse" onClick={() => handleEnrollBroto("BROTO")}>
                            BROTOTYPE
                        </button>

                    </ul>
                </div>
                <div className="cards-container">

                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course._id} className="card">
                                <img src={careerleap} alt="Course" />
                                <h2 className="coursename">{course.name}</h2>
                                <p className="coursedescription">{course.description}</p>
                                <p className="courseprice">Rs.{course.price}</p>
                                <button className="enrollbutton" onClick={() => handleEnroll(course.playlistapi, course.name)}>
                                    Enroll
                                </button>
                                <div className="buttons-container">

                                </div>
                            </div>
                        ))
                    ) : (
                        courses.map((course) => (
                            <div key={course._id} className="card">
                                <img src={careerleap} alt="Course" />
                                <h2 className="coursename">{course.name}</h2>
                                <p className="coursedescription">{course.description}</p>
                                <p className="courseprice">Rs.<strike>{course.price}</strike> Free</p>
                                <button className="enrollbutton" onClick={() => handleEnroll(course.playlistapi, course.name)}>
                                    Enroll
                                </button>
                                <div className="buttons-container">

                                </div>
                            </div>
                        ))
                    )}
                    {!courses.length && searchQuery && (
                        <div className="empty-state">
                            No courses found matching your search query.
                        </div>
                    )}
                </div>
            </div>

        </div >

    );
};

export default CoursePage;
