import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/realtimechat.css'
const socket = io('http://localhost:3000');

function ReceiverChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [admins, setAdmins] = useState([]); // Store admin emails here
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const location = useLocation();
  const encodedData = localStorage.getItem('randomsession');
  const decodedData = atob(encodedData);
  const jwtemail = decodedData.substring(13);

  useEffect(() => {
    socket.on('privateMessage', (data) => {
     
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const response = await axios.get('/getrealreceivertimessages', {
          params: { email: jwtemail }
        });
        setMessages(response.data);

        // Get unique admin emails from messages
        const uniqueAdmins = Array.from(new Set(response.data.map(msg => msg.senderEmail)));
        setAdmins(uniqueAdmins);
        setSelectedAdmin(uniqueAdmins[0]); // Set the selected admin to the first admin in the list
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserMessages();
  }, [jwtemail]);

  
  useEffect(() => {
    const fetchSelectedAdminMessages = async () => {
      try {
        const response = await axios.get('/getselectedadminmessages', {
          params: { email: selectedAdmin }
        });
        // Merge the new admin messages with the existing messages
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };

    fetchSelectedAdminMessages();
  }, [selectedAdmin]);



  const handleAdminButtonClick = (admin) => {
    setSelectedAdmin(admin);
  };

  const adminMessages = messages.filter(msg => msg.senderEmail === selectedAdmin);

  const sendPrivateMessage = () => {
    if (message.trim() !== '' && selectedAdmin) {
      socket.emit('privateMessage', {
        senderEmail: jwtemail,
        recipientEmail: selectedAdmin,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div className="receiver-chat-container">

      <div className="admin-buttons">
        <strong>Admins:</strong>
        <ul className='admineachbutton'>
          {admins.map((admin) => (
            <li key={admin}>
              <button className='adminmessagebutton' onClick={() => handleAdminButtonClick(admin)}>{admin}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className='realtimemessage-container'>
        <div className="message-display">
          {messages.map((msg, index) => (
            <div key={index} className={msg.senderEmail === jwtemail ? 'sent' : 'received'}>
              <strong>{msg.senderEmail}:<p>{msg.message}</p></strong>
              <div className='timestampcontainer'>
              <p className='timestamp'>{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendPrivateMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ReceiverChat;
