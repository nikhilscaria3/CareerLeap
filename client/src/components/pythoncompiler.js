import React, { useState } from 'react';
import axios from 'axios';
import '../styles/jscompiler.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCode, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from 'react-router-dom';
import careerleaplogo from '../views/careerleaplogo2.png';


const defaultPythonCode = `# Welcome to the Python Compiler!
print("Hello from Python")`;

function PythonCompiler() {
    const [pythonCode, setPythonCode] = useState(defaultPythonCode);
    const [output, setOutput] = useState('');
    const navigate = useNavigate();
    const executePythonCode = async () => {
        try {
            console.log('Executing Python code:', pythonCode);

            const response = await axios.post('/execute-python', { code: pythonCode });

            console.log('Server response:', response.data);

            setOutput(response.data.stdout || response.data.stderr);
        } catch (error) {
            console.error('Error executing Python code:', error);
        }
    };

    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp



    const handlenavigate = () => {
        navigate('/profile')
    }
    const handlemessage = () => {
        navigate('/user/message', { state: { useremail: jwtemail } })
    }

    const handlejsnavigate = () => {
navigate('/jscompiler')
    }

    return (

        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <img className="navlogo" src={careerleaplogo} alt="Form Logo" />

                </div>
                <div>
                    <button onClick={handlejsnavigate}>
                        JS <FontAwesomeIcon icon={faCode} />
                    </button>
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

            <div className="js-compiler-container">
                <div className="code-editor-container">
                    <div className="code-editor-header">Python Code</div>
                    <div className="code-editor">
                        <textarea
                            placeholder="Enter your Python code here..."
                            value={pythonCode}
                            onChange={(e) => setPythonCode(e.target.value)}
                        />
                        <button onClick={executePythonCode}>Run Code</button>
                    </div>
                </div>
                <div className="output-container">
                    <div className="output-header">Output</div>
                    <div className="output">
                        <pre>{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PythonCompiler;
