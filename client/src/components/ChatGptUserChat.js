import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const socket = io.connect('http://localhost:5000'); // Update with your server URL

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('sendMessage', { text: messageInput });
      setMessageInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default UserChat;
