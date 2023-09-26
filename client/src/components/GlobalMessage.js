import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../styles/message.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from "react-redux";
import { getLoggedInEmailFromCookie } from '../cookieUtils'; // Adjust the import path according to your folder structure
import { removeLoggedInEmailFromCookie } from '../cookieUtils';

export function GlobalMessage() {
    const [message, setMessage] = useState("");
    const [getmessage, setresponsemesssage] = useState([]);
    const userEmailid = getLoggedInEmailFromCookie();
    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp


    const [adminemail, setadminemail] = useState()

    const handlechangemessage = (event) => {
        // Extract the input value from the event object
        const inputValue = event.target.value;
        // Update the state using the functional update form
        setMessage(inputValue);
        setadminemail(localStorage.getItem("jwtAdminToken"))
    };

    const handlesendmessage = async () => {
        try {
            // Make sure to send the message inside an object with the appropriate key
            const response = await axios.post("/api/setglobalmessage", {
                message: message,
                email: jwtemail,
                adminemail: userEmailid
            });
            console.log(response.data);
            setMessage({ message: "" })
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        const handlegetmessage = async () => {
            try {
                // Make sure to send the message inside an object with the appropriate key
                const response = await axios.get(`/api/getglobalmessage`);
                console.log("response", response.data);
                setresponsemesssage(response.data.message)
            } catch (error) {
                console.error("Error sending message:", error);
            }
        };

        handlegetmessage()
    }, [])
    // ... (previous code)

    return (
        <div className="globalmessage-section">
            <div className='realtimemessage-global-container'>
                <div className="globalmessage-display">
                    {getmessage.map((msg, index) => (
                        <div key={index} className='received'>
                            <strong>{msg.to}:<p>{msg.message}</p></strong>
                            <div className='timestampcontainer'>
                                <p className='timestamp'>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="globalinput-area">
                <input
                    type="text"
                    value={message}
                    onChange={handlechangemessage}
                />
                <button className="globalmessagebutton" onClick={handlesendmessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />

                </button>
            </div>
        </div>
    );
};

