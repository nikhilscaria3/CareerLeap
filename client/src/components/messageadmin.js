import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/message.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure

export function Message() {
    const location = useLocation();
    const email = location?.state.useremail;

    const [isSending, setIsSending] = useState(false); // Track sending state
    const name = location?.state.username;
    const [recipientEmail, setRecipientEmail] = useState(email);
    const [message, setMessage] = useState(`Dear ${name},

  We regret to inform you that your recent fumigation round has not met the required standards for successful completion. Our team has conducted a thorough assessment, and it appears that certain criteria were not met during the process.
  
  Rest assured that we take this matter seriously and are committed to ensuring the safety and effectiveness of our fumigation procedures. To address this issue, we will promptly update our database with the relevant information. Our team is already working diligently to make the necessary adjustments, and you will be notified as soon as the database has been updated.
  
  In the meantime, we understand that you may have questions or concerns about the fumigation process and your results. Please do not hesitate to reach out to our customer support team, who will be more than happy to assist you and provide further clarification.
  
  We appreciate your cooperation and understanding as we strive to maintain the highest standards of safety and quality in our services. Your feedback is valuable to us, and we are committed to improving our processes to ensure a successful fumigation round in the future.
  
  Thank you for choosing Brototype for your fumigation needs. We look forward to serving you better in the future.
  
  Sincerely,
  Advisor
  `); // Set an initial hardcoded message
    const [responseMessage, setResponseMessage] = useState('');


    const userEmailid = getLoggedInEmailFromCookie();

    const handleSendMessage = async () => {
        setIsSending(true); // Set sending state to true when sending starts

        try {
            const response = await axios.post('http://localhost:5000/api/send-email', {
                recipientEmail,
                message, // Send the message state
            });
            setResponseMessage(response.data.message);
        } catch (error) {
            console.error('Error sending email:', error);
            setResponseMessage('Error sending email');
        } finally {
            setIsSending(false); // Set sending state to false once the response is received
        }
    };

    return (
        <div>
            <h1>Email Sender</h1>
            <input
                type="email"
                placeholder="Recipient Email"
                value={email}
                onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <textarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Allow users to change the message
            />
            <button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'}
            </button>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}
