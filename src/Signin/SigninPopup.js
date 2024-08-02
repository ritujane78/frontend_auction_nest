import { Link } from "react-router-dom";
import React, { useState } from 'react';
import './signin.css';

const SigninPopup = ({ show, onClose, onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Message: ${data.message}`);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('expirationTime', data.expirationTime);
                setTimeout(() => {
                    onSuccess();
                    setUsername('');
                    setPassword('');
                    setMessage('');
                }, 1000);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            setMessage(error.message);
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
                        autoComplete="off"
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <button className="signin-button" type="submit">Sign In</button>
                </form>
                {message && <p>{message}</p>}
                <p className="register-text">Not a user yet? &nbsp;
                    <Link id="register" to="/signup">Register!!</Link>
                </p>
            </div>
        </div>
    );
};

export default SigninPopup;
