import { useEffect, useState } from 'react';
import '../styles/loginpage.css';
import { LoginUser } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import careerleaplogo from '../views/careerleaplogo2.png';
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google';

export function LoginPage() {
    const initialErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null,
    };

    const [isAuthenticated, setisAuthenticated] = useState(true)
    const [errors, setErrors] = useState(initialErrors);
    const [otpform, setOtpformVisible] = useState(false);
    const [googleAccessToken, setAccessToken] = useState(null);
    const [inputs, setFormData] = useState({
        email: "",
        password: ""
    });


    const [otp, setOtp] = useState('');
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };


    const dispatch = useDispatch();

    const user = useSelector((state) => state.loginUser.loginUser); // Update this line

    useEffect(() => {
        console.log("user", user);
    }, [user]); // Add 'user' to the dependency array

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



    const handleinputs = (e) => {
        const { name, value } = e.target;
        console.log("Updating state:", name, value);
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = initialErrors;
        let hasError = false;

        if (inputs.email === '') {
            formErrors.email.required = true;
            hasError = true;
        }
        if (inputs.password === '') {
            formErrors.password.required = true;
            hasError = true;
        }

        if (!hasError) {
            try {
                // Dispatch the loginUser action with the form data
                const userData = await dispatch(LoginUser(inputs));

                if (userData && userData.success) {
                    // Clear the form fields on successful login
                    setFormData({ email: '', password: '' });
                    setOtpformVisible(true)
                    console.log("users", userData.success);
                    // This will prevent the back button from going back to the login page
                    navigate('/loginotp', { state: { data: userData }, replace: true });
                }

                // Wait for the dispatch Promise to resolve before navigating
            } catch (error) {
                setFormData({ email: '', password: '' }); // Clear the form fields on login failure
                console.error('Login Error:', error);
            }
        }


        setErrors(formErrors); // Move this line inside the if (!hasError) block
    };

    const initialState = {

        setisAuthenticated: localStorage.getItem('jwtLoginToken'),

    };


    async function handleGoogleLoginSuccess(tokenResponse) {
        const accessToken = tokenResponse.access_token;
        console.log(accessToken);
        setAccessToken(accessToken);

        try {
            const response = await fetch("/GoogleLogin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken })
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                const loginUserData = responseData.data; // Replace this with your actual data
                const timestamp = Date.now();
                const emailIdWithTimestamp = timestamp + loginUserData;

                // Step 2: Encode the combined data using Base64
                const encodedData = btoa(emailIdWithTimestamp);

                const expiration = Date.now() + 3 * 60 * 60 * 1000;
                localStorage.setItem('jwtLoginToken', JSON.stringify({ token, expiration }));
                localStorage.setItem('randomsession', encodedData);
                // Pseudo code for checking authentication state
                const tokenData = JSON.parse(localStorage.getItem('jwtLoginToken'));

                if (tokenData && tokenData.token && tokenData.expiration > Date.now()) {
                    // User is authenticated, render profile page

                    navigate('/profile')
                } else {
                    navigate('/login')
                }

            } else {
                console.log('Request failed:', response.statusText);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }


    const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });





    return (
        <section className="login-block">
            <div className="container">
                <div className="row">
                    <div className="col login-sec">
                        <img className="form-login-logo" src={careerleaplogo} alt="Form Logo" />
                        <h2 className="text-center">Login Now</h2>
                        <form className="login-form" action="">
                            <div className="inputContainer">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                <input type="email" className="form-control" name="email" onChange={handleinputs} placeholder="email" />
                                {errors.email.required ? <span className="text-danger">Email is required.</span> : null}

                            </div>
                            <div className="inputContainer">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                <input className="form-control" type="password" name="password" onChange={handleinputs} placeholder="password" />
                                {errors.password.required ? <span className="text-danger">Password is required.</span> : null}
                            </div>
                            <div className="forgetmeContainer">
                                <div>
                                    Remember Me <input type="checkbox" />
                                </div>
                                <div>
                                    <Link to="/userforgotpassword">Forgot password?</Link>
                                </div>
                            </div>

                        </form>
                        <div className="clearfix">
                            {user && user.message && <p>{user.message}</p>}
                            {user && user.error && <p>{user.error}</p>}

                            {user && user.loginUser && user.loginUser.data ? (
                                <p>{user.loginUser.data}</p>
                            ) : (
                                <p></p>
                            )}

                            <div  >

                                {message && (
                                    <div className="message">
                                        <p>{message}</p>
                                    </div>
                                )}

                            </div>

                        </div>

                        <button onClick={handleSubmit} className="loginBTN">LOGIN</button>
                        <span className="or">or</span>
                        <button onClick={login} className="googleBTN">
                            <i className="fa-brands fa-google"></i>  Sign in with Google</button>

                        <span className="notreg">Not registered yet?  <Link className="singupBTN" to="/register">Signup</Link></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
