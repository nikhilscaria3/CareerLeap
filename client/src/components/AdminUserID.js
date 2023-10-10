import React, { useState } from 'react';
import "../styles/adminuserid.css";

function AdminUserID() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Here you can perform further actions like sending the data to an API
    // For this example, we'll just log the values to the console
 

    // Clear the form fields after submission
    setEmail('');
    setUserId('');
  };

  return (
    <div>
      <h1>Submit Form Example</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AdminUserID;
