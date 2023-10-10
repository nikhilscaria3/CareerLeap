import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addManifestData } from "../actions/userAction"; // Import your Redux action here
import "../styles/manifest.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import careerleaplogo from '../views/careerleaplogo2.png';
import { setAuthToken } from "../utils/api";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS

const initialFormState = {
    week: "",
    email: "",
    developername: "",
    advisorname: "",
    reviewername: "",
    color: "",
    nextweektask: "",
    improvementupdate: "",
    code: "",
    theory: "",
};

export function ManifestUser() {
    const [values, setValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [manifest, setManifest] = useState([]);
    const location = useLocation()
    const manifestemail = location?.state.manifestemail
    const [editmanifest, setEditManifest] = useState(null); // Add editCourseId state
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const data = useSelector((state) => state.courseadd);

    useEffect(() => {
        AOS.init({
            duration: 800,   // Animation duration in milliseconds
            delay: 200,      // Animation delay in milliseconds
            once: false,       // Animation only occurs once
        });
    }, []);


    useEffect(() => {
        // Check for authentication
        const isAuthenticated = !!localStorage.getItem("jwtLoginToken");
        if (!isAuthenticated) {
            // If not authenticated, redirect to the login page
            navigate("/adminlogin");
        }
    }, [navigate]);

    const isTokenExpired = () => {
        const tokenData = JSON.parse(localStorage.getItem("jwtLoginToken"));
        const expiration = tokenData?.expiration || 0;
        return new Date().getTime() > expiration;
    };

    const removeTokenFromLocalStorage = () => {
        localStorage.removeItem("jwtLoginToken");
    };

    // Call this function when the application loads to handle expired tokens
    useEffect(() => {
        if (isTokenExpired()) {
            removeTokenFromLocalStorage();
            // Additional logic to handle token expiration, such as redirecting to the login page or showing an error message.
        }
    }, []);

    useEffect(() => {
        // Fetch data from the backend API
        const fetchManifest = async () => {
            const token = localStorage.getItem('jwtLoginToken');
            try {
                setAuthToken(token);
                const response = await axios.get("/api/manifest");

                if (!response.data) {
                    throw new Error("Failed to fetch data from the server.");
                }

                setManifest(response.data.manifest); // Update the state with the fetched data
              
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchManifest(); // Call the fetchManifest function to initiate the API request
    }, []);


    const filteredManifest = manifest.filter(
        (manifestItem) => manifestItem.email === `${manifestemail}`
    );


    const handlenavigate = () => {
        navigate("/profile");
    };

    const handlecoursenavigate = () => {
        navigate('/courses')
    }
    const handleweeknavigate = () => {
        navigate('/weektask')
    }

    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <img className="navlogo" src={careerleaplogo} alt="Form Logo" />

                </div>
                <div className='coursecategory'>
                    <ul>
                        <button onClick={handlecoursenavigate}>Courses</button>
                        <button onClick={handleweeknavigate}>Week Task</button>
                    </ul>

                </div>

                <div className="adminloginbutton">
                    <button onClick={handlenavigate}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                </div>
            </nav>

            <div className="course-container">
                <ul className="manifestbuttoncontainer">
                    <button style={{ backgroundColor: "Green" }} >Task Completed</button>
                    <button style={{ backgroundColor: "Yellow" }} >Task Needs Improvement</button>
                    <button style={{ backgroundColor: "Orange" }} >Task Critical</button>
                    <button style={{ backgroundColor: "Red" }} >Task Not Completed</button>
                    <button style={{ backgroundColor: "SkyBlue" }} >Week Repeat</button>
                </ul>
                <h1 className="courselist">Manifest List</h1>
                <div className="cards-container" style={{ color: "white" }}>
                    {filteredManifest.slice().reverse().map((manifestItem) => (
                        <div
                            data-aos="zoom-in"
                            key={manifestItem._id}
                            className="card"
                            style={{ backgroundColor: manifestItem.color, color: "Black" }}
                        >
                            <button className="manifestitemweek">{manifestItem.week}</button>
                            <h2 className="coursename">{manifestItem.developername}</h2>
                            <p className="coursedescription">Advisor Name: {manifestItem.advisorname}</p>
                            <p>Reviewer Name: {manifestItem.reviewername}</p>
                            <p>Color: {manifestItem.color}</p>
                            <p>Code: {manifestItem.code}</p>
                            <p>Theory: {manifestItem.theory}</p>
                            <p>Next Week's Task:</p>
                            <h5>{manifestItem.nextweektask}</h5>
                            <p>Improvement Update:</p>
                            <h5>{manifestItem.improvementupdate}</h5>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
