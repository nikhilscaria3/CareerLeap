import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourseData } from "../actions/userAction"; // Import your Redux action here
import "../styles/adminpage.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import { removeLoggedInEmailFromCookie } from '../cookieUtils';
const initialFormState = {
    name: "",
    description: "",
    price: "",
    playlistapi: ""
};

export default function AdminPage() {
    const [values, setValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [courses, setCourses] = useState([]);
    const [editCourseId, setEditCourseId] = useState(null); // Add editCourseId state
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const data = useSelector((state) => state.courseadd);
    const userEmailid = getLoggedInEmailFromCookie();
  
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


    useEffect(() => {
        // Fetch data from the backend API
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/admin/courses", {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server.");
                }

                const data = await response.json();
                setCourses(data.course); // Update the state with the fetched courses
          
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCourses(); // Call the fetchCourses function to initiate the API request
    }, []);

    const handleDelete = async (courseId) => {
        try {
            // Send a DELETE request to the backend API
            await axios.delete(`http://localhost:5000/api/courses/${courseId}`);

            // After successful deletion, update the courses state to remove the deleted course
            setCourses((prevCourses) =>
                prevCourses.filter((course) => course._id !== courseId)
            );
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleUpdate = (courseId) => {
        setEditCourseId(courseId); // Set editCourseId to the courseId when clicking the "Update" button
        const courseToUpdate = courses.find((course) => course._id === courseId);
        setValues({
            name: courseToUpdate.name,
            description: courseToUpdate.description,
            price: courseToUpdate.price,
            playlistapi: courseToUpdate.playlistapi
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));

        // Clear the error message when the user starts typing again
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtAdminToken");
        removeLoggedInEmailFromCookie();
        navigate('/adminlogin')
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form data before submitting
        const formErrors = {};
        if (!values.name.trim()) {
            formErrors.name = "Product name is required";
        }
        if (!values.description.trim()) {
            formErrors.description = "Product description is required";
        }
        if (!values.price.trim()) {
            formErrors.price = "Product price is required";
        }
        if (!values.playlistapi.trim()) {
            formErrors.playlistapi = "Product Api is required";
        }

        if (Object.keys(formErrors).length > 0) {
            // If there are errors, set them in the state and prevent form submission
            setErrors(formErrors);
        } else {
            try {
                if (editCourseId) {
                    // If editCourseId is set, it means we are updating an existing course
                    await axios.put(
                        `/api/courses/${editCourseId}`,
                        values
                    );
                    setEditCourseId(null);
                    setValues(initialFormState); // Reset editCourseId to null after updating
                } else {
                    // Dispatch the action to add the course data to the backend server
                    await dispatch(addCourseData(values));
                }

                // After successful submission, fetch the updated course list from the backend API
                const response = await fetch("/api/courses", {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server.");
                }

                const data = await response.json();
                setCourses(data.course); // Update the state with the fetched courses
             
                // Clear the form fields after successful submission
                setValues(initialFormState);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    const navigateUser = () => {
        navigate("/admin/user", { state: { adminemail: userEmailid } })
    }

    const navigatecreateplaylist = () => {
        navigate("/createplaylist")
    }

    const navigatecreatepdf = () => {
        navigate("/createpdf")
    }

    const navigateFumigationUser = () => {
        navigate('/admin/fumigationuser')
    }
    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1>Admin</h1>
                </div>
                <div className="adminloginbutton">
                    <button onClick={navigateFumigationUser}>FumigationUser</button>
                    <button onClick={navigateUser}>BrotoUser</button>
                    <button onClick={navigatecreatepdf}>PDF</button>
                    <button onClick={navigatecreateplaylist}>Playlist</button>
                </div>
                <div className="adminloginbutton">

                    <button className="adminlogout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Course Name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    <input
                        type="text"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        placeholder="Course Description"
                    />
                    {errors.description && (
                        <span className="error">{errors.description}</span>
                    )}

                    <input
                        type="text"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        placeholder="Course Price"
                    />
                    {errors.price && (<span className="error">{errors.price}</span>)}

                    <input
                        type="text"
                        name="playlistapi"
                        value={values.playlistapi}
                        onChange={handleChange}
                        placeholder="Course Api"
                    />
                    {errors.playlistapi && <span className="error">{errors.playlistapi}</span>}


                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="course-container">
                <h1 className="courselist">Course List</h1>
                <div className="cards-container">
                    {courses.map((course) => (
                        <div key={course._id} className="card">
                            <h2 className="coursename">{course.name}</h2>
                            <p className="coursedescription">{course.description}</p>
                            <p className="courseprice">Rs.{course.price}</p>
                            <p>{course.playlistapi}</p>
                            <div className="buttons-container">
                                <button className="deletebutton" onClick={() => handleDelete(course._id)}>Delete</button>
                                <button className="updatebutton" onClick={() => handleUpdate(course._id)}>Update</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
