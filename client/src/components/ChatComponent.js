import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getLoggedInEmailFromCookie } from '../cookieUtils';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:3000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const email = location?.state.useremail;
  const userEmailid = getLoggedInEmailFromCookie();

  useEffect(() => {
    socket.on('privateMessage', (data) => {
    
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  
  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const response = await axios.get('/getrealtimessages', {
          params: { email: email }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserMessages();
  }, [email]);

  const sendPrivateMessage = () => {
    if (message.trim() !== '') {
      socket.emit('privateMessage', {
        senderEmail: userEmailid,
        recipientEmail: email,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderEmail === userEmailid ? 'sent' : 'received'}>
            <strong>{msg.senderEmail}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendPrivateMessage}>Send Private Message</button>
    </div>
  );
}

export default Chat;
