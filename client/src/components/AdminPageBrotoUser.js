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

export function AdminUserInfo() {
    const [userinfo, setUserinfo] = useState([]);
    const [week, setWeek] = useState({}); // Initialize week as an empty object
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");
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
                const response = await fetch("/admin/user", {
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


    const handleweeksave = async (email) => {
        // Check if the input field is empty
        if (!week.email) {
            setErrorMessage("Week field cannot be empty");
            return;
        }

        // Clear any previous error message if input is not empty
        setErrorMessage("");

        try {
            // Make the POST request to update the user's data
            const response = await axios.post("/admin/userupdate", {
                email: email,
                week: week.email,
            });

          
            setMessage(response.data.message);
            setWeek(initialdata);
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


    const realtimemessagenavigate = (email, name) => {
        navigate('/ChatUser', { state: { useremail: email, username: name } })
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

                <p>{message}</p>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <table className="user-table">
                    <thead>
                        <tr>

                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>UserID</th>
                            <th>Week</th>
                            <th></th>
                            <th>Action</th>
                            <th>Manifest</th>
                            <th>Chat Message</th>
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
                                    <td>{item.status}</td>
                                    <td>{item.userid}</td>
                                    <td>{item.week}</td>
                                    <td>
                                        <input type="text" className="form-control" name="email" onChange={handleChange} placeholder="Update User Week" />
                                    </td>
                                    <td>
                                        {/* Pass the user ID and week value to handleweeksave */}
                                        <button onClick={() => handleweeksave(item.email, week[item.email]?.week)}>Save</button>
                                    </td>
                                    <td><button onClick={() => manifestnavigate(item.email, item.week)}>Manifest</button></td>

                                    <td><button onClick={() => realtimemessagenavigate(item.email, item.name)}>Chat</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>

    );
}
