import React, { useState, useRef, useEffect } from 'react';
import SignupPopup from '../Signup/SignupPopup';
import ItemBrowse from '../Auction/ItemBrowse';
import ItemSellPopup from '../Auction/ItemAuctionPopup';
import SigninPopup from '../Signin/SigninPopup';
import './home.css';
import { Link , useNavigate} from "react-router-dom";

function HomePage() {
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signinSuccess, setSigninSuccess] = useState(false);
    const [showSellPopup, setShowSellPopup] = useState(false);
    const itemBrowseRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        console.log("inside check");
        const expirationTime = localStorage.getItem('expirationTime');
        const currentTime = new Date().getTime();

        if (expirationTime && currentTime < expirationTime) {
            setSigninSuccess(true);
            console.log(expirationTime);
        } else {
            localStorage.removeItem('userId');
            localStorage.removeItem('expirationTime');
            setSigninSuccess(false);
        }
    };

    const handleSignupClick = () => {
        setShowSignupPopup(true);
    };

    const handleSigninClick = () => {
        setShowSigninPopup(true);
    };

    const handleSellClick = () => {
        setShowSellPopup(true);
    };

    const handleSellClosePopup = () => {
        setShowSellPopup(false);
    };

    const handleSignupClosePopup = () => {
        setShowSignupPopup(false);
    };

    const handleSigninClosePopup = () => {
        setShowSigninPopup(false);
    };

    const handleSigninSuccess = () => {
        setSigninSuccess(true);
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
        const user_id = parseInt(localStorage.getItem('userId')); // Replace with actual user ID

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
    const handlelLogoutClick = () =>{
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('userId');
        
        setSigninSuccess(false);
    }

    return (
        <div className="App">
            {signinSuccess ? (
                <div className='button-container'>
                    <Link id='clickText' to="/profile">Profile</Link>
                    <p id="clickText" onClick={handleSellClick}>Auction</p>
                    <p id='clickText' onClick={handlelLogoutClick}>Log out</p>

                </div>
            ) : (
                <p id='clickText' onClick={handleSigninClick}>Sign in</p>
            )}
            <ItemSellPopup 
                show={showSellPopup} 
                onClose={handleSellClosePopup} 
                onItemSaved={handleItemSaved} 
            />         
            <SigninPopup 
                show={showSigninPopup} 
                onClose={handleSigninClosePopup} 
                onSuccess={handleSigninSuccess}
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
