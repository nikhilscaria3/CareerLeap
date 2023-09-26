import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../styles/pdf.css'
import { useNavigate } from 'react-router-dom';
import careerleaplogo from '../views/careerleaplogo2.png';


const GetPdf = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [pdfs, setPdfs] = useState([]);

    const encodedData = localStorage.getItem("randomsession");

    // Step 2: Decode the data using Base64
    const decodedData = atob(encodedData);

    // Step 3: Extract the original loginUserData f const timestamp = decodedData.substring(0, 13); // Assuming the timestamp is 13 digits
    const jwtemail = decodedData.substring(13); // Extracting data after the timestamp



    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                const response = await axios.get('/api/pdf');
                setPdfs(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPdfs();
    }, []);


    const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

    // Function to handle PDF link click and set the selected PDF URL
    const handlePdfLinkClick = (event, pdfPath) => {
        event.preventDefault();
        setSelectedPdfUrl(`/${pdfPath}`);
    };



    const handlenavigate = () => {
        navigate('/profile')
    }

    const handlemessage = () => {
        navigate('/user/message', { state: { useremail: jwtemail } })
    }


    return (
        <div class="pdf-gallery-container">
            <nav className="navbar">
                <div className="navbrand">
                <img className="navlogo" src={careerleaplogo} alt="Form Logo" />
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
            <div class="pdf-gallery">
                <h1 class="pdf-gallery-title">PDF Gallery</h1>
                <ul class="pdf-list">
                    {pdfs.map((pdf) => (
                        <li key={pdf._id}>
                            <button class="pdf-button" onClick={(e) => handlePdfLinkClick(e, pdf.path)}>{pdf.title}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display selected PDF in iframe */}
            {selectedPdfUrl && (
                <div class="pdf-viewer">
                    <iframe src={selectedPdfUrl} class="pdf-iframe" title="PDF Viewer"></iframe>
                </div>
            )}
        </div>

    );
};

export default GetPdf;
