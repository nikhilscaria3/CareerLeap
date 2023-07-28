import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function CreatePlaylists(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialInputs = {
        category: '',
        link1: '',
        link2: ''
    };

    const [inputs, setInputs] = useState({initialInputs});
    const [errors, setErrors] = useState({
        category: false,
        custom_error: null,
    });

    console.log(inputs);

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
                const response = await fetch('http://localhost:5000/CreatePlaylist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputs),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }
                // Clear the form fields on successful submission
                setInputs(initialInputs);

            } catch (error) {
                console.error('Error saving playlist:', error);
                // You can handle the error here or show an error message to the user
            }
        }
    };
    
    return (
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
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">LInk2</label>
                                <input className="form-control" type="text" name="link2" onChange={handleinputs} placeholder="link2" />

                            </div>
                            <input type='submit' ></input>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

