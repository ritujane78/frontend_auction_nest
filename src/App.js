import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './home/HomePage';
import ProfilePage from './Profile/ProfilePage';
import SignupPage from './Signup/SignupPage';

function App() {

    return (
        <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element = {<SignupPage />} />
        </Routes>x
      </Router> 
    )       
}

export default App;
