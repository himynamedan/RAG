import React, { useState } from 'react';
import './uploadpdf.css';
import 'bootstrap/dist/css/bootstrap.css';
import { slide as Menu } from 'react-burger-menu';
import { useNavigate } from 'react-router-dom';

function Uploadpdf() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [pdfText, setPdfText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [neo4jUsername, setNeo4jUsername] = useState('');
    const [neo4jPassword, setNeo4jPassword] = useState('');
    const [neo4jUrl, setNeo4jUrl] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleLogout = () => {
        navigate('/');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            if (file.size <= 10485760) { // 10 MB limit
                setSelectedFile(file);
                setMessage('');
            } else {
                setMessage('File size exceeds 10 MB limit.');
            }
        } else {
            setMessage('Please select a valid PDF file.');
        }
    };

    const handleUsernameChange = (event) => {
        setNeo4jUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setNeo4jPassword(event.target.value);
    };

    const handleUrlChange = (event) => {
        setNeo4jUrl(event.target.value);
    };

    const handleApiKeyChange = (event) => {
        setApiKey(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            let response;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);
                formData.append('username', neo4jUsername);
                formData.append('password', neo4jPassword);
                formData.append('url', neo4jUrl);
                formData.append('apiKey', apiKey);

                response = await fetch('http://localhost:5000/process', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${text}`);
                }

                const data = await response.json();
                setMessage(data.message);
                setPdfText(data.text || '');
            } else {
                setMessage('Please select a PDF file.');
            }
        } catch (error) {
            console.error('Error processing request:', error);
            setMessage(`An error occurred while processing the request: ${error.message}`);
            setPdfText('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="ellipse"></div>
            <div className="ellipse1"></div>
            <Menu width={'250px'} right={false}>
                <a className="menu-item" href="/credentials">Credentials with Web Scrape</a>
                <a className="menu-item" href="/uploadpdf">Credentials with PDF</a>
                <a className="menu-item">Clear Knowledge Graph</a>
                <a className="menu-item" onClick={handleLogout} style={{ color: 'red', cursor: 'pointer' }}>Sign Out</a>
            </Menu>
            <center><h2 className="main-heading-text">Credentials with PDF upload</h2></center>

            <div className='forms'>
                <form className='neo4j'>
                    <h3>Neo4j Credentials</h3>
                    <div className="form-group">
                        <label htmlFor="neo4jUsername">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="neo4jUsername"
                            value={neo4jUsername}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="neo4jPassword">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="neo4jPassword"
                            value={neo4jPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="neo4jBoltUrl">Bolt-URL:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="neo4jBoltUrl"
                            value={neo4jUrl}
                            onChange={handleUrlChange}
                            required
                        />
                    </div>
                </form>
                <form className='api'>
                    <h3>API Key</h3>
                    <div className="form-group">
                        <label htmlFor="apiKey">API Key:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="apiKey"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            required
                        />
                    </div>
                </form>
            </div>
            <center><h2 className="main-heading-text">Upload PDF</h2></center>
            <div className="main-heading1">
                <div className="box">
                    <center>
                        <p className="next-heading-smalltext">
                            Welcome to the PDF Upload section of the Admin panel. Here, you can upload a PDF document, and our system will extract the text from the document. This extracted text will then be processed to create a Neo4j graph, allowing you to visualize and analyze the relationships and connections within the data.
                        </p>
                    </center>
                </div>
            </div>
            <div className='pdf'>
                <form className='api' onSubmit={handleSubmit}>
                    <h3>Upload your PDF</h3>
                    <div className="form-group">
                        <label htmlFor="pdfFile">Select PDF file:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="pdfFile"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Submit'}
                    </button>
                </form>
            </div>

            <p>{message}</p>
            {pdfText && (
                <div>
                    <h2>Response Content</h2>
                    <pre>{pdfText}</pre>
                </div>
            )}
        </div>
    );
}

export default Uploadpdf;
