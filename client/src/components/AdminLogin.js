import { useEffect, useState } from 'react';
import '../styles/loginpage.css';
import { AdminLoginUser } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function AdminLoginPage() {
    const initialErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null,
    };

    const [errors, setErrors] = useState(initialErrors);
    const [inputs, setFormData] = useState({
        email: "",
        password: ""
    });

    const dispatch = useDispatch();
    const user = useSelector((state) => state.AdminLoginUser); // Update this line
    const users = useSelector((state) => state.adminloginuser.data); // Update this line
    console.log("adminuser", users);
    useEffect(() => {
        console.log("user", user);
    }, [user]); // Add 'user' to the dependency array


    const handleinputs = (e) => {
        const { name, value } = e.target;
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
                const userData = await dispatch(AdminLoginUser(inputs));

                // Clear the form fields on successful login (optional)
                setFormData({ email: '', password: '' });
                console.log("users", userData);
                // This will prevent the back button from going back to the login page
                navigate('/courseadd', { state: { data: userData.data }, replace: true });


                // Wait for the dispatch Promise to resolve before navigating
            } catch (error) {
                // Handle login error
                console.error('Login Error:', error);
            }
        }

        setErrors(formErrors); // Move this line inside the if (!hasError) block
    };

    return (
        <section className="adminlogin-block">
            <div className="login-container">
                <div className="row">
                    <div className="col login-sec">
                        <h2 className="text-center">Admin Login Now</h2>
                        <form onSubmit={handleSubmit} className="login-form" action="">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                <input type="email" className="form-control" name="email" onChange={handleinputs} placeholder="email" />
                                {errors.email.required ? <span className="text-danger">Email is required.</span> : null}

                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                <input className="form-control" type="password" name="password" onChange={handleinputs} placeholder="password" />
                                {errors.password.required ? <span className="text-danger">Password is required.</span> : null}
                            </div>
                            <input type='submit' ></input>
                        </form>
                        <div className="clearfix">
                            {user && user.message && <p>{user.message}</p>}
                            {user && user.error && <p>{user.error}</p>}

                            {user && user.loginUser && user.loginUser.data ? (
                                <p>{user.loginUser.data}</p>
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
