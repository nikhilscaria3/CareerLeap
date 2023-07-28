import React, { useEffect, useState } from "react";
import '../styles/registerpage.css';
import { Link } from "react-router-dom";
import { registerUser } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";




export function RegisterPage() {

    const initialErrors = {
        email: { required: false },
        password: { required: false },
        name: { required: false },
        custom_error: null,
    };

    const [initialdata] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState(initialErrors);
    const [inputs, setFormData] = useState({
        name: "",
        email: "",
        password: ""
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
                setMessage(errormessage)
                console.error('Registration Error:', error);
            }
        }

        setErrors(formErrors);
    };

    return (
        <section className="register-block" >
            <div className="container">
                <div className="row ">
                    <div className="col register-sec">
                        <h2 className="text-center">Register Now</h2>
                        <form onSubmit={handleSubmit} className="register-form" action="" >
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Name</label>

                                <input type="text" className="form-control" name="name" onChange={handleinputs} id="name" />
                                {errors.name.required ? (<span className="text-danger" >
                                    Name is required.
                                </span>) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>

                                <input type="text" className="form-control" onChange={handleinputs} name="email" id="email" />
                                {errors.email.required ? (<span className="text-danger" >
                                    Email is required.
                                </span>) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                <input className="form-control" type="password" onChange={handleinputs} name="password" id="password" />
                                {errors.password.required ? (<span className="text-danger" >
                                    Password is required.
                                </span>) : null}
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btn btn-login float-right" value="Register" />
                            </div>
                            <div className="clearfix"></div>
                            <div className="form-group">
                                Already have account ? Please <Link to="/login">Login </Link>
                            </div>


                        </form>

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
