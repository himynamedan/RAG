import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { slide as Menu } from 'react-burger-menu';
import { useNavigate } from 'react-router-dom';
import './credentials.css';

function Credentials() {
    const navigate = useNavigate();

    // State for form inputs
    const [neo4jCredentials, setNeo4jCredentials] = useState({ username: '', password: '', boltUrl: '' });
    const [apiKey, setApiKey] = useState('');
    const [websiteLink, setWebsiteLink] = useState('');
    const [message, setMessage] = useState('');
    const [responseText, setResponseText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    const handleNeo4jChange = (e) => {
        const { id, value } = e.target;
        setNeo4jCredentials(prevState => ({ ...prevState, [id]: value }));
    };

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
    };

    const handleWebsiteLinkChange = (e) => {
        setWebsiteLink(e.target.value);
    };

    const handleSubmit = async (e, formType) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let response;
            if (formType === 'neo4j' || formType === 'api') {
                setMessage('Credentials saved successfully.');
            } else if (formType === 'web') {
                response = await fetch('http://localhost:5000/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: websiteLink,
                        username: neo4jCredentials.username,
                        password: neo4jCredentials.password,
                        url: neo4jCredentials.boltUrl,
                        apiKey: apiKey
                    }),
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${text}`);
                }

                const data = await response.json();
                setMessage(data.message);
                setResponseText(data.text || '');
            } else {
                setMessage('Please fill out the required fields.');
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error('Error processing request:', error);
            setMessage('Neo4j Database not found :(');
            setResponseText('');
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
                <a className="menu-item" href="/uploadpdf">Clear Knowledge Graph</a>
                <a className="menu-item" onClick={handleLogout} style={{ color: 'red' }}>Sign Out</a>
            </Menu>

            <center><h2 className="main-heading-text">Credentials with Web Scraping</h2></center>

            <div className='forms'>
                <form className='neo4j' onSubmit={(e) => handleSubmit(e, 'neo4j')}>
                    <h3>Neo4j Credentials</h3>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={neo4jCredentials.username}
                            onChange={handleNeo4jChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={neo4jCredentials.password}
                            onChange={handleNeo4jChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="boltUrl">Bolt-URL:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="boltUrl"
                            value={neo4jCredentials.boltUrl}
                            onChange={handleNeo4jChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Neo4j Credentials</button>
                </form>
                <form className='api' onSubmit={(e) => handleSubmit(e, 'api')}>
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
                    <button type="submit" className="btn btn-primary">Save API Key</button>
                </form>
            </div>

            <center><h2 className="main-heading-text">Web Scraping</h2></center>

            <div className="main-heading1">
                <div className="box">
                    <center>
                        <p className="next-heading-smalltext">
                            Welcome to the Web Scraping section of the Admin panel. Here, you can input the link to any website you wish to scrape for data. This data will then be processed and used to create a Neo4j graph, enabling you to visualize and analyze the relationships and connections within the data.
                        </p>
                    </center>
                </div>
            </div>
            <div className='web'>
                <form className='api' onSubmit={(e) => handleSubmit(e, 'web')}>
                    <h3>Scrape the Web</h3>
                    <div className="form-group">
                        <label htmlFor="websiteLink">Enter Website/Web page link:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="websiteLink"
                            value={websiteLink}
                            onChange={handleWebsiteLinkChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Web Scrape'}
                    </button>
                </form>
            </div>

            <p>{message}</p>
            {responseText && (
                <div>
                    <h2>Response Content</h2>
                    <pre>{responseText}</pre>
                </div>
            )}
        </div>
    );
}

export default Credentials;
