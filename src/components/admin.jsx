import React, { useState } from 'react';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.css';
import { slide as Menu } from 'react-burger-menu';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    const handleClearKnowledgeGraph = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/clear-knowledge-graph', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log('Knowledge graph cleared successfully!');
            } else {
                console.error('Failed to clear knowledge graph');
            }
        } catch (error) {
            console.error('Error clearing knowledge graph:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Menu width={'250px'} right={false}>
                <a className="menu-item" href="/credentials">Credentials With Web Scrape</a>
                <a className="menu-item" href="/uploadpdf">Credentials with PDF</a>
                <a className="menu-item" onClick={handleClearKnowledgeGraph} style={{ color: 'red', cursor: 'pointer' }}>
                    {isLoading ? 'Clearing Knowledge Graph...' : 'Clear Knowledge Graph'}
                </a>
                <a className="menu-item" onClick={handleLogout} style={{ color: 'red', cursor: 'pointer' }}>Sign Out</a>
            </Menu>

            <div className="ellipse"></div>
            <div className="ellipse1"></div>

            <div className="main-heading">
                <div>
                    <center><h2 className="main-heading-text">Welcome Admin</h2></center>
                </div>
            </div>
        </div>
    );
}

export default Admin;
