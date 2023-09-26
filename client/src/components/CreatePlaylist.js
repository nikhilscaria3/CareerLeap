import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import { removeLoggedInEmailFromCookie } from '../cookieUtils';

export function CreatePlaylists() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userEmailid = getLoggedInEmailFromCookie();
    const initialInputs = {
        category: '',
        link1: '',
        channel1: "",
        link2: '',
        channel2: ""
    };

    const [inputs, setInputs] = useState({ initialInputs });
    const [errors, setErrors] = useState({
        category: false,
        custom_error: null,
    });

    console.log(inputs);


    
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



    const handleinputs = (e) => {
        const { name, value } = e.target;
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = {
            category: false,
            custom_error: null,
        };

        if (inputs.category.trim() === '') {
            formErrors.category = true;
        }

        setErrors(formErrors);

        if (inputs) {
            try {
                const response = await fetch('/CreatePlaylist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputs),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }
                // Clear the form fields on successful submission
                setInputs({initialInputs});

            } catch (error) {
                console.error('Error saving playlist:', error);
                // You can handle the error here or show an error message to the user
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtAdminToken");
        removeLoggedInEmailFromCookie();
        navigate('/adminlogin')
    }


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
        <section className="login-block">
            <div className="container">
                <div className="row">
                    <div className="col login-sec">
                        <h2 className="text-center">Create Playlist Now</h2>
                        <form onSubmit={handleSubmit} className="login-form" action="">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Category</label>
                                <input type="text" className="form-control" name="category" onChange={handleinputs} placeholder="Category" />
                                {errors.category.required ? <span className="text-danger">Category is required.</span> : null}

                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase">Link1</label>
                                <input type="text" className="form-control" name="link1" onChange={handleinputs} placeholder="link1" />


                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Channel</label>
                                <input className="form-control" type="text" name="channel1" onChange={handleinputs} placeholder="Channel 1" />

                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">LInk2</label>
                                <input className="form-control" type="text" name="link2" onChange={handleinputs} placeholder="link2" />

                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">Channel</label>
                                <input className="form-control" type="text" name="channel2" onChange={handleinputs} placeholder="Channel 2" />

                            </div>
                            <input type='submit' ></input>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
}

