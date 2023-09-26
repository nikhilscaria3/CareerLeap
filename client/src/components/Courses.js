
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGlobe, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/coursePage.css";
import careerleap from '../views/CareerLeapMain.png';
import careerleaplogo from '../views/careerleaplogo2.png';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS
import axios from "axios";
import { setAuthToken } from '../utils/api';



const CoursePage = () => {

    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setfilteredcourses] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlaylistApi, setSelectedPlaylistApi] = useState("null");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp

    useEffect(() => {
        AOS.init({
            duration: 800,   // Animation duration in milliseconds
            delay: 200,      // Animation delay in milliseconds
            once: false,       // Animation only occurs once
        });
    }, []);


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

    const token = localStorage.getItem("jwtLLoginToken")



    useEffect(() => {
        // Fetch data from the backend API
        const fetchCourses = async () => {
            const token = localStorage.getItem('jwtLoginToken');
            try {
                setAuthToken(token);
                const response = await axios.get(`/api/courses`, {
                    params: {
                        page: currentPage,
                        pageSize: pageSize,
                    },
                    headers: {
                        // You can set headers here if needed
                        // Example: Authorization: `Bearer ${token}`
                    },
                });

                if (!response.data) {
                    throw new Error('Failed to fetch data from the server.');
                }

                setCourses(response.data.course); // Update the state with the fetched courses
                console.log("data", response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCourses(); // Call the fetchCourses function to initiate the API request
    }, []);


    const totalPages = courses ? Math.ceil(courses.length / pageSize) : 0;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const coursesToDisplay = courses ? courses.slice(startIndex, endIndex) : [];


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

    const handlejscompiler = () => {
        navigate('/jscompiler')
    }

    const handlemessage = () => {
        navigate('/Receiver', { state: { useremail: jwtemail } })
    }


    const navigateglobalnavigate = () => {
        navigate('/Global')
    }

    const handlepdfnotes = () => {
        navigate('/pdf')
    }



    return (
        <div className="course-container">
            <nav className="navbar">
                <div className="navbrand">

                    <img className="navlogo" src={careerleaplogo} alt="Form Logo" />

                </div>
                <div className="adminloginbutton">
                    <button onClick={navigateglobalnavigate}>
                        <FontAwesomeIcon icon={faGlobe} />
                    </button>
                    <button onClick={handlemessage}>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
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
                        <button onClick={handlejscompiler} className="weektask">COMPILER</button>
                        <button onClick={handlepdfnotes} className="weektask">PDF NOTES</button>
                    </ul>
                </div>
                <div className="cards-container" data-aos="fade-up">

                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course._id} data-aos="zoom-in" className="card">
                                <img src={careerleap} alt="Course" />
                                <h2 className="coursename">{course.name}</h2>
                                <p className="coursedescription">{course.description}</p>
                                <p className="courseprice">Rs.{course.price}</p>
                                <button className="enrollbutton" onClick={() => handleEnroll(course.playlistapi, course.name)}>
                                    <span>Enroll</span>
                                </button>
                                <div className="buttons-container">

                                </div>
                            </div>
                        ))
                    ) : (!coursesToDisplay.length || searchQuery) ? (
                        <div className="empty-state">
                            No courses found matching your search query.
                        </div>
                    ) : (
                        coursesToDisplay.map((course) => (
                            <div key={course._id} data-aos="zoom-in" className="card">
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
                <div className="pagination-container">
                    <button className="previousbutton" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    <span className="pagination-indicator">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button className="nextbutton" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>

            </div>

        </div >

    );
};

export default CoursePage;
