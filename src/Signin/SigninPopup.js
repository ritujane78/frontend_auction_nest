// SigninPopup.js
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import './signin.css';

const SigninPopup = ({ show, onClose, onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/signin', { username, password });
            setMessage(`Message: ${response.data.message}`);
            // Optionally store userId for session management
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('expirationTime', response.data.expirationTime);
            if (response.status === 200) {
                setTimeout(() => {
                    onSuccess();
                    setUsername('');
                    setPassword('');
                    setMessage('');
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h1>Sign In</h1>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="signin-button" type="submit">Sign In</button>
                </form>
                {message && <p>{message}</p>}
                <p className="registerText">Not a user yet? &nbsp;
                    <Link id="register" to="/signup">Register!!</Link>
                </p>
            </div>
        </div>
    );
};

export default SigninPopup;
