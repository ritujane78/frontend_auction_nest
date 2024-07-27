import React, { useState } from 'react';
import { Link, UNSAFE_ErrorResponseImpl, useNavigate } from 'react-router-dom';
import LogoComponent from '../Logo/LogoComponent';
import './signup.css'

const SignupPage = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const getCurrentDateTime = () => {
        const date = new Date();
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const createdAt = getCurrentDateTime();
        const updatedAt = createdAt;

        const formData = {
            username,
            password,
            email,
            fullName,
            address,
            phoneNumber,
            createdAt,
            updatedAt
        };

        try{
            const response = await fetch('/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }
            const data = await response.json();
            setMessage(data.message);

            if(response.status === 200){
                setTimeout(()=> {
                    navigate("/");
                    setMessage('');
                },2000)
            }
        } catch(error){
            setMessage(error.message);
        }
    };

    return (
        <div className='container'>
            <div className='logo'>
                <LogoComponent />
            </div>
        <div className='form-container'>
            <h1>Signup</h1>
            <form id="signup-form" onSubmit={handleSignupSubmit}>
                <div className='form-group'>
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
                <div className='form-group'>
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
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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

export default SignupPage;
