 
// src/SignupPopup.js
import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import '../popup.css'

const SignupPopup = ({ show, onClose, onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/signup', { username, password });
            setMessage(response.data.message);
            if (response.status === 200) {
                setTimeout(() => {
                    onSuccess();
                    setMessage('');
                }, 2000);
            }
        } catch (error) {
            setMessage(error.response.data.error); // This line can cause an error if error.response is undefined
        }
    };
    

    if (!show) {
        return null;
    }

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h1>Signup</h1>
                <form id="signup-form" onSubmit={handleSignupSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="signupButton" type="submit">Signup</button>
                </form>
                <div id="message">{message}</div>
            </div>
        </div>
    );
};

export default SignupPopup;
