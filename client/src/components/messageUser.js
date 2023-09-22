
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/message.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

export function UserMessage() {
    const [message, setMessage] = useState("");
    const [getmessage, setresponsemesssage] = useState([]);
    const [getresponseemail, setresponseemail] = useState([]);
    // State to keep track of the selected email
    const [selectedEmail, setSelectedEmail] = useState(null);
    const uniqueSenderEmails = Array.from(new Set(getresponseemail));
    const [selectedEmailMessages, setSelectedEmailMessages] = useState([]);
  
    // Function to handle email button click
    const handleEmailButtonClick = (fromEmail) => {
      // Filter messages that have the clicked email
      const messagesForEmail = getmessage.filter(
        (_, messageIndex) => getresponseemail[messageIndex] === fromEmail
      );
      setSelectedEmail(fromEmail);
      setSelectedEmailMessages(messagesForEmail);
    };

    const location = useLocation()
    const email = location?.state.useremail
    const name = location?.state.username

    const navigate = useNavigate();
    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp



    // const handlechangemessage = (event) => {
    //     // Extract the input value from the event object
    //     const inputValue = event.target.value;
    //     // Update the state using the functional update form
    //     setMessage(inputValue);
    // };

    // const handlesendmessage = async () => {
    //     try {
    //         // Make sure to send the message inside an object with the appropriate key
    //         const response = await axios.post("http://localhost:5000/api/setmessage", {
    //             message: message,
    //             email: email
    //         });
    //         console.log(response.data);
    //         setMessage({ message: "" })
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //     }
    // };

    useEffect(() => {
        const handlegetmessage = async () => {
            try {
                // Make sure to send the message inside an object with the appropriate key
                const response = await axios.get(`http://localhost:5000/api/getmessage/${email}`);
                console.log("response", response.data);
                setresponsemesssage(response.data.message)
                setresponseemail(response.data.fromemail)
            } catch (error) {
                console.error("Error sending message:", error);
            }
        };

        handlegetmessage()
    }, [])
    // ... (previous code)


    const handlenavigate = () => {
        navigate('/profile')
    }

    const handlemessage = () => {
        navigate('/user/message', { state: { useremail: jwtemail } })
    }



    return (

        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1 className="navbrand">Welcome to your Journey</h1>

                </div>
                <div className="adminloginbutton">
                    <button onClick={handlemessage}>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button onClick={handlenavigate}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                </div>
            </nav>
            <div>
                <h3>Received Chat</h3>
            </div>
            <div className="message-container">
                <div className="email-buttons-container">
                    {uniqueSenderEmails.map((fromEmail, index) => (
                        <button
                            key={index}
                            className={`email-button${selectedEmail === fromEmail ? " active" : ""}`}
                            onClick={() => handleEmailButtonClick(fromEmail)}
                        >
                            {fromEmail}
                        </button>
                    ))}
                </div>
                {selectedEmail && selectedEmailMessages.length > 0 ? (
                    <div className="message-bg">
                        {selectedEmailMessages.map((msg, messageIndex) => (
                            <div key={messageIndex}>
                                <p className="message">{messageIndex + 1}: {msg}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No messages found for the provided email.</p>
                )}
            </div>
            <div>{/* Display any message you want here */}</div>
        </div>
    );
};