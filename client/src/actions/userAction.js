// redux/actions.js
import { setLoggedInEmailInCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import api from '../utils/api'

// Action type constants
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';

// Action creator for registering a user
export const registerUser = (userData) => {
    return async (dispatch) => {
        try {
            // Make an API call to register the user
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const user = await response.json();
            const message = user.message
            console.log(user);
            console.log(message);
            dispatch({ type: REGISTER_SUCCESS, payload: user, message: message });
        } catch (error) {
            // Handle registration error, if any
            // Dispatch the REGISTER_ERROR action with the error message as payload
            dispatch({ type: REGISTER_ERROR, payload: 'Failed to register user' });
        }
    };
};


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const LoginUser = (userData,) => {
    return async (dispatch) => {
        try {
            // Make an API call to log in the user
            const response = await fetch('http://localhost:5000/loginUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const loginUser = await response.json();
            console.log("email"
                , loginUser.data);

            console.log(loginUser.message);
            // If the response status is 200, the user is successfully logged in
            dispatch({ type: LOGIN_SUCCESS, payload: loginUser, message: loginUser.message });

            return loginUser; // Return the loginUser data after successful login

        } catch (error) {
            // Handle login error, if any
            dispatch({ type: LOGIN_ERROR, payload: 'Failed to Login -  Check Password or Email' });

        }
    };
};


export const ADMINLOGIN_SUCCESS = 'ADMINLOGIN_SUCCESS';
export const ADMINLOGIN_ERROR = 'ADMINLOGIN_ERROR';

export const AdminLoginUser = (userData,) => {
    return async (dispatch) => {
        try {
            // Make an API call to log in the user
            const response = await fetch('http://localhost:5000/adminloginUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const adminloginuser = await response.json();
            console.log("email"
                , adminloginuser.data);

            console.log(adminloginuser.token);

            if (response.ok) {
                // If the response status is 200, the user is successfully logged in
                dispatch({ type: ADMINLOGIN_SUCCESS, payload: adminloginuser, message: adminloginuser.message, adminemail: adminloginuser.data });
                const { token, data } = adminloginuser;
                setLoggedInEmailInCookie(data)
                // Store the token in localStorage
                const expiration = Date.now() + 3 * 60 * 60 * 1000;
                localStorage.setItem('jwtAdminToken', JSON.stringify({ token, expiration }));
                return adminloginuser; // Return the loginUser data after successful login
            } else {
                // If the response status is not 200, there was an error during login
                dispatch({ type: ADMINLOGIN_ERROR, payload: adminloginuser.error });
                throw new Error(adminloginuser.error); // Throw an error for handling login failure
            }
        } catch (error) {
            console.log(error);            // Handle login error, if any
            dispatch({ type: LOGIN_ERROR, payload: 'Failed to login admin' });
        }
    };
};


export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
export const PROFILE_ERROR = 'PROFILE_ERROR';

export const profileImage = (imageData) => {
    return async (dispatch) => {
        try {
            // Make an API call to upload the profile image
            const response = await fetch('http://localhost:5000/profileimage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(imageData), // Pass the FormData object directly as the request body

            });

            console.log("image", imageData);
            const profileimage = await response.json();

            if (response.ok) {
                // If the response status is 200, the profile image is uploaded successfully
                dispatch({ type: PROFILE_SUCCESS, payload: profileimage, message: profileimage.message });
                return profileimage;
            } else {
                // If the response status is not 200, there was an error during the image upload
                dispatch({ type: PROFILE_ERROR, payload: profileimage.error });
                throw new Error(profileimage.error); // Throw an error for handling image upload failure
            }
        } catch (error) {
            console.log(error);// Handle image upload error, if any
            dispatch({ type: PROFILE_ERROR, payload: 'Failed to upload profile image' });
        }
    };
};



export const COURSE_SUCCESS = 'COURSE_SUCCESS';
export const COURSE_ERROR = 'COURSE_ERROR';

export const addCourseData = (coursedata) => {
    return async (dispatch) => {
        try {
            // Make an API call to upload the profile image
            const response = await fetch('http://localhost:5000/api/courseadd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coursedata), // Pass the FormData object directly as the request body

            });

            console.log("image", coursedata);
            const courseadd = await response.json();

            if (response.ok) {
                // If the response status is 200, the profile image is uploaded successfully
                dispatch({ type: COURSE_SUCCESS, payload: courseadd, message: courseadd.message });
                return courseadd;
            } else {
                // If the response status is not 200, there was an error during the image upload
                dispatch({ type: COURSE_ERROR, payload: courseadd.error });
                throw new Error(courseadd.error); // Throw an error for handling image upload failure
            }
        } catch (error) {
            console.log(error);// Handle image upload error, if any
            dispatch({ type: COURSE_ERROR, payload: 'Failed to upload product ' });
        }
    };
};



export const MANIFEST_SUCCESS = 'MANIFEST_SUCCESS';
export const MANIFEST_ERROR = 'MANIFEST_ERROR';

export const addManifestData = (manifestdata) => {
    return async (dispatch) => {
        try {
            // Make an API call to upload the profile image
            const response = await fetch('http://localhost:5000/api/manifestadd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(manifestdata), // Pass the FormData object directly as the request body

            });

            console.log("image", manifestdata);
            const manifestadd = await response.json();

            if (response.ok) {
                // If the response status is 200, the profile image is uploaded successfully
                dispatch({ type: MANIFEST_SUCCESS, payload: manifestadd, message: manifestadd.message });
                return manifestadd;
            } else {
                // If the response status is not 200, there was an error during the image upload
                dispatch({ type: MANIFEST_ERROR, payload: manifestadd.error });
                throw new Error(manifestadd.error); // Throw an error for handling image upload failure
            }
        } catch (error) {
            console.log(error);// Handle image upload error, if any
            dispatch({ type: MANIFEST_ERROR, payload: 'Failed to upload product ' });
        }
    };
};