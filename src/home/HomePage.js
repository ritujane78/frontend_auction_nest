// src/App.js
import React, { useState, useRef } from 'react';
import SignupPopup from '../Signup/SignupPopup'
import ItemBrowse from '../Auction/ItemBrowse';
import ItemSellPopup from '../Auction/ItemAuctionPopup';
import SigninPopup from '../Signin/SigninPopup';
import './home.css';
import { Link } from "react-router-dom";

function HomePage() {
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signinSuccess, setSigninSuccess] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const itemBrowseRef = useRef();


    const handleSignupClick = () => {
        setShowSignupPopup(true);
    };
    const handleSigninClick = () => {
        setShowSigninPopup(true);
    };
    const handleSellClick = () => {
        setShowSellPopup(true);
    }
    const handleSellClosePopup = () => {
        setShowSellPopup(false);
    };

    const handleSignupClosePopup = () => {
        setShowSignupPopup(false);
    };

    const handleSigninClosePopup = () => {
        setShowSigninPopup(false);
    };

    const handleSignupSuccess = () => {
        setSignupSuccess(true);
        setShowSignupPopup(false);
    };
    const handleBidSubmit = async (item_id, bidAmount) => {
        if (!bidAmount) {
            alert('Please enter a bid amount.');
            return;
        }

        // Assuming user_id is available in your app's context or props
        const user_id = 1; // Replace with actual user ID

        try {
            const response = await fetch('/bid/saveBid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: item_id,
                    user_id: user_id,
                    bid_amount: bidAmount,
                }),
            });

            if (response.ok) {
                alert('Bid placed successfully!');
                return true;
            } else {
                alert('Failed to place bid.');
                return false;
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid.');
            return false;
        }
    };
    const handleItemSaved = () => {
        if (itemBrowseRef.current) {
            itemBrowseRef.current.fetchItems();
        }
        setShowSellPopup(false);
    };


    return (
        <div className="App">
            <div className='button-container'>
                <Link id='clickText' to="/profile">Profile</Link>
                
                {!signinSuccess && (
                    <p id='clickText' onClick={handleSigninClick} >Sign in</p>
                )}
                <p id="clickText" onClick={handleSellClick}>Auction</p>
            </div>
            <ItemSellPopup 
                show = {showSellPopup} 
                onClose={handleSellClosePopup} 
                onItemSaved={handleItemSaved} 
            />         
            <SigninPopup 
                show={showSigninPopup} 
                onClose={handleSigninClosePopup} 
            />
            <SignupPopup 
                show={showSignupPopup} 
                onClose={handleSignupClosePopup} 
                onSuccess={handleSignupSuccess} 
            />
    
            <ItemBrowse ref={itemBrowseRef} onBidSubmit={handleBidSubmit} />
        </div>
        
    );
}

export default HomePage;
