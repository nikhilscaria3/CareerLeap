import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/pdf.css'
import { useNavigate } from 'react-router-dom';

const PDFUploader = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file || !title) {
            alert('Please provide both a title and select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('pdf', file);

        try {
            await axios.post('/api/pdf/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('PDF uploaded successfully.');
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF.');
        }
    };


    const [pdfs, setPdfs] = useState([]);

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

    const handleLogout = () => {
        localStorage.removeItem("jwtAdminToken");
        navigate('/adminlogin')
    }
    const navigateUser = () => {
        navigate("/admin/user")
    }

    const navigatecreateplaylist = () => {
        navigate("/createplaylist")
    }

    const navigatecreatepdf = () => {
        navigate("/createpdf")
    }


    return (
        <div>
            <nav className="navbar">
                <div className="navbrand">
                    <h1>Upload PDF</h1>

                </div>
                <div className="adminloginbutton">
                    <button onClick={navigateUser}>User</button>

                    <button onClick={navigatecreatepdf}>PDF</button>
                    <button onClick={navigatecreateplaylist}>Playlist</button>
                </div>
                <div className="adminloginbutton">
                    <button className="adminlogout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className='createpdf'>

                <form class="upload-form" onSubmit={handleSubmit}>
                    <div class="form-group">
                        <label class="form-label" htmlFor="title">Title:</label>
                        <input class="form-input" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div class="form-group">
                        <label class="form-label" htmlFor="pdf">PDF File:</label>
                        <input class="form-file-input" type="file" id="pdf" onChange={handleFileChange} />
                    </div>
                    <button class="form-submit-button" type="submit">Upload</button>
                </form>

            </div>
            <div>
                <h1>PDF Gallery</h1>
                <ul>
                    {pdfs.map((pdf) => (
                        <li key={pdf._id}>
                            <button onClick={(e) => handlePdfLinkClick(e, pdf.path)}>{pdf.title}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display selected PDF in iframe */}
            {selectedPdfUrl && (
                <div>
                    <h2>PDF Viewer</h2>
                    <iframe src={selectedPdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
                </div>
            )}

        </div>
    );
};

export default PDFUploader;
