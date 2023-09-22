import React, { useState } from 'react';
import * as Babel from '@babel/standalone';
import '../styles/jscompiler.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCode, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from 'react-router-dom';
import careerleaplogo from '../views/careerleaplogo2.png';



function JSCompiler() {
    const [code, setCode] = useState('console.log("Hello, World!");');
    const [output, setOutput] = useState('');
    const navigate = useNavigate();
    function captureConsoleLog() {
        var logs = [];
        var originalConsoleLog = console.log;
        console.log = function (...args) {
            logs.push(args.map(arg => JSON.stringify(arg)).join(' '));
        };
        return {
            logs,
            restore: function () {
                console.log = originalConsoleLog;
            }
        };
    }

    function runCode() {
        var logCapture = captureConsoleLog();
        try {
            const transpiledCode = Babel.transform(code, {
                presets: ['env'],
            }).code;

            const result = eval(transpiledCode);
            logCapture.restore();

            var outputString = logCapture.logs.join('\n');
            setOutput(outputString);
        } catch (error) {
            logCapture.restore();
            setOutput('Error: ' + error.message);
        }
    }



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

    const handlepythonnavigate = () => {
        navigate('/PythonCompiler')
    }


    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <img className="navlogo" src={careerleaplogo} alt="Form Logo" />

                </div>
                <div>
                    <button onClick={handlepythonnavigate}>
                        Python <FontAwesomeIcon icon={faCode} />
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
                    <div className="code-editor-header">JavaScript Code</div>

                    <div className="code-editor">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                            placeholder="Enter your JavaScript code here..."
                        ></textarea>
                        <button onClick={runCode}>Run Code</button>
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

export default JSCompiler;
