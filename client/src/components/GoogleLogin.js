import React from 'react';
import axios from 'axios';

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    try {
      // Redirect to the backend route that handles Google OAuth2 flow
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Google Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default GoogleLogin;
