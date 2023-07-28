import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addManifestData } from "../actions/userAction"; // Import your Redux action here
import "../styles/manifest.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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
            try {
                const response = await fetch("http://localhost:5000/api/manifest", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server.");
                }

                const data = await response.json();
                setManifest(data.manifest); // Update the state with the fetched courses
                console.log("data", data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchManifest(); // Call the fetchCourses function to initiate the API request
    }, []);

    const handleDelete = async (manifestId) => {
        try {
            // Send a DELETE request to the backend API
            await axios.delete(`http://localhost:5000/api/manifest/${manifestId}`);

            // After successful deletion, update the courses state to remove the deleted course
            setManifest((prevCourses) =>
                prevCourses.filter((manifestItem) => manifestItem._id !== manifestId)
            );
        } catch (error) {
            console.error("Error deleting manifest:", error);
        }
    };

    const handleUpdate = (manifestId) => {
        setEditManifest(manifestId); // Set editCourseId to the courseId when clicking the "Update" button
        const manifestToUpdate = manifest.find(
            (manifestItem) => manifestItem._id === manifestId
        );
        setValues({
            week: manifestToUpdate.week,
            email: manifestToUpdate.email,

            developername: manifestToUpdate.developername,
            advisorname: manifestToUpdate.advisorname,
            reviewername: manifestToUpdate.reviewername,
            color: manifestToUpdate.color,
            nextweektask: manifestToUpdate.nextweektask,
            improvementupdate: manifestToUpdate.improvementupdate,
            code: manifestToUpdate.code,
            theory: manifestToUpdate.theory,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        // Clear the error message when the user starts typing again
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form data before submitting
        const formErrors = {};
        if (!values.developername.trim()) {
            formErrors.developername = "Developer name is required";
        }
        if (!values.advisorname.trim()) {
            formErrors.advisorname = "Advisor name is required";
        }
        if (!values.reviewername.trim()) {
            formErrors.reviewername = "Reviewer name is required";
        }
        if (!values.color.trim()) {
            formErrors.color = "Color is required";
        }
        if (!values.nextweektask.trim()) {
            formErrors.nextweektask = "Next Week's Task is required";
        }
        if (!values.improvementupdate.trim()) {
            formErrors.improvementupdate = "Improvement Update is required";
        }
        if (!values.code.trim()) {
            formErrors.code = "Code is required";
        }
        if (!values.theory.trim()) {
            formErrors.theory = "Theory is required";
        }

        if (Object.keys(formErrors).length > 0) {
            // If there are errors, set them in the state and prevent form submission
            setErrors(formErrors);
        } else {
            try {
                if (editmanifest) {
                    // If editCourseId is set, it means we are updating an existing course
                    await axios.put(
                        `http://localhost:5000/api/manifest/${editmanifest}`,
                        values
                    );
                    setEditManifest(null);
                    setValues(initialFormState); // Reset editCourseId to null after updating
                } else {
                    // Dispatch the action to add the course data to the backend server
                    await dispatch(addManifestData(values));
                }

                // After successful submission, fetch the updated course list from the backend API
                const response = await fetch("http://localhost:5000/api/usermanifest", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server.");
                }

                const data = await response.json();
                setManifest(data.course); // Update the state with the fetched courses

                console.log("data", data);

                // Clear the form fields after successful submission
                setValues(initialFormState);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };


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
                    <h1 className="navbrand">Welcome to your Journey</h1>

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
                <ul> 
                    <button style={{backgroundColor:"Green"}} >Task Completed</button>
                    <button style={{backgroundColor:"Yellow"}} >Task Needs Improvement</button>
                    <button style={{backgroundColor:"Orange"}} >Task Critical</button>
                    <button style={{backgroundColor:"Red"}} >Task Not Completed</button>
                    <button style={{backgroundColor:"SkyBlue"}} >Week Repeat</button>
                </ul>
                <h1 className="courselist">Manifest List</h1>
                <div className="cards-container" style={{ color: "white" }}>
                    {filteredManifest.map((manifestItem) => (
                        <div
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
                            <div className="buttons-container">
                                <button
                                    className="deletebutton"
                                    onClick={() => handleDelete(manifestItem._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="updatebutton"
                                    onClick={() => handleUpdate(manifestItem._id)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
