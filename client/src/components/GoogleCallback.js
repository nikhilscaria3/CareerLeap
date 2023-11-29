import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        // Make an API request to your backend to handle Google OAuth2 callback
        const response = await axios.get('/auth/google/callback'); // Adjust the URL as needed

        if (response.data.success) {
          // Assuming you've stored the JWT token in local storage
          localStorage.setItem('jwtToken', response.data.token);
          localStorage.setItem("username", response.data.username)
          // Redirect to the desired route (e.g., profile)
          navigate('/profile');
        } else {
          // Handle failure cases if needed
          console.error('Google callback failed:', response.data.message);
        }
      } catch (error) {
        console.error('An error occurred during Google callback:', error);
      }
    }

    handleGoogleCallback(); // Call the function to handle the callback
  }, [navigate]);

  return (
    <div>
      <h1>Google Callback</h1>
      {/* You can show a loading message or any content you want */}
    </div>
  );
};

export default GoogleCallback;
