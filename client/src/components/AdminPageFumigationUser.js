import { useEffect, useState } from "react";
import "../styles/adminpageuser.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faSearch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from "react-redux";
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import { removeLoggedInEmailFromCookie } from '../cookieUtils';

export function AdminFumigationUserInfo() {
    const [userinfo, setUserinfo] = useState([]);
    const [week, setWeek] = useState(null); // Initialize week as an empty object
    const [message, setMessage] = useState(null)
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const userEmailid = getLoggedInEmailFromCookie();
    // Step 2: Define the event handler for the search input change

    // ... (rest of the code)

    const [initialdata] = useState({

        email: "",

    })



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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWeek((prevData) => ({ ...prevData, [name]: value }));
    };


    useEffect(() => {
        // Fetch data from the backend API
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/admin/fumigationuser", {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server.");
                }

                const data = await response.json();
                setUserinfo(data.data); // Update the state with the fetched courses
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCourses(); // Call the fetchCourses function to initiate the API request
    }, [])


    const handleuseridsave = async (email) => {
        console.log("week", week.email);
        try {
            // Make the POST request to update the user's data
            const response = await axios.post("http://localhost:5000/admin/useridupdate", {
                email: email,
                userid: week.email,
            });

            console.log(response.data.message);
            setMessage(response.data.message)
            setWeek(initialdata)
        } catch (error) {
            // Handle error or show an error message
            console.error("Error fetching data:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtAdminToken");
        removeLoggedInEmailFromCookie();
        navigate('/adminlogin')
    }

    const navigatecourseadd = () => {
        navigate("/courseadd")
    }

    const manifestnavigate = (email, itemweek) => {
        navigate('/admin/manifest', { state: { manifestemail: email, currentweek: itemweek } })
    }

    const messagenavigate = (email, name) => {
        navigate('/admin/message', { state: { useremail: email, username: name } })
    }

    const fumigationanswersnavigate = (email, name) => {
        navigate('/questionandanswers', { state: { useremail: email, username: name } })
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Step 3: Filter the userinfo array based on the search input
    const filteredUsers = userinfo.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const navigatecreateplaylist = () => {
        navigate("/createplaylist")
    }

    const navigatecreatepdf = () => {
        navigate("/createpdf")
    }

    const navigateglobalnavigate = () => {
        navigate("/Global")
    }

    const navigateaddquestion = () => {
        navigate("/addquestions")
    }
    const handleadduser = () => {
        navigate("/adduserid")
    }

    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1>Admin</h1>

                </div>
                <div className="adminloginbutton">
                    <button onClick={navigatecreatepdf}>PDF</button>
                    <button onClick={navigatecreateplaylist}>Playlist</button>
                    <button onClick={navigatecourseadd}>Course Add</button>
                    <button onClick={navigateaddquestion}>Add Questions</button>
                </div>
                <div className="adminloginbutton">
                    <button onClick={navigateglobalnavigate}>
                        <FontAwesomeIcon icon={faGlobe} />
                    </button>
                    <button className="adminlogout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="course-container">
                <div className='searchnav'>
                    <div>
                        <h1 className="courselist">User List</h1>
                    </div>
                    <div className='searchbar'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search.."
                        />
                        <button className="searchbutton">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                </div>
                <div className="message">
                    <p>{message}</p>
                </div>
                <table className="user-table">
                    <thead>
                        <tr>
                           
                            <th>Name</th>
                            <th>Email</th>

                            <th>Score</th>
                            <th></th>

                            <th>Action</th>
                            <th>Message</th>
                            <th>userAnswers</th>
                            {/* Add more table headings for other user details */}
                        </tr>
                    </thead>
                    <tbody>
                        {!filteredUsers.length ? (
                            <tr>
                                <td colSpan="7">No matching users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map((item, index) => (
                                <tr key={index + 1}>
                                   
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>

                                    <td>{item.score}</td>
                                    <td>
                                        <input type="text" className="form-control" name="email" onChange={handleChange} placeholder="Add UserID" />
                                    </td>
                                    <td>
                                        {/* Pass the user ID and week value to handleweeksave */}
                                        <button onClick={() => handleuseridsave(item.email, week[item.email]?.week)}>Save</button>

                                    </td>
                                    <td><button onClick={() => messagenavigate(item.email, item.name)}>Message</button></td>
                                    <td><button onClick={() => fumigationanswersnavigate(item.email, item.name)}>Answers</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>

    );
}
