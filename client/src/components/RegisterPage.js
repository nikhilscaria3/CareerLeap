import React, { useEffect, useState } from "react";
import '../styles/registerpage.css';
import { Link } from "react-router-dom";
import { registerUser } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import careerleaplogo from '../views/careerleaplogo2.png';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'


export function RegisterPage() {

    const initialErrors = {
        email: { required: false },
        password: { required: false },
        confirmpassword: { required: false },
        name: { required: false },
        custom_error: null,
    };

    const [initialdata] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const [errors, setErrors] = useState(initialErrors);
  
    const [inputs, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const [message, setMessage] = useState(null)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const error = useSelector((state) => state.user.error);


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
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = initialErrors;
        let hasError = false;

        if (inputs.name === '') {
            formErrors.name.required = true;
            hasError = true;
        }
        if (inputs.email === '') {
            formErrors.email.required = true;
            hasError = true;
        }
        if (inputs.password === '') {
            formErrors.password.required = true;
            hasError = true;
        }
        if (inputs.password!== inputs.confirmpassword) {
            formErrors.password.required = true;
            hasError = true;
        }

        if (!hasError) {

            const usermessage = user.message
            const errormessage = user.error
            try {
                await dispatch(registerUser(inputs));
                // Clear the form fields on successful registration
                setFormData({ initialdata }); // Update this line
                setMessage(usermessage)
                console.log(usermessage);
                // setMessage("Registered Successfully!")
            } catch (error) {
                // Handle registration error
                setFormData({ initialdata }); // Update this line
                setMessage(errormessage)
                console.error('Registration Error:', error);
            }
        }

        setErrors(formErrors);
    };


    async function handleGoogleLoginSuccess(tokenResponse) {
        const accessToken = tokenResponse.access_token;
        console.log(accessToken);

        try {
            const response = await fetch("http://localhost:5000/GoogleRegister", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken })
            });

            if (response.ok) {
             
            } else {
                console.log('Request failed:', response.statusText);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }


    const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });




    return (
        
        <section className="register-block" >
            <div className="container">
                <div className="row ">
                    <div className="col register-sec">
                        <img className="form-register-logo" src={careerleaplogo} alt="Form Logo" />
                        <h2 className="text-center">Register Now</h2>
                        <form className="register-form" action="" >
                            <div className="inputContainer">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Name</label>

                                <input type="text" className="form-control" name="name" onChange={handleinputs} id="name" />
                                {errors.name.required ? (<span className="text-danger" >
                                    Name is required.
                                </span>) : null}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>

                                <input type="text" className="form-control" onChange={handleinputs} name="email" id="email" />
                                {errors.email.required ? (<span className="text-danger" >
                                    Email is required.
                                </span>) : null}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                <input className="form-control" type="password" onChange={handleinputs} name="password" id="password" />
                                {errors.password.required ? (<span className="text-danger" >
                                    Password is required.
                                </span>) : null}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Confirm Password</label>
                                <input className="form-control" type="password" onChange={handleinputs} name="confirmpassword" id="confirmpassword" />
                                {errors.password.required ? (<span className="text-danger" >
                                    Password is not match.
                                </span>) : null}
                            </div>

                            <div className="footerContainer">
                                <div>
                                    Already Signed Up? <Link to="/login">Login</Link>
                                </div>
                                <div>
                                    <Link to="/userforgotpassword">Forgot Password?</Link>
                                </div>
                            </div>


                        </form>

                        <div className="form-group">
                            <button onClick={handleSubmit} className="loginBTN">REGISTER</button>
                            <span className="or">or</span>
                            <button onClick={() => login()} className="googleBTN">
                                <i class="fa-brands fa-google"></i>  Sign up with google</button>
                        </div>
                        <div  >

                            {message && (
                                <div className="message">
                                    <p>{message}</p>
                                </div>
                            )}

                        </div>

                    </div>

                </div>


                {error && <p>Error: {error}</p>}
            </div >
        </section >

    )
}
