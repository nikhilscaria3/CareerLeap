import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotpassword.css'
import careerleaplogo from '../views/careerleaplogo2.png';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('requestOTP'); // Possible values: 'requestOTP', 'verifyOTP'
    const navigate = useNavigate()
    const handleRequestOTP = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/forgotuserpassword', { email });
            setMessage('OTP sent to your email. Please check your inbox.');
            setStep('verifyOTP');
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            console.error('Error:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/verifyotp', { email, otp, newPassword });
            setMessage('Password reset successful.');
            navigate('/login')
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1>CareerLeap</h1>
                </div>
            </nav>

            <div className="forgotpassword-container">
                <div className="heading-logo-container">
                    <img className="form-logo" src={careerleaplogo} alt="Form Logo" />
                    <h2 className="form-heading">User Forgot Password</h2>

                </div>
                {step === 'requestOTP' && (
                    <form className="request-otp-form" onSubmit={handleRequestOTP}>
                        <div className="inputContainer">
                            <label className="input-label">Email:</label>
                            <input
                                className="input-field"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button className="submit-button" type="submit">
                                Request OTP
                            </button>
                        </div>
                        {message && <p className="error-message">{message}</p>}
                    </form>
                )}

                {step === 'verifyOTP' && (
                    <form className="verify-otp-form" onSubmit={handleResetPassword}>
                        <div className="input-container">
                            <label className="input-label">OTP:</label>
                            <input
                                className="input-field"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="input-label">New Password:</label>
                            <input
                                className="input-field"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button className="submit-button" type="submit">
                                Reset Password
                            </button>
                        </div>
                        {message && <p className="error-message">{message}</p>}
                    </form>
                )}
            </div>
        </div>

    );
};

export default ForgotPassword;
