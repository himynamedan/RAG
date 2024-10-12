// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import logout from './assets/logout.png';
import { useNavigate } from 'react-router-dom';


function Chat() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [firstName, setFirstName] = useState('');
    const chatWindowRef = useRef(null);
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFirstName(docSnap.data().firstName);
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSendMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
        setQuestion(message);
    };

    useEffect(() => {
        const fetchData = async (question) => {
            try {
                const response = await fetch(`http://localhost:5000/ask?question=${encodeURIComponent(question)}`);
                const data = await response.json();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: data.result, sender: 'bot' }
                ]);
            } catch (error) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Network Error', sender: 'bot' }
                ]);
            }
        };

        if (question) {
            fetchData(question);
        }
    }, [question]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="App">
            <div className='ellipse'></div>
            <div className='ellipse1'></div>
            <button className="logout-button" style={{"margin":20,}}onClick={handleLogout}>
                <img src={logout} width="50" alt="Logout" className="logout-icon" />
            </button>
            <div className="mainheading">
                <div>
                    <center><h2 className="main-heading-text">Welcome {firstName}!</h2> </center>
                    <center><p className="main-heading-smalltext">Ask away</p></center>
                </div>
            </div>
            <div className="chat-container">
                <ChatWindow messages={messages} chatWindowRef={chatWindowRef} />
                <MessageInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}

function ChatWindow({ messages, chatWindowRef }) {
    // Render messages in reverse order
    return (
        <div className="chat-window" ref={chatWindowRef}>
            {messages.slice(0).reverse().map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                    {message.text}
                </div>
            ))}
        </div>
    );
}

function MessageInput({ onSendMessage }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input
                className="input-text"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
}

export default Chat;
