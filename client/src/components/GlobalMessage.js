import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import io from 'socket.io-client';
import axios from 'axios';

import '../styles/ChatComponent.css'; // Import the separate CSS file

const ENDPOINT = 'http://localhost:5000';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [socket, setSocket] = useState(null);
    const userData = localStorage.getItem("username");
    const { roomId } = useParams();
    const messagesContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const socketInstance = io(ENDPOINT);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to server');
        });

        socketInstance.on('chat message', (message) => {
            console.log('Received message:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            console.log('Disconnecting socket');
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (messageContent.trim() !== '') {
            const messageObject = {
                content: messageContent,
                user: userData,
                roomId: roomId,
            };

            socket.emit('chat message', messageObject);
            setMessageContent('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("name");
        navigate("/");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/messages");
                const data = response.data;
                if (data) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error('Error retrieving messages:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 className="user-header">{userData}</h1>
            <div className='chatArea-container'>
     
                <div className='messages-container' ref={messagesContainerRef}>
                    {messages.slice(0).reverse().map((message, index) => (
                        <div key={index} className="message">
                            <strong>{message.user}:</strong> {message.content}
                            <p className='timestamp'>{new Date(message.createdAt).toLocaleDateString()} {new Date(message.createdAt).toLocaleTimeString()}</p>
                        </div>
                    ))}
                </div>

                <div className='text-input-area'>
                    <input
                        className="form-control"
                        placeholder='Type a Message'
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.code === 'Enter') {
                                sendMessage();
                            }
                        }}
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
