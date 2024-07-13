import { Link } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import 'signin.css'
const SigninPage = () =>{
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

    return (
        <div>
            <h1>Sign In</h1>
            <form className="signin-form" onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
            {message && <p>{message}</p>}
            <Link to="/">Go to Home</Link>
        </div>
    )
}
export default SigninPage