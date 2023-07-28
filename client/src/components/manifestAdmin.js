import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addManifestData } from "../actions/userAction"; // Import your Redux action here
import "../styles/manifest.css";
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

export function ManifestAdmin() {
    const [values, setValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [manifest, setManifest] = useState([]);
    const [message, setMessage] = useState(null)
    const location = useLocation()
    const manifestemail = location?.state.manifestemail
    const manifestname = location?.state.manifestname
    const manifestcurrentweek = location?.state.currentweek
    const [editmanifest, setEditManifest] = useState(null); // Add editCourseId state
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const data = useSelector((state) => state.courseadd);

    useEffect(() => {
        // Check for authentication
        const isAuthenticated = !!localStorage.getItem("jwtAdminToken");
        if (!isAuthenticated) {
            // If not authenticated, redirect to the login page
            navigate("/adminlogin");
        }
    }, [navigate]);

    const isTokenExpired = () => {
        const tokenData = JSON.parse(localStorage.getItem("jwtAdminToken"));
        const expiration = tokenData?.expiration || 0;
        return new Date().getTime() > expiration;
    };

    const removeTokenFromLocalStorage = () => {
        localStorage.removeItem("jwtAdminToken");
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

    const handleLogout = () => {
        localStorage.removeItem("jwtAdminToken");
        navigate("/adminlogin");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form data before submitting
        const formErrors = {};
        const hasError = false
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

        if (!hasError) {
            setValues(initialFormState)
            setMessage("SuccessFully Added the Manifest")
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


    const navigateUser = () => {
        navigate("/admin/user");
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1>Admin</h1>

                </div>
                <div>
                    <button onClick={navigateUser}>User</button>

                </div>
                <div className="adminloginbutton">
                    <button className="adminlogout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="taskformcontainers">
                <ul>
                    <button style={{ backgroundColor: "Green" }} >Task Completed</button>
                    <button style={{ backgroundColor: "Yellow" }} >Task Needs Improvement</button>
                    <button style={{ backgroundColor: "Orange" }} >Task Critical</button>
                    <button style={{ backgroundColor: "Red" }} >Task Not Completed</button>
                    <button style={{ backgroundColor: "SkyBlue" }} >Week Repeat</button>
                </ul>
                <div className="manifestform-container">
                    <div>
                        <h4 className="manifestemaildiv">Manifest of {manifestemail}</h4>
                        <button className="currentweek">Current Week :-:  {manifestcurrentweek}</button>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                       
                        <input
                            type="text"
                            name="week"
                            value={values.week}
                            onChange={handleChange}
                            placeholder="Week"
                        />
                        {errors.week && <span className="error">{errors.week}</span>}

                        <input
                            type="text"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}

                        <input
                            type="text"
                            name="developername"
                            value={values.developername}
                            onChange={handleChange}
                            placeholder="Developer Name"
                        />
                        {errors.developername && <span className="error">{errors.developername}</span>}

                        <input
                            type="text"
                            name="advisorname"
                            value={values.advisorname}
                            onChange={handleChange}
                            placeholder="Advisor Name"
                        />
                        {errors.advisorname && <span className="error">{errors.advisorname}</span>}

                        <input
                            type="text"
                            name="reviewername"
                            value={values.reviewername}
                            onChange={handleChange}
                            placeholder="Reviewer Name"
                        />
                        {/* Add error handling for reviewername if needed */}

                        <input
                            type="text"
                            name="color"
                            value={values.color}
                            onChange={handleChange}
                            placeholder="Color"
                        />
                        {/* Add error handling for color if needed */}

                        <textarea
                            name="nextweektask"
                            value={values.nextweektask}
                            onChange={handleChange}
                            placeholder="Next Week's Task"
                            rows="5"
                        />
                        {/* Add error handling for nextweektask if needed */}

                        <textarea
                            name="improvementupdate"
                            value={values.improvementupdate}
                            onChange={handleChange}
                            placeholder="Improvement Update"
                            rows="4"
                        />
                        {/* Add error handling for improvementupdate if needed */}

                        <input
                            type="text"
                            name="code"
                            value={values.code}
                            onChange={handleChange}
                            placeholder="Code"
                        />
                        {errors.code && <span className="error">{errors.code}</span>}

                        <input
                            type="text"
                            name="theory"
                            value={values.theory}
                            onChange={handleChange}
                            placeholder="Theory"
                        />
                        {errors.theory && <span className="error">{errors.theory}</span>}

                        <button type="submit">Submit</button>
                        <p>{message}</p>
                    </form>
                </div>
            </div>

            <div className="course-container">
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
