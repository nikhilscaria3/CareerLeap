import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { useLocation, useNavigate } from 'react-router-dom';
import careerleaplogo from '../views/careerleaplogo2.png';
import '../styles/otppage.css';

const OTPForm = () => {
    const [otp, setOtp] = useState("");
    // Initialize OTP as an array of empty strings
    const [message, setMessage] = useState(null);
    const location = useLocation();
    const userData = location.state?.data;
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);

   
    const handleOtpChange = (index, newValue) => {
        const newOtp = [...otp.toString()];
        newOtp[index] = newValue.toString();
        setOtp(newOtp.join(""));
      };


    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds === 1) {
                    setResendEnabled(true);
                    clearInterval(interval); // Clear the interval when the countdown reaches 0
                }
                return prevSeconds - 1;
            });
        }, 1000);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            // Remove the event listener when component unmounts
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    const handleBeforeUnload = (e) => {
        // Display a custom message when user tries to leave the page
        e.preventDefault();
        e.returnValue = '';
    };

    const handleResend = async (e) => {
        e.preventDefault();

        try {
            // Implement your logic to resend OTP here
            const response = await axios.post('/resendotp', { email: userData.data });

            if (response.status === 200) {
                setSeconds(60); // Reset the timer to 60 seconds
                setResendEnabled(false); // Disable the "Resend OTP" button
                setMessage('New OTP sent. Please check your email.');
            } else {
                setMessage('Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            const otpVerificationResponse = await axios.post('/loginverifyotp', { email: userData.data, otp });


            if (otpVerificationResponse.data && otpVerificationResponse.data.success) {
                const { token } = otpVerificationResponse.data;
                // Store the token in localStorage
     
                const loginUserData = otpVerificationResponse.data.data; // Replace this with your actual data
                const timestamp = Date.now();
                const emailIdWithTimestamp = timestamp + loginUserData;

                // Step 2: Encode the combined data using Base64
                const encodedData = btoa(emailIdWithTimestamp);

                const expiration = Date.now() + 3 * 60 * 60 * 1000;
                localStorage.setItem('jwtLoginToken', JSON.stringify({ token, expiration }));
                localStorage.setItem('randomsession', encodedData);
                setMessage('OTP verification successful.');

                // Navigate to the profile page on successful OTP verification
                navigate('/profile', { state: { data: userData }, replace: true });
            } else {
                setMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };


    return (
        <section className="otp-block">
            <div className="otp-container">
                <div className="row">
                    <div className="col login-sec">
                        <img className="form-otp-logo" src={careerleaplogo} alt="Form Logo" />
                        <h2 className="text-center">Verify OTP</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputContainer">
                                <label htmlFor="exampleInputEmail1" className="text-uppercase"></label>
                                <input type="email" className="form-control" name="email" value={userData.data} disabled placeholder="email" />
                            </div>
                            <div className="inputContainer">
                               
                                <label htmlFor="exampleInputPassword1" className="text-uppercase">OTP</label>
                             
                                <HStack>
                                    <PinInput otp placeholder="">
                                        {[...Array(6)].map((_, index) => (
                                            <PinInputField
                                                key={index}
                                                onChange={(e) => handleOtpChange(index, parseInt(e.target.value))}
                                            />
                                        ))}
                                    </PinInput>
                                </HStack>

                            </div>





                            <button type="submit">Submit OTP</button>

                            <div>
                                {seconds > 0 ? (
                                    <p>{seconds} seconds remaining</p>
                                ) : (
                                    <p>Your OTP Expired! Resend the OTP </p>
                                )}

                            </div>
                        </form>

                        {resendEnabled && (
                            <button onClick={handleResend} disabled={!resendEnabled}>
                                Resend
                            </button>
                        )}
                        <div className="clearfix">
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OTPForm;
