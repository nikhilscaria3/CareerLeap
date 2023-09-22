import axios from 'axios';

// Create a new Axios instance with your custom configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here
  },
});

export default instance;
