import { Link } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import SignupPage from "../Signup/SignupPage";

const SigninPopup = ({show, onClose}) =>{
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/signin', { id, password });
            setMessage(`User ID: ${response.data.userId}`);
            // You might want to store the token in local storage or context for future authenticated requests
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };
    const handleSignupSuccess = () => {
        // setSignupSuccess(true);
        // setShowSignupPopup(false);
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
                        value={id}
                        onChange={(e) => setId(e.target.value)}
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
            <p className="register">Not a user yet? &nbsp;
                <Link id="clickText" to="/signup">  Register!!</Link>
            </p>
        </div>
        <SignupPage 
                onSuccess={handleSignupSuccess} 
            />
    </div>
    )
}
export default SigninPopup